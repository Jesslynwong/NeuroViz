/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-10-18 14:18:18
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-24 11:47:41
 * @FilePath: /dataVis/src/page/Report/DistributionBarChart.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import Decimal from "decimal.js";

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
    selectedField: string;
  };
  showLabel?: boolean;
}

export type BarChartDataProps = DistributionBarChartProps["data"];

export default function DistributionBarChart({
  data,
  showLabel,
}: DistributionBarChartProps) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption(data, showLabel)}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
  );
}

function getOption(data: BarChartDataProps, showLabel?: boolean) {
  const selectedFieldName =
    data.selectedField.charAt(0).toUpperCase() + data.selectedField.slice(1);
  const sortedDataSource = [...data.source].sort((a, b) => a[0] - b[0]);
  const sortedAxisSource = sortedDataSource.map((v) => v[0]);

  const yAxisLineChartName =
    data.yAxisTitle.charAt(0).toUpperCase() + data.yAxisTitle.slice(1);

  const min = sortedAxisSource[0];
  const max = sortedAxisSource[sortedAxisSource.length - 1];
  const offset = max - min;

  let splitNumber = 10;
  let interval = new Decimal(2);
  if (offset / splitNumber > 2) {
    interval = new Decimal(Math.ceil(offset / splitNumber));
  } else {
    interval = new Decimal(offset).dividedBy(splitNumber);
  }

  const axisMin = new Decimal(min).dividedBy(interval).floor().times(interval);
  const axisMax = new Decimal(max).dividedBy(interval).ceil().times(interval);

  let count = 0;

  while (interval.times(count).plus(min).lessThan(max)) {
    count++;
  }
  splitNumber = count;

  const xAxisLabel = Array.from({ length: splitNumber }).map((_, i) =>
    interval.times(i).plus(axisMin).toNumber()
  );
  xAxisLabel.push(axisMax.toNumber());

  const yAxisArr: number[] = [];
  const averageArr: number[] = [];

  let wipIndex = 0;
  const frequenceArr = Array.from({ length: splitNumber }).map((_, i) => {
    const currentRange = [xAxisLabel[i], xAxisLabel[i + 1]];

    let count = 0;
    yAxisArr[i] = 0;
    while (
      typeof sortedAxisSource[wipIndex] === "number" &&
      sortedAxisSource[wipIndex] >= currentRange[0] &&
      sortedAxisSource[wipIndex] < currentRange[1]
    ) {
      yAxisArr[i] = yAxisArr[i] + sortedDataSource[wipIndex][1];
      count++;
      wipIndex++;
    }

    averageArr[i] = yAxisArr[i] / count;
    if (isNaN(averageArr[i])) {
      averageArr[i] = 0;
    }

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
        return `${selectedFieldName} 
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
      data: ["Frequence", "Average", yAxisLineChartName],
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
                return `${selectedFieldName} [${xAxisLabel[index]}, ${
                  xAxisLabel[index + 1]
                })`;
              } else {
                return "";
              }
            },
          },
        },
      },
      {
        type: "category",
        nameLocation: "middle",
        nameGap: 30,
        name: selectedFieldName,
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
        name: "Average",
        position: "right",
        alignTicks: true,
        axisLine: {
          show: true,
        },
      },
      {
        type: "value",
        name: yAxisLineChartName,
        nameGap: 20,
        position: "right",
        nameLocation: "start",
        axisLine: {
          show: true,
          onZero: false,
        },
        axisTick: {
          show: true,
          alignWithLabel: false,
        },
        offset: -1,
      },
    ],
    series: [
      {
        name: "Frequence",
        data: frequenceArr,
        label: {
          show: showLabel,
          formatter: function (params: any) {
            return params.value.toFixed(2);
          },
        },
        type: "bar",
        barWidth: "100%",
        xAxisIndex: 0,
      },
      {
        name: "Average",
        type: "line",
        yAxisIndex: 1,
        data: averageArr,
      },
      {
        name: yAxisLineChartName,
        type: "line",
        yAxisIndex: 1,
        data: yAxisArr,
        label: {
          show: showLabel,
        },
      },
    ],
  };
}
