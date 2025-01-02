import { getFile, getFileMetadata } from "@/utils/fileStorage";

export default async function GET(req, res) {
  try {
    const fileId = req.query.fileId;
    const metadata = await getFileMetadata(fileId);

    if (!metadata) {
      return res.json({ error: "File not found" }, { status: 404 });
    }

    const file = await getFile(fileId);

    if (req.query.action === "download") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${metadata.name}"`
      );
      res.status(200).send(file);
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(file);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    return res.json({ error: "File download failed" }, { status: 500 });
  }
}
