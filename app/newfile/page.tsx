"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputFile } from "@/types";
import { formatFileSize } from "@/lib/utils";
import * as tus from "tus-js-client";
import { useToast } from "@/hooks/use-toast";

export default function NewFile() {
  const [files, setFiles] = useState<InputFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<tus.Upload[]>([]);

  const { toast } = useToast();

  const startUpload = async (index: number) => {
    const fileData = files[index];

    const upload = new tus.Upload(fileData.file, {
      endpoint: "/api/tus",
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: fileData.file.name,
        filetype: fileData.file.type,
      },
      onError: (error) => {
        console.error("Upload failed:", error);
        updateFileState(index, { status: "error" });
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.floor((bytesUploaded / bytesTotal) * 100);
        updateFileState(index, {
          progress: percentage,
        });
      },
      onSuccess: () => {
        const url = upload.url;
        console.log("Upload finished:", url);
        updateFileState(index, {
          uploadUrl: url || " ",
          status: "completed",
        });
        toast({
          title: "File uploaded successfully!",
          description: `${fileData.file.name} upload completed.`,
        });
      },
    });

    setUploadedFiles((prev) => ({ ...prev, [index]: upload }));

    try {
      updateFileState(index, { status: "uploading" });
      await upload.start();
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "File upload failed!",
        description: `Error uploading ${fileData.file.name}.`,
      });
      updateFileState(index, { status: "error" });
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles
      .filter((file) => file.type === "text/csv" || file.name.endsWith(".csv"))
      .map(
        (file) =>
          ({
            file,
            progress: 0,
            uploadUrl: "",
            status: "pending",
            id: Math.random().toString(36).substr(2, 9),
          } as InputFile)
      );

    if (validFiles.length !== selectedFiles.length) {
      alert("Only CSV files are allowed");
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const pauseUpload = (index: number) => {
    if (uploadedFiles[index]) {
      uploadedFiles[index].abort();
      updateFileState(index, { status: "paused" });
    }
  };

  const resumeUpload = (index: number) => {
    if (uploadedFiles[index]) {
      uploadedFiles[index].start();
      updateFileState(index, { status: "uploading" });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    const updatedUploads = { ...uploadedFiles };
    delete updatedUploads[index];
    setUploadedFiles(updatedUploads);
  };

  const updateFileState = (index: number, updates: Partial<InputFile>) => {
    setFiles((prev) =>
      prev.map((fileObj, i) =>
        i === index ? { ...fileObj, ...updates } : fileObj
      )
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="h1">New File</h1>

      {/* Upload Zone */}
      <Card className={"border-2 border-dashed border-gray-300"}>
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">
                  Upload files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".csv"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">CSV files only</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((fileData, index) => (
              <div key={fileData.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{fileData.file.name}</span>
                    <span className="text-sm text-gray-500">
                      ({formatFileSize(fileData.file.size)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileData.status === "pending" && (
                      <Button
                        onClick={() => startUpload(index)}
                        size="sm"
                        variant="outline"
                      >
                        Start Upload
                      </Button>
                    )}
                    {fileData.status === "paused" && (
                      <Button
                        onClick={() => resumeUpload(index)}
                        size="sm"
                        variant="outline"
                      >
                        Resume
                      </Button>
                    )}
                    {fileData.status === "uploading" && (
                      <Button
                        onClick={() => pauseUpload(index)}
                        size="sm"
                        variant="outline"
                      >
                        Pause
                      </Button>
                    )}
                    {fileData.status === "pending" && (
                      <Button
                        onClick={() => removeFile(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={fileData.progress} className="w-full" />
                <div className="flex items-center mt-2 text-sm">
                  {fileData.status === "uploading" && (
                    <span className="text-blue-500">Uploading...</span>
                  )}
                  {fileData.status === "paused" && (
                    <span className="text-gray-500">Paused</span>
                  )}
                  {fileData.status === "completed" && (
                    <span className="text-green-500 flex items-center">
                      <Check className="w-4 h-4 mr-1" /> Complete
                    </span>
                  )}
                  {fileData.status === "error" && (
                    <span className="text-red-500 flex items-center">
                      <X className="w-4 h-4 mr-1" /> Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
