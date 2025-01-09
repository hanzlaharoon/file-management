import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { FileListItem } from "@/types";
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

interface Props {
  file: FileListItem;
  onDelete: (id: string) => void;
}

export default function DeleteFileButton({ file, onDelete }: Props) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-red-500">
            <CircleX color="red" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              the selected file and remove any data associated with it.
              <br />
              <span>
                Selected File : <strong>{file.name}</strong>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(file.id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
