export const supportedUploadExtension = ["xls", "xlsx"] as const;

export const productName = "NeuroViz";

export const departmentName = "C2E";

// export const host = "http://47.237.98.232:7777";
export const host =
  process.env.NODE_ENV === "production"
    ? "https://nueralviz.online/"
    : "http://47.237.98.232:7777";

export const uploadConfig = {
  maxHistoryCount: 5,
} as const;
