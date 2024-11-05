/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-12 14:49:09
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-11-05 11:38:53
 * @FilePath: /dataVis/src/App.tsx
 */
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadDataSource from "./page/UploadDataSource";
import Report from "./page/Report";
import { UploadFile } from "antd";
import MainLayout from "./page/MainLayout";
export interface ReportData {
  json_report: string;
  json_source: string;
  start_count: object;
  corr_comment: string;
  Img_range: object;
  status: string;
  message: string;
}
const initialReportData = {
  json_report: "",
  json_source: "",
  start_count: {},
  corr_comment: "",
  Img_range: {},
  status: "",
  message: "",
}
type IGlobalContext<T> = {
  fileList: T[];
  setFileList: Dispatch<SetStateAction<T[]>>;
  reportData: ReportData
  setReportData: Dispatch<
    SetStateAction<ReportData>
  >;
};
const GlobalContext = createContext<IGlobalContext<UploadFile>>({
  fileList: [],
  setFileList: () => undefined,
  reportData: initialReportData,
  setReportData: () => undefined,
});

const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [reportData, setReportData] = useState(initialReportData);

  return (
    <GlobalContext.Provider
      value={{ fileList, setFileList, reportData, setReportData }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<UploadDataSource />} />
            <Route path="report/:uid" element={<Report />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default App;
