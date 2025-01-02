import { getFile, getFileMetadata } from "@/utils/fileStorage";

export default async function GET(req, res) {
  try {
    const fileId = req.query.fileId;
    const metadata = await getFileMetadata(fileId);

    if (!metadata) {
      return res.json({ error: "File not found" }, { status: 404 });
    }

    const file = await getFile(fileId);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${metadata.name}"`
    );

    res.send(file);
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.json({ error: "File download failed" }, { status: 500 });
  }
}
