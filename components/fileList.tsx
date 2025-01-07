"use client";

import { Button } from "@/components/ui/button";
import { CircleX, Download, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileListItem } from "@/types";
import { downloadFile, formatFileSize } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
                <div
                  key={file.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • Uploaded{" "}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        href={`/api/files/${file.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Preview
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(file.id, file.name)}
                    >
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                        >
                          <CircleX color="red" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your the selected file and remove any data
                            associated with it.
                            <br />
                            <p>
                              Selected File : <strong>{file.name}</strong>
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFile(file.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
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
