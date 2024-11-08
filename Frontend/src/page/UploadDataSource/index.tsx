/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-12 17:07:51
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-11-05 11:23:55
 * @FilePath: /dataVis/src/page/Upload/index.ts
 */

import { ReactComponent as Title } from "../../assets/svgs/title.svg";

import {
  Button,
  UploadProps,
  message,
  Upload,
  Spin,
  ConfigProvider,
  Flex,
} from "antd";

import {
  host,
  productName,
  supportedUploadExtension,
  uploadConfig,
} from "../../config/configuration";
import styled from "styled-components";
import { UploadOutlined } from "@ant-design/icons";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import { UploadFileStatus } from "antd/es/upload/interface";
import ItemRender from "./ItemRender";
import { UploadRef } from "antd/es/upload/Upload";
import { useNavigate } from "react-router-dom";
import { useGlobalContext, ReportData } from "../../App";
import LoadingLogo from "../../components/LoadingLogo";
import { ReactComponent as Safe } from "../../assets/svgs/safe.svg";
import { jsonizeData } from "../../utils";
const { Dragger } = Upload;
const SerilizedFileExtension = supportedUploadExtension
  .map((v) => `.${v}`)
  .join(",");

export default function UploadDataSource() {
  const [draggerStatus, setDraggerStatus] = useState<UploadFileStatus>();

  const [progress, setProgress] = useState(0);

  const [isUploadingWithAnimation, setIsUploadingWithAnimation] =
    useState(false);

  const [processingUid, setProcessingUid] = useState<string | null>(null);

  const {
    fileList: fl,
    setFileList: setFl,
    reportData,
    setReportData,
  } = useGlobalContext();

  const inputController = createRef<UploadRef>();

  const navigate = useNavigate();

  const mapStatusToColor = useCallback(
    ({
      defaultColor,
      errorColor,
      removedColor,
      uploadingColor,
      doneColor,
      status = draggerStatus,
    }: {
      defaultColor?: string;
      errorColor?: string;
      removedColor?: string;
      uploadingColor?: string;
      doneColor?: string;
      status?: UploadFileStatus;
    }) => {
      switch (status) {
        case "error":
          return errorColor ?? defaultColor;
        case "uploading":
          return uploadingColor ?? defaultColor;
        case "done":
          return doneColor ?? defaultColor;
        case "removed":
          return removedColor ?? defaultColor;
        default:
          return defaultColor;
      }
    },
    [draggerStatus]
  );

  const goCheckReport = useCallback(
    (uid: string) => {
      navigate(`/report/${uid}`);
    },
    [navigate]
  );

  const itemRender = useCallback<NonNullable<UploadProps["itemRender"]>>(
    (_, file, fileList) => {
      const currentIndex = fileList.indexOf(file);
      const currentFile = ~currentIndex ? fileList[currentIndex] : null;
      if (!currentFile) {
        return null;
      }
      const isCurrentSuccess = currentFile.status === "done";
      const isNewOne = file === fileList[fileList.length - 1];
      const filenameColor = mapStatusToColor({
        errorColor: "#ff7875",
        doneColor:
          file.response?.response?.status === "succeed"
            ? "lightseagreen"
            : file.response?.response?.status === "error"
            ? "#ff7875"
            : undefined,
        defaultColor: "#10a3ff",
        status: currentFile.status,
      });
      return (
        <ItemRender
          file={file}
          showProgress={isNewOne && isUploadingWithAnimation}
          progress={progress}
          filenameColor={filenameColor}
          onDelete={() =>
            setFl(fileList.filter((v) => v !== fileList[currentIndex]))
          }
          onEyeClick={
            isCurrentSuccess ? () => goCheckReport(currentFile.uid) : undefined
          }
        />
      );
    },
    [goCheckReport, isUploadingWithAnimation, mapStatusToColor, progress, setFl]
  );

  const uploadProps: UploadProps = useMemo(
    () => ({
      name: "file",
      action: `${host}/FileHanddler`,
      listType: "text",
      maxCount: uploadConfig.maxHistoryCount,
      itemRender,
      disabled: draggerStatus === "uploading",
      fileList: fl,
      beforeUpload(file) {
        const { name } = file;
        if (!supportedUploadExtension.find((v) => name.endsWith(v))) {
          setDraggerStatus("removed");
          message.error(`Only support ${SerilizedFileExtension} to upload!`);
          return Upload.LIST_IGNORE;
        } else if (fl.length >= uploadConfig.maxHistoryCount) {
          setDraggerStatus("removed");
          message.error(`Exceed max file count, please remove unused record!`);
          return Upload.LIST_IGNORE;
        }
      },
      onChange({ file, event, fileList }) {
        setFl(fileList);

        if (file.status) {
          setDraggerStatus(file.status);
          if (file.status === "uploading") {
            setIsUploadingWithAnimation(true);
          } else if (file.status === "done") {
            setTimeout(() => {
              setIsUploadingWithAnimation(false);
              setProcessingUid(file.uid);
            }, 300);
          } else if (file.status === "error") {
            setTimeout(() => {
              setIsUploadingWithAnimation(false);
            }, 300);
          }
        }
        if (event) {
          setProgress(event.percent);
          if (event.percent === 100) {
            setTimeout(() => setProgress(0), 400);
          }
        }
      },
      data(file) {
        return { file_uid: file.uid };
      },
    }),
    [draggerStatus, fl, itemRender, setFl]
  );
  const loadReport = async () => {
    try {
      const rawRes = await fetch(
        `${host}/upload_and_process?file_uid=${processingUid}`
      );
      const matchFile = fl.find((file) => file.uid === processingUid);
      if (!matchFile) {
        return message.error("Unexpected error!");
      }
      const response: ReportData = await rawRes.json();

      if (rawRes.status === 200) {
        reportData.status = response.status;
        reportData.message = response.message;
        reportData.start_count = response.start_count;
        matchFile.response = {
          ...(matchFile.response ?? {}),
          response: {
            ...response,
            json_report: jsonizeData(response.json_report),
            json_source: jsonizeData(response.json_source),
            corr_comment: jsonizeData(response.corr_comment),
          },
        };
        setReportData(response);
        goCheckReport(matchFile.uid);
      } else {
        message.error("Fail to process your file!");
        matchFile.response = {
          ...(matchFile.response ?? {}),
          response,
        };
      }
    } catch (error) {
      message.error("Unexpected error!");
    }

    setProcessingUid(null);
  };

  useEffect(() => {
    if (processingUid !== null) {
      loadReport();
    }
  }, [processingUid]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryBorder: "#bec0da",
          colorBorder: "#bec0da",
          colorPrimaryHover: "#8a92da",
        },
      }}
    >
      <Wrapper>
        <Flex
          align="center"
          justify="center"
          vertical
          style={{ height: "320px", marginBottom: "48px" }}
        >
          <TitleWrapper>
            <Title />
          </TitleWrapper>

          <SubTitle>One - Step Data Analyzer For All Purpose</SubTitle>
        </Flex>

        <DraggerWrapper>
          <Dragger
            ref={inputController}
            {...uploadProps}
            style={{
              borderWidth: "2px",
            }}
          >
            <div>
              <div>
                <p
                  className="ant-upload-hint"
                  style={{
                    color: mapStatusToColor({ defaultColor: "#a0a2ba" }),
                  }}
                >
                  Support for an excel file upload with subfix "
                  {SerilizedFileExtension}
                  ".
                  <br />
                  Strictly prohibited from uploading company data or other
                  banned files.
                </p>
              </div>

              <StyledButton
                loading={isUploadingWithAnimation}
                icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                size="large"
              >
                {isUploadingWithAnimation
                  ? "uploading"
                  : "Click or drag file to this area to upload"}
              </StyledButton>

              <Flex
                gap="small"
                align="center"
                justify="center"
                style={{
                  marginTop: "16px",
                  width: "100%",
                }}
              >
                <Safe />
                <Flex
                  vertical
                  align="start"
                  style={{ fontSize: "12px", color: "#333", opacity: 0.9 }}
                >
                  <div>
                    Your files will be securely handled by {productName} servers
                    and deleted.
                  </div>
                  <div>
                    <span>
                      By using this service, you agree to the {productName}{" "}
                    </span>
                    <a>Terms of Use</a>
                    <span> and </span>
                    <a>Privacy Policy</a>.
                  </div>
                </Flex>
              </Flex>
            </div>
          </Dragger>
        </DraggerWrapper>
      </Wrapper>

      <Spin
        spinning={processingUid !== null}
        fullscreen
        indicator={
          <>
            <LoadingLogo />
          </>
        }
      />
    </ConfigProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleWrapper = styled.div`
  display: inline-block;
  text-align: center;
  vertical-align: bottom;
  width: 100%;
  height: 100%;
  scale: 1.4;
`;

const SubTitle = styled.span`
  font-family: Fustat, Menlo, Monaco, Consolas, "Courier New";
  font-weight: 700;
  font-size: 32px;
  color: #1c2f40;
  opacity: 0.6;
`;

const DraggerWrapper = styled.section`
  width: 66%;
  min-width: 200px;
  background-color: rgba(245, 245, 245, 0.3);
  > span {
    > div:nth-of-type(1):hover {
      background-color: rgba(199, 199, 199, 0.2);
    }

    > div:nth-of-type(2) > div:hover {
      background-color: rgba(199, 199, 199, 0.2);
    }
  }
`;

const StyledButton = styled(Button)`
  border: none;
  background-color: #bec0da;
  color: white;
  font-weight: bolder;
  padding: 24px 36px;
`;
