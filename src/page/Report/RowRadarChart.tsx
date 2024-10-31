import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useMemo, useState } from "react";
import { ResponsedObject } from ".";
import styled from "styled-components";
import { Avatar, Card, List } from "antd";
import { ReactComponent as Insight } from "../../assets/svgs/insight.svg";
import { ReactComponent as Description } from "../../assets/svgs/description.svg";
import { ReactComponent as Suggest } from "../../assets/svgs/suggest.svg";
import { ReactComponent as Idea } from "../../assets/svgs/idea.svg";
import { SVGWrapper } from "../../components/styled.components";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
]);

type Action = "description" | "suggest" | "insight";

interface RowRadarChartProps<T extends string = string>
  extends Pick<ResponsedObject, "corr_comment"> {
  fieldToShow: T;
  correlation_matrix: ResponsedObject["json_report"]["report"]["analysis_results"]["correlation_matrix"];
}

export default function RowRadarChart({
  correlation_matrix,
  fieldToShow,
  corr_comment,
}: RowRadarChartProps) {
  const option = useMemo(() => {
    return getChartOption(fieldToShow, correlation_matrix);
  }, [correlation_matrix, fieldToShow]);

  const [activeAction, setActiveAction] = useState<Action>("description");

  useEffect(() => {
    const chartDom = document.getElementById(`radarChart-${fieldToShow}`);
    if (chartDom) {
      const radar = echarts.init(chartDom);
      radar.setOption(option);
      const resize = () => radar.resize();
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [fieldToShow, option]);

  const matchedComment = corr_comment?.target_variables[fieldToShow];

  const renderColor = (key: Action) => {
    return key === activeAction ? "skyblue" : "#ccc";
  };
  const actions: React.ReactNode[] = [
    <SVGWrapper
      color={renderColor("description")}
      hoverColor="skyblue"
      onClick={() => setActiveAction("description")}
    >
      <Description title="description" />
    </SVGWrapper>,
    <SVGWrapper
      width="16px"
      color={renderColor("insight")}
      hoverColor="skyblue"
      onClick={() => setActiveAction("insight")}
    >
      <Insight title="insight" />
    </SVGWrapper>,
    <SVGWrapper
      color={renderColor("suggest")}
      hoverColor="skyblue"
      onClick={() => setActiveAction("suggest")}
    >
      <Suggest title="suggest" />
    </SVGWrapper>,
  ];

  const renderDescription = () => {
    switch (activeAction) {
      case "description":
        return (
          <Card.Meta
            avatar={
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=100" />
            }
            title="Explanation"
            description={matchedComment.explanation}
          />
        );
      case "insight":
        return (
          <List
            header={<StyledHeader>Relationship Insights</StyledHeader>}
            itemLayout="horizontal"
            dataSource={matchedComment.relationship_insights}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={item.Variables}
                  description={item.Insight}
                />
              </List.Item>
            )}
          />
        );

      case "suggest":
        return (
          <List
            header={<StyledHeader>Analysis Suggestions</StyledHeader>}
            itemLayout="horizontal"
            dataSource={matchedComment.analysis_suggestions}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <SVGWrapper color="orange">
                      <Idea />
                    </SVGWrapper>
                  }
                  description={item.Suggestion}
                />
              </List.Item>
            )}
          />
        );
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <div
        id={`radarChart-${fieldToShow}`}
        style={{ flex: 1, height: "100%", minWidth: "500px" }}
      />
      {matchedComment && (
        <CommentWrapper>
          <Card actions={actions}>{renderDescription()}</Card>
        </CommentWrapper>
      )}
    </Wrapper>
  );
}

const StyledHeader = styled.h3`
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
`;

const CommentWrapper = styled.div`
  min-width: 180px;
  width: 30%;
  height: 100%;
  overflow: scroll;
`;

const getChartOption = (
  field: RowRadarChartProps["fieldToShow"],
  matrix: RowRadarChartProps["correlation_matrix"]
) => {
  const fields = Object.keys(matrix).filter((f) => f !== field);
  const indicator = fields.map((v) => ({
    name: v,
    min: -1,
    max: 1,
    color: "teal",
  }));

  return {
    title: {
      text: `Correlation Matrix of ${field}`,
    },
    tooltip: {
      trigger: "item",
    },
    radar: {
      splitArea: {
        areaStyle: {
          color: ["rgba(242, 49, 49,.2)", "rgba(18, 223, 235,.2)"],
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowBlur: 10,
          opacity: 0.4,
        },
      },
      splitNumber: 2,
      splitLine: {
        show: false,
      },
      indicator,
    },
    series: [
      {
        name: "correlation_matrix",
        type: "radar",
        symbol: "none",
        lineStyle: {
          width: 1,
        },
        emphasis: {
          areaStyle: {
            color: "rgba(0,250,0,0.3)",
          },
        },
        data: [
          {
            value: fields.map((v) => matrix[field][v]),
            name: field,
          },
        ],
      },
    ],
  };
};
