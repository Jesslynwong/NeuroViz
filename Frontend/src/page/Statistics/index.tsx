/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-12 17:08:50
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-11 17:16:40
 * @FilePath: /dataVis/src/page/Statistics/index.tsx
 */
import React from "react";
import type { TableColumnsType } from "antd";
import { Table } from "antd";

export default function Statistics() {
  interface ExpandedDataType {
    index: string;
    number: number;
    data: string;
  }

  interface DataType {
    statistical_factors: string;
    name: string;
    count: string;
    mean: string;
    std: string;
    min: string;
    "25%": string;
    "50%": string;
    "75%": string;
    max: string;
    median: string;
  }

  const dataSource = [
    {
      key: "y",
      statistical_factors: "y",
      name: "deposit",
      count: "99.0",
      mean: "5102346.070701",
      std: "2735639.1207",
      min: "4842.0",
      "25%": "2784966.0",
      "50%": "5231160.0",
      "75%": "7434426.0",
      max: "9952758.0",
      median: "5231160.0",
    },
    {
      key: "x1",
      statistical_factors: "x1",
      name: "age",
      count: "99.0",
      mean: "5102346.070701",
      std: "2735639.1207",
      min: "4842.0",
      "25%": "2784966.0",
      "50%": "5231160.0",
      "75%": "7434426.0",
      max: "9952758.0",
      median: "5231160.0",
    },
    {
      key: "x2",
      statistical_factors: "x2",
      name: "liability",
      count: "99.0",
      mean: "5102346.070701",
      std: "2735639.1207",
      min: "4842.0",
      "25%": "2784966.0",
      "50%": "5231160.0",
      "75%": "7434426.0",
      max: "9952758.0",
      median: "5231160.0",
    },
  ];

  const expandDataSource = [
    { index: "outliers", number: 2, data: [9952758, 4842].join(" | "), key: "outliers" },
  ];

  const expandColumns: TableColumnsType<ExpandedDataType> = [
    { title: "index", dataIndex: "index", key: "index" },
    { title: "number", dataIndex: "number", key: "number" },
    { title: "data", dataIndex: "data", key: "data" },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Statistical factors",
      dataIndex: "statistical_factors",
      key: "statistical_factors",
    },
    { title: "name", dataIndex: "name", key: "name" },
    { title: "count", dataIndex: "count", key: "count" },
    { title: "mean", dataIndex: "mean", key: "mean" },
    { title: "std", dataIndex: "std", key: "std" },
    { title: "min", dataIndex: "min", key: "min" },
    { title: "25%", dataIndex: "25%", key: "25%" },
    { title: "50%", dataIndex: "50%", key: "50%" },
    { title: "75%", dataIndex: "75%", key: "75%" },
    { title: "max", dataIndex: "max", key: "max" },
    { title: "median", dataIndex: "median", key: "median" },
  ];

  const expandedRowRender = () => (
    <Table<ExpandedDataType>
      columns={expandColumns}
      dataSource={expandDataSource}
      pagination={false}
    />
  );

  return (
    <div style={{ overflow: "scroll", padding: "24px",  }}>
      {/* descriptive statistics */}
      <Table<DataType>
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={dataSource}
        size="small"
        pagination={false}
        style={{boxShadow:"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", marginBottom: "10px"}}
      />
      <Table<DataType>
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={dataSource}
        size="small"
        pagination={false}
        style={{boxShadow:"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}
      />
      {/* correlation matrix */}

    </div>
  );
}
