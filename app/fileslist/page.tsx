import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Download, Eye } from 'lucide-react';

const files = [
  {
    id: 1,
    name: 'Employee List',
    size: '2.5 MB',
    status: 'Success',
    price: '$250.00',
  },
];

export default function FilesList() {
  return (
    <div className="container md:mx-auto px-4">
      <h1 className="h1">Files List</h1>

      <Table>
        <TableCaption>A list of your recent files.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <>
              <TableRow key={file.id}>
                <TableCell>{file.id}</TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.status}</TableCell>
                <TableCell className="text-right">
                  <span className="space-x-2">
                    <TooltipWrapper tooltipText="Preview">
                      <Button variant="outline" size="icon">
                        <Eye />
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper tooltipText="Download">
                      <Button variant="outline" size="icon">
                        <Download />
                      </Button>
                    </TooltipWrapper>
                  </span>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
