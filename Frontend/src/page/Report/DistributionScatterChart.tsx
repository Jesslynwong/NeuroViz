/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-10-23 18:04:24
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-24 11:53:23
 * @FilePath: /dataVis/src/page/Report/ScatterChart.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from "echarts/core";
import ReactEChartsCore from "echarts-for-react/lib/core";

import { GridComponent, GridComponentOption } from "echarts/components";
import { ScatterChart, ScatterSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, ScatterChart, CanvasRenderer, UniversalTransition]);

export interface DistributionScatterChartProps {
  data: number[][];
  xAxisTitle: string;
  yAxisTitle: string;
  color: string;
}

export default function DistributionScatterChart({
  data,
  xAxisTitle,
  yAxisTitle,
  color,
}: DistributionScatterChartProps) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={getOption(data, xAxisTitle, yAxisTitle, color)}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      //   onChartReady={this.onChartReadyCallback}
      //   onEvents={EventsDict}
      //   opts={}
    />
  );
}

function getOption(
  data: number[][],
  xAxisTitle: string,
  yAxisTitle: string,
  color: string
) {
  return {
    xAxis: {
      scale: true,
      name: xAxisTitle.charAt(0).toUpperCase() + xAxisTitle.slice(1),
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontSize: 14,
      },
      axisLabel: {
        margin: 12,
      },
    },
    yAxis: {
      scale: true,
      name: yAxisTitle.charAt(0).toUpperCase() + yAxisTitle.slice(1),
      nameLocation: "end",
      nameGap: 20,
      nameTextStyle: {
        fontSize: 14,
      },
      axisLabel: {
        margin: 12,
      },
    },
    series: [
      {
        type: "scatter",
        data,
        itemStyle: {
          color,
        },
      },
    ],
    tooltip: {
      showDelay: 0,
      formatter: function (params: any) {
        return (
          "• " +
          xAxisTitle +
          " : " +
          params.value[0] +
          "<br/>" +
          "• " +
          yAxisTitle +
          " : " +
          params.value[1]
        );
      },
    },
  };
}
