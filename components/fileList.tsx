import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileListItem } from "@/types";
import FileItem from "./file-item";

export default function FilesList() {
  const [uploadedFiles, setUploadedFiles] = useState<FileListItem[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  return (
    <>
      <div className="container md:mx-auto px-4">
        {uploadedFiles.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="h1">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.map((file) => (
                <FileItem key={file.id} file={file} onDelete={deleteFile} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-center items-center h-96">
            <p className="text-lg text-gray-500">No files uploaded yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
