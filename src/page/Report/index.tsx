import { Button, Card, ConfigProvider, message, Tabs, TabsProps } from "antd";
import styled from "styled-components";
import Ideas from "./IdeasTab";
import { useNavigate, useParams } from "react-router-dom";
import StatisticsTab from "./StatisticsTab";
import DistributiveTab from "./DistributiveTab";

import template from "../../stubs/template.json";
import { useGlobalContext } from "../../App";
import { useMemo } from "react";
import { jsonizeData } from "../../utils";

export type Item = {
  count: number;
  mean: number;
  std: number;
  min: number;
  "25%": number;
  "50%": number;
  "75%": number;
  max: number;
  median: number;
};

export type JsonReport<T extends string = string> = {
  report: {
    title: string;
    missing_values: unknown;
    outliers: {
      [K in T]: number[];
    };
    analysis_results: {
      statistical_analysis_fields: T[];
      x_axis_fields: T[];
      y_axis_field: T;
      descriptive_statistics: {
        [K in T]: Item;
      };
      correlation_matrix: {
        [K in T]: {
          [K in T]: number;
        };
      };
    };
  };
  Ideas: {
    ideas: {
      Idea: string;
      Idea_No: string;
      Reasoning: string;
      Solution: string;
    }[];
    summary: string;
  };
};

export type JsonSource = { [key: string]: number | string };

export type RelationShipInsight = {
  Insight: string;
  Insight_No: string;
  Variables: string;
};

export type AnalysisSuggestion = {
  Suggestion: string;
  Suggestion_No: string;
};

export interface ResponsedObject<T extends string = string> {
  status: string;
  message: string;
  json_report: JsonReport<T>;
  json_source: JsonSource;
  start_count: { [K in T]: number };
  corr_comment: {
    target_variables: {
      [K in T]: {
        explanation: string;
        relationship_insights: RelationShipInsight[];
        analysis_suggestions: AnalysisSuggestion[];
      };
    };
  };
}

export default function Report() {
  const { uid } = useParams();
  const { fileList, setFileList } = useGlobalContext();

  const fileResponse = useMemo(() => {
    const matchedFile = fileList.find((file) => file.uid === uid);

    // todo: remove local mock data
    return {
      status: "succeed",
      message: "message",
      json_report: jsonizeData(template.json_report),
      json_source: jsonizeData(template.json_source),
      start_count: template.start_count,
      corr_comment: jsonizeData(template.corr_comment),
    } as ResponsedObject;
    return matchedFile?.response.response as ResponsedObject;
  }, [fileList, uid]);

  const navigate = useNavigate();

  if (!fileResponse) {
    setFileList(fileList.filter((v) => v.uid !== uid));
    message.error("Unexpected error happened!");
    navigate("/");
  }

  const { report, Ideas: ideas } = fileResponse.json_report;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Statistics",
      children: (
        <StatisticsTab
          dataSource={{
            analysis_results: report.analysis_results,
            outliers: report.outliers,
            start_count: fileResponse.start_count,
            corr_comment: fileResponse.corr_comment,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Factor Distributive",
      children: (
        <DistributiveTab
          dataSource={{
            rawData: fileResponse.json_source,
            xAxisLabel: report.analysis_results.x_axis_fields,
            yAxisLabel: report.analysis_results.y_axis_field,
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Ideas",
      children: <Ideas dataSource={ideas} />,
    },
  ];

  return (
    <ReportWrapper>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerSplitColor: "#bec0da",
            },
            Tabs: {
              inkBarColor: "#6e75b3",
              itemSelectedColor: "#6e75b3",
              itemHoverColor: "#6e75b3",
              itemColor: "#bec0da",
              fontSize: 16,
            },
          },
        }}
      >
        <Card>
          <Tabs
            defaultActiveKey="1"
            items={items}
            tabBarExtraContent={
              <StyledButton onClick={() => navigate("/")}>Back</StyledButton>
            }
          />
        </Card>
      </ConfigProvider>
    </ReportWrapper>
  );
}

const ReportWrapper = styled.div`
  padding: 20px;
`;

const StyledButton = styled(Button)`
  color: #bec0da;
  border-color: #d1d3eb;
  &:hover {
    color: #6e75b3 !important;
    border-color: #a2a9ea !important;
  }
`;
