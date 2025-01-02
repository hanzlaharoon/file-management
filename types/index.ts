export interface InputFile {
  id: string;
  file: File;
  progress: number;
  status: "error" | "pending" | "uploading" | "completed" | "paused";
  uploadUrl: string;
}

export interface FileListItem {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: "error" | "pending" | "uploading" | "completed" | "paused";
}
