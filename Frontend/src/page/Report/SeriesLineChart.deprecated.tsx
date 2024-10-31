import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useMemo } from "react";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type SeriesLineChartItem = {
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

interface SeriesLineChartProps {
  data: { [K in string]: SeriesLineChartItem };
}
export default function SeriesLineChart({ data }: SeriesLineChartProps) {
  const option = useMemo(() => {
    const convertedData = convertData(data);
    return {
      title: {
        text: "Descriptive Statistics",
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: convertedData.xAxisData,
      },
      yAxis: {
        type: "value",
      },
      legend: convertedData.legend,
      series: convertedData.series,
    };
  }, [data]);

  useEffect(() => {
    const chartDom = document.getElementById("linechart");
    if (chartDom) {
      const lineChart = echarts.init(chartDom);
      lineChart.setOption(option);
      const resize = () => lineChart.resize();
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [option]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div id="linechart" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

function convertData(data: { [x: string]: SeriesLineChartItem }) {
  const names = Object.keys(data);
  const itemKeys = [
    "count",
    "mean",
    "std",
    "min",
    "25%",
    "50%",
    "75%",
    "max",
    "median",
  ] as const;

  const series = names.map((name) => {
    const item = data[name];
    const vals = itemKeys.map((key) => item[key]);
    return { name, data: vals, type: "line", stack: "Total" };
  });

  return {
    series,
    legend: { data: names },
    xAxisData: [...itemKeys],
  };
}
