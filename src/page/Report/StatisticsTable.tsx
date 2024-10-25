import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Badge, Table, TableProps, Tooltip } from "antd";
import styled from "styled-components";
import RowRadarChart from "./RowRadarChart";
import { Item, JsonReport, ResponsedObject } from ".";
import starEmpty from "../../assets/svgs/star_empty.svg";
import star from "../../assets/svgs/star_02.svg";
import axisX from "../../assets/svgs/axis_x.svg";
import axisY from "../../assets/svgs/axis_y.svg";
import extra from "../../assets/svgs/extra.svg";
import { ReactComponent as Discrete } from "../../assets/svgs/discrete.svg";
import { StyledImg } from "../../components/styled.components";

type DataType = Item & { key: string; name: string };

export interface StatisticsTableProps {
  dataSource: Pick<JsonReport["report"], "analysis_results" | "outliers"> &
    Pick<ResponsedObject, "start_count" | "corr_comment">;
}

export default function StatisticsTable({
  dataSource: { analysis_results, outliers, start_count, corr_comment },
}: StatisticsTableProps) {
  const {
    descriptive_statistics,
    correlation_matrix,
    x_axis_fields,
    y_axis_field,
  } = analysis_results;
  const items = [
    "mean",
    "count",
    "std",
    "25%",
    "50%",
    "75%",
    "min",
    "median",
    "max",
  ] as const;
  const fieldNames = Object.keys(descriptive_statistics);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Axis",
      dataIndex: "name",
      fixed: "left",
      align: "center",
      render: (text) => (
        <StyledAxisField>
          {x_axis_fields.includes(text) ? (
            <StyledImg width="24px" heigh="24px" src={axisX} alt="axis_x" />
          ) : y_axis_field.includes(text) ? (
            <StyledImg width="24px" heigh="24px" src={axisY} alt="axis_y" />
          ) : (
            ""
          )}
        </StyledAxisField>
      ),
    },
    {
      title: "Field",
      dataIndex: "name",
      align: "center",
      fixed: "left",
      render: (text) => <StyledNameFiled>{text}</StyledNameFiled>,
    },
    {
      title: "Stars",
      align: "center",
      dataIndex: "start_count",
      render: (data) => <Stars count={data} />,
    },

    {
      title: "Outliers",
      dataIndex: "outliers",
      align: "center",
      render: (data: number[]) => {
        return (
          <Tooltip
            title={`[ ${data.sort((a, b) => a - b).join(", ")} ]`}
            color={"cyan"}
          >
            <Discrete
              style={{
                verticalAlign: "middle",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fill: "#666",
              }}
            />
          </Tooltip>
        );
      },
    },
    ...items.map((v) => ({
      title: v,
      dataIndex: v,
      sorter: { compare: (a: DataType, b: DataType) => a[v] - b[v] },
      align: "center" as const,
      render: (text: string) => <StyledCellValue>{text}</StyledCellValue>,
    })),
  ];

  const data: DataType[] = fieldNames.map((field) => ({
    ...descriptive_statistics[field],
    name: field,
    key: field,
    outliers: outliers[field],
    start_count: start_count[field] || null,
    corr_comment: corr_comment,
  }));

  return (
    <TableWrapper>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: "max-content" }}
        pagination={false}
        expandable={{
          expandIcon: (props) => (
            <div>
              {props.expanded ? (
                <FullscreenExitOutlined
                  style={{ color: "#204448", opacity: 0.6 }}
                  onClick={(e) => props.onExpand(props.record, e)}
                />
              ) : (
                <FullscreenOutlined
                  style={{ color: "#204448", opacity: 0.6 }}
                  onClick={(e) => props.onExpand(props.record, e)}
                />
              )}
            </div>
          ),
          expandedRowRender: (data) => (
            <RowRadarChart
              fieldToShow={data.name}
              correlation_matrix={correlation_matrix}
              corr_comment={corr_comment}
            />
          ),
        }}
      />
    </TableWrapper>
  );
}

const Stars = ({
  count,
  totalCount = 5,
}: {
  count: number;
  totalCount?: number;
}) => {
  return (
    <div>
      {!count
        ? "-"
        : Array.from({ length: totalCount }).map((_, i) => (
            <StyledImg
              style={{ opacity: i < count ? 1 : 0.4 }}
              src={i < count ? star : starEmpty}
              alt="star empty"
              width="20px"
              heigh="20px"
            />
          ))}
    </div>
  );
};

const TableWrapper = styled.div``;

const StyledNameFiled = styled.div`
  text-align: left;
  color: #4e5386;
  font-weight: 500;
  font-size: 16px;
`;

const StyledAxisField = styled.div``;

const StyledCellValue = styled.span`
  color: #4e3d55;
  opacity: 0.7;
`;
