import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { FileListItem } from "@/types";
import { downloadFile, formatFileSize } from "@/lib/utils";
import DeleteFileButton from "./delete-file-btn";

interface FilesItemProps {
  file: FileListItem;
  onDelete: (id: string) => void;
}

export default function FileItem({ file, onDelete }: FilesItemProps) {
  return (
    <>
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
          <DeleteFileButton file={file} onDelete={onDelete} />
        </div>
      </div>
    </>
  );
}
