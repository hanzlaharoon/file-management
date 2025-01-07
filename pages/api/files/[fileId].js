import { getFile, getFileMetadata } from "@/utils/fileStorage";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR);

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    return await handleGet(req, res);
  } else if (method === "DELETE") {
    return await handleDelete(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGet(req, res) {
  try {
    const fileId = req.query.fileId;
    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }

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
    return res
      .status(500)
      .json({ error: "File download failed" }, { status: 500 });
  }
}

async function handleDelete(req, res) {
  try {
    const fileId = req.query.fileId;
    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }

    await fs.promises.unlink(path.join(uploadsDir, fileId));
    await fs.promises.unlink(path.join(uploadsDir, `${fileId}.json`));
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res
      .status(500)
      .json({ error: "File deletion failed" }, { status: 500 });
  }
}
