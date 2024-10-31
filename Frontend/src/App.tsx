/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-12 14:49:09
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-17 10:34:50
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

type IGlobalContext<T> = {
  fileList: T[];
  setFileList: Dispatch<SetStateAction<T[]>>;
};
const GlobalContext = createContext<IGlobalContext<UploadFile>>({
  fileList: [],
  setFileList: () => undefined,
});

const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <GlobalContext.Provider value={{ fileList, setFileList }}>
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
