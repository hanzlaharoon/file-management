export interface InputFile {
  id: string;
  file: File;
  progress: number;
  status: "error" | "pending" | "uploading" | "completed" | "paused";
  uploadUrl: string;
}
