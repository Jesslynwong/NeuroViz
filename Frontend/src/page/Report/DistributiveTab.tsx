/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-10-17 10:06:08
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-24 11:44:58
 * @FilePath: /dataVis/src/page/Report/DistributiveTab.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { forwardRef, useMemo, useState } from "react";
import DistributiveBarChart, {
  BarChartDataProps,
} from "./DistributionBarChart";
import DistributionScatterChart from "./DistributionScatterChart";
import { JsonSource, ResponsedObject } from "./index";
import { getColor } from "../../utils/colors";
const attrs = ["deposit", "age", "liability"];

interface DistributiveTabProps {
  exportPDF?: boolean;
  exportIndex?: number;
  dataSource: {
    rawData: ResponsedObject["json_source"];
    xAxisLabel: string[];
    yAxisLabel: string;
    imgRange: ResponsedObject["Img_range"];
  };
}
export default forwardRef<HTMLDivElement, DistributiveTabProps>(
  function DistributiveTab({ dataSource, exportPDF, exportIndex }, ref) {
    const { rawData, xAxisLabel, yAxisLabel, imgRange } = dataSource;
    const selectiveAttr: string[] = [...xAxisLabel];
    const [nameIdx, setSelectedNameIdx] = useState(0);
    const selectedNameIdx = useMemo(() => {
      return exportPDF ? exportIndex || 0 : nameIdx;
    }, [exportPDF, exportIndex, nameIdx]);
    // attrs
    const items: MenuProps["items"] = selectiveAttr.map((val, idx) => {
      return {
        key: idx,
        label: <div onClick={() => setSelectedNameIdx(idx)}>{val}</div>,
      };
    });

    interface Cal2Darr {
      [key: string]: number;
    }

    const get2Darr = (xObj: Cal2Darr, yObj: Cal2Darr): number[][] => {
      const x = Object.values(xObj);
      const y = Object.values(yObj);
      const mergedArray = x.map((value, index) => [value, y[index]]);
      return mergedArray;
    };

    const getBarChartData = () => {
      const matched =
        imgRange.histogram_img_range[selectiveAttr[selectedNameIdx]];
      return {
        xAxisLabel: matched.x_range_point,
        yValue: matched.group,
        yAxisTitle: yAxisLabel,
        source: get2Darr(
          rawData[selectiveAttr[selectedNameIdx]] as unknown as Cal2Darr,
          rawData[yAxisLabel] as unknown as Cal2Darr
        ),
      };
    };

    return (
      <div
        ref={ref}
        style={{
          ...(exportPDF
            ? {
                position: "absolute",
                top: "-10000px",
                width: "1400px",
                height: "700px",
              }
            : {}),
        }}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ color: "#5470C6", fontWeight: 500 }}>
              {selectiveAttr[selectedNameIdx]}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <DistributiveBarChart
          showLabel={exportPDF}
          data={getBarChartData()}
          color={getColor(selectedNameIdx)}
        />
        <DistributionScatterChart
          data={get2Darr(
            rawData[selectiveAttr[selectedNameIdx]] as unknown as Cal2Darr,
            rawData[yAxisLabel] as unknown as Cal2Darr
          )}
          xAxisTitle={xAxisLabel[selectedNameIdx]}
          yAxisTitle={yAxisLabel}
          color={getColor(selectedNameIdx)}
        />
      </div>
    );
  }
);
