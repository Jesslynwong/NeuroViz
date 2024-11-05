import * as echarts from "echarts/core";
import { Button, Card, ConfigProvider, message, Tabs, TabsProps } from "antd";
import styled from "styled-components";
import Ideas from "./IdeasTab";
import { useNavigate, useParams } from "react-router-dom";
import StatisticsTab from "./StatisticsTab";
import DistributiveTab from "./DistributiveTab";

import template from "../../stubs/template.json";
import { useGlobalContext } from "../../App";
import { useMemo, useRef } from "react";
import { jsonizeData } from "../../utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getRadarChartOption } from "./RowRadarChart";

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

export type JsonSource<T extends string = string> = {
  [K in T]: Record<number, string | number>;
};

export type AxisRangePoint = {
  x_range_point: number[];
  y_range_point: number[];
};

export type ImgRange<T extends string = string> = {
  Kmean_img_range: {
    [K in T]: AxisRangePoint;
  };
  histogram_img_range: {
    [K in T]: AxisRangePoint & { group: number[] };
  };
  line_img_range: {
    [K in T]: AxisRangePoint;
  };
  pie_img_range: {
    [K in T]: AxisRangePoint;
  };
  scatter_img_range: {
    [K in T]: AxisRangePoint;
  };
};

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
  json_source: JsonSource<T>;
  start_count: { [K in T]: number };
  Img_range: ImgRange<T>;
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
  const { fileList, setFileList, reportData } = useGlobalContext();
  const offscreenChartRefs = useRef<HTMLDivElement[]>([]);

  const fileResponse = useMemo(() => {
    const matchedFile = fileList.find((file) => file.uid === uid);

    if (process.env.NODE_ENV === "development") {
      return {
        status: "succeed",
        message: "message",
        json_report: jsonizeData(template.json_report),
        json_source: jsonizeData(template.json_source),
        start_count: template.start_count,
        corr_comment: jsonizeData(template.corr_comment),
        Img_range: template.Img_range,
      } as ResponsedObject;
    }
    return matchedFile?.response.response as ResponsedObject;
  }, [fileList, uid]);

  const navigate = useNavigate();

  async function generateRadarChartImageAndDescription() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 480;

    const chart = echarts.init(canvas);

    const radarFieldNames = Object.keys(
      fileResponse.json_report.report.analysis_results.descriptive_statistics
    );

    const data: {
      [K in string]: {
        img: string;
      } & ResponsedObject["corr_comment"]["target_variables"][string];
    } = {};
    for await (const element of radarFieldNames) {
      const option = getRadarChartOption(
        element,
        fileResponse.json_report.report.analysis_results.correlation_matrix,
        true
      );

      const targetVariables =
        fileResponse.corr_comment.target_variables[element];

      chart.setOption(option);
      const chartImage = chart.getDataURL({
        type: "png",
      });
      data[element] = {
        img: chartImage,
        ...targetVariables,
      };
    }

    return [data, canvas.width, canvas.height] as const;
  }

  const exportPDF = async () => {
    const table = document.querySelector("table");
    if (table) {
      try {
        const canvas = await html2canvas(table as HTMLElement, { scale: 1 });

        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: "a1",
        });

        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth = pdf.internal.pageSize.width;
        const marginLeft = 10;
        const marginTop = 20;
        const subTitleFontSize = 48;
        const textFontSize = 10;
        let yPosition = 20;

        const placeHeight = (target: number) => {
          yPosition += target + marginTop;
          if (yPosition > pageHeight) {
            pdf.addPage();
            yPosition = target + marginTop;
          }
          return yPosition - target;
        };

        const newPage = () => {
          yPosition = marginTop;
          pdf.addPage();
        };

        pdf.setFontSize(subTitleFontSize);
        pdf.setFont("helvetica", "bold");

        pdf.text("Statistic", marginLeft, placeHeight(subTitleFontSize));

        const image = canvas.toDataURL("image/png");
        pdf.addImage(
          image,
          "PNG",
          marginLeft,
          placeHeight(canvas.height),
          canvas.width,
          canvas.height
        );

        const [chartData, chartImageWidth, chartImageHeight] =
          await generateRadarChartImageAndDescription();

        Object.entries(chartData).forEach(([field, data]) => {
          const currentY = placeHeight(chartImageHeight);
          const { img, ...rest } = data;
          pdf.addImage(
            img,
            "PNG",
            marginLeft,
            currentY,
            chartImageWidth,
            chartImageHeight
          );
          if (rest.explanation) {
            const jsonString = JSON.stringify(rest, null, 2);
            pdf.setFontSize(textFontSize);
            pdf.setFont("helvetica", "normal");
            pdf.text(
              jsonString,
              2 * marginLeft + chartImageWidth,
              currentY + subTitleFontSize + marginTop,
              { maxWidth: pageWidth - (3 * marginLeft + chartImageWidth) }
            );
          }
        });

        newPage();
        pdf.setFontSize(subTitleFontSize);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          "Factor Distribution",
          marginLeft,
          placeHeight(subTitleFontSize)
        );

        for await (const element of offscreenChartRefs.current) {
          const canvas = await html2canvas(element, { scale: 1 });
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(
            imgData,
            "PNG",
            marginLeft,
            placeHeight(canvas.height),
            canvas.width,
            canvas.height
          );
        }

        newPage();
        pdf.text("Ideas", marginLeft, 2 * marginTop);
        const jsonString = JSON.stringify(
          fileResponse.json_report.Ideas,
          null,
          2
        );
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        pdf.text(jsonString, marginLeft, 3 * marginTop + subTitleFontSize, {
          maxWidth: pageWidth - 2 * marginLeft,
        });

        pdf.save("report.pdf");
      } catch (error) {
        message.error("Something wrong!");
      }
    }
  };

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
            imgRange: fileResponse.Img_range,
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
              <div>
                <StyledButton onClick={() => navigate("/")}>Back</StyledButton>
                <StyledButton
                  style={{ marginLeft: "12px" }}
                  onClick={exportPDF}
                >
                  Export
                </StyledButton>
              </div>
            }
          />
        </Card>
        {report.analysis_results.x_axis_fields.map((_, i) => (
          <DistributiveTab
            ref={(ref) => {
              if (ref) {
                offscreenChartRefs.current[i] = ref;
              }
            }}
            exportPDF={true}
            exportIndex={i}
            dataSource={{
              rawData: fileResponse.json_source,
              xAxisLabel: report.analysis_results.x_axis_fields,
              yAxisLabel: report.analysis_results.y_axis_field,
              imgRange: fileResponse.Img_range,
            }}
          />
        ))}
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
