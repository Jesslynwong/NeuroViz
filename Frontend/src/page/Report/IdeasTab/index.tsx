/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-12 17:09:20
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-17 10:34:29
 * @FilePath: /dataVis/src/page/Ideas/index.tsx
 */
import { Table } from "antd";
import type { TableProps } from "antd";
import { Card } from "antd";
import "./index.css";
import { JsonReport } from "..";

type DataType = JsonReport["Ideas"]["ideas"][number];

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Idea No",
    dataIndex: "Idea_No",
    align: "center",
    render: (val) => (
      <div style={{ width: "60px", fontFamily: "Fustat", fontSize: "18px" }}>
        {val}
      </div>
    ),
  },
  {
    title: "Idea",
    dataIndex: "Idea",
    render: (val) => <div style={{ fontFamily: "Fustat" }}>{val}</div>,
  },
  {
    title: "Reasoning",
    dataIndex: "Reasoning",
    render: (val) => <div style={{ fontFamily: "Fustat" }}>{val}</div>,
  },
  {
    title: "Solution",
    dataIndex: "Solution",
    render: (val) => <div style={{ fontFamily: "Fustat" }}>{val}</div>,
  },
];

interface IdeasProps {
  dataSource: JsonReport["Ideas"];
}
export default function Ideas({ dataSource }: IdeasProps) {
  return (
    <div id="idea-content-outline">
      <Card
        title="Summary"
        bordered={false}
        style={{
          width: "100%",
          maxHeight: "50vh",
          overflow: "scroll",
          marginBottom: "24px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <p style={{ color: "#333", fontFamily: "Fustat" }}>
          {dataSource.summary}
        </p>
      </Card>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource.ideas}
        pagination={false}
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      />
    </div>
  );
}
