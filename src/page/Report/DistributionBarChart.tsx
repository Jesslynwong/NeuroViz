/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-10-18 14:18:18
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-24 11:47:41
 * @FilePath: /dataVis/src/page/Report/DistributionBarChart.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

export interface DistributionBarChartProps {
  data: {
    xAxisLabel: number[];
    yAxisTitle: string;
    source: number[][];
  };
  color: string;
}

export type BarChartDataProps = DistributionBarChartProps["data"];

export default function DistributionBarChart({
  data,
  color,
}: DistributionBarChartProps) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption(data, color, 20)}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
  );
}

function getOption(data: BarChartDataProps, color: string, barCount: number) {
  const sortedDataSource = [...data.source].sort((a, b) => a[0] - b[0]);
  const sortedAxisSource = sortedDataSource.map((v) => v[0]);

  const yAxisLineChartName =
    data.yAxisTitle.charAt(0).toUpperCase() + data.yAxisTitle.slice(1);

  const min = sortedAxisSource[0];
  const max = sortedAxisSource[sortedAxisSource.length - 1];
  const diff = max - min;
  const baseUnit = (diff > 1000 ? 10 : 5) ** (diff.toString().length - 1) || 1;
  const axisMin = Math.floor(min / baseUnit) * baseUnit;
  const axisMax = Math.ceil(max / baseUnit) * baseUnit;

  const gap = (axisMax - axisMin) / barCount;

  const xAxisLabel = Array.from({ length: barCount }).map(
    (_, i) => axisMin + i * gap
  );
  xAxisLabel.push(axisMax);

  console.log(">> xAxisLabel: ", xAxisLabel);
  const yAxisArr: number[] = [];
  const averageArr: number[] = [];

  let wipIndex = 0;
  const frequenceArr = Array.from({ length: barCount }).map((_, i) => {
    const currentRange = [xAxisLabel[i], xAxisLabel[i + 1]];

    let count = 0;
    yAxisArr[i] = 0;
    while (
      typeof sortedAxisSource[wipIndex] === "number" &&
      sortedAxisSource[wipIndex] >= currentRange[0] &&
      sortedAxisSource[wipIndex] < currentRange[1]
    ) {
      yAxisArr[i] = (yAxisArr[i] ?? 0) + sortedDataSource[wipIndex][1];
      count++;
      wipIndex++;
    }

    averageArr[i] = yAxisArr[i] / count;

    return count / sortedAxisSource.length;
  });

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: (items: any[]) => {
        if (!items[0]) {
          return "";
        }
        return `
        [${xAxisLabel[items[0].dataIndex]}, ${
          xAxisLabel[items[0].dataIndex + 1]
        }) <br />
        ${items
          .map(
            (v) => `
           <div style="width: 100%; display: flex; justify-content: space-between;">
          <span>${v.marker} ${v.seriesName}:</span>   <span>${v.data}</span>
        </div>
          `
          )
          .join("")} 
        `;
      },
    },
    legend: {
      data: ["Frequence", yAxisLineChartName, "Average"],
    },
    xAxis: [
      {
        type: "category",
        data: xAxisLabel.slice(1),
        show: false,
        axisPointer: {
          label: {
            formatter: (params: any) => {
              const index: number | undefined = params.seriesData[0].dataIndex;
              if (typeof index === "number") {
                return `[${xAxisLabel[index]}, ${xAxisLabel[index + 1]})`;
              } else {
                return "";
              }
            },
          },
        },
      },
      {
        type: "category",
        data: xAxisLabel,
        axisTick: {
          alignWithLabel: false,
        },
        position: "bottom",
        boundaryGap: false,
        axisPointer: { show: false },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Frequence",
        position: "left",
        nameGap: 20,
        alignTicks: true,
        axisLine: {
          show: true,
        },
      },
      {
        type: "value",
        name: yAxisLineChartName,
        position: "right",
        alignTicks: true,
        axisLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: "Frequence",
        data: frequenceArr,
        type: "bar",
        xAxisIndex: 0,
      },
      {
        name: yAxisLineChartName,
        type: "line",
        yAxisIndex: 1,
        data: yAxisArr,
      },
      {
        name: "Average",
        type: "line",
        yAxisIndex: 1,
        data: averageArr.map((v) => (isNaN(v) ? "0" : v)),
      },
    ],
  };
}
