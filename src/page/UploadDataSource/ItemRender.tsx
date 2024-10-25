import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Progress, UploadFile } from "antd";
import { MouseEventHandler } from "react";
import styled from "styled-components";
import { ReactComponent as Loading } from "../../assets/svgs/loading.svg";

interface ItemRenderProps {
  file: UploadFile;
  progress?: number;
  showProgress?: boolean;
  filenameColor?: string;
  onEyeClick?: MouseEventHandler<HTMLSpanElement>;
  onDelete?: MouseEventHandler<HTMLSpanElement>;
}
export default function ItemRender({
  file,
  progress,
  showProgress,
  filenameColor,
  onDelete,
  onEyeClick,
}: ItemRenderProps) {
  const isProcessingSuccess = file.response?.response?.status === "succeed";

  return (
    <div>
      <ItemRenderWrapper>
        <FileNameWrapper style={{ color: filenameColor }}>
          <span style={{ marginRight: "4px" }}>
            {file.response?.response?.status === "succeed" ? (
              <CheckCircleFilled
                style={{ color: filenameColor, width: "10px", stroke: "2px" }}
              />
            ) : file.response?.response?.status === "error" ||
              file.status === "error" ? (
              <CloseCircleFilled
                style={{ color: filenameColor, width: "10px", stroke: "2px" }}
              />
            ) : (
              <Loading
                style={{
                  width: "10px",
                  height: "10px",
                  scale: 1.2,
                  color: filenameColor,
                }}
              />
            )}
          </span>
          {file.name}
        </FileNameWrapper>
        <IconWrapper>
          {onEyeClick && isProcessingSuccess && (
            <Hover>
              <EyeOutlined
                style={{ color: "cadetblue", cursor: "pointer" }}
                alt="Check Statistic"
                title="Check Statistic"
                onClick={onEyeClick}
              />
            </Hover>
          )}
          {onDelete && (
            <Hover>
              <DeleteOutlined
                style={{ color: "orangered", cursor: "pointer" }}
                alt="Delete"
                title="Delete"
                onClick={onDelete}
              />
            </Hover>
          )}
        </IconWrapper>
      </ItemRenderWrapper>
      <div style={{ marginTop: "-10px", marginBottom: "10px" }}>
        {showProgress && (
          <Progress
            strokeWidth={4}
            showInfo={false}
            percent={progress}
            percentPosition={{ align: "center", type: "outer" }}
            size="small"
            strokeColor={filenameColor}
          />
        )}
      </div>
    </div>
  );
}

const Hover = styled.div`
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const FileNameWrapper = styled.div`
  opacity: 0.8;
  cursor: pointer;
  font-weight: 500;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const ItemRenderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
