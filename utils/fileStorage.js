import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const getFileMetadata = async (filename) => {
  try {
    const filepath = path.join(uploadsDir, filename);
    const stats = await fs.promises.stat(filepath);

    const metadataPath = `${filepath}.metadata`;
    let metadata = {};

    try {
      if (fs.existsSync(metadataPath)) {
        const metadataContent = await fs.promises.readFile(
          metadataPath,
          "utf8"
        );
        metadata = JSON.parse(metadataContent);
      }
    } catch (error) {
      console.error("Error reading tus metadata:", error);
    }

    return {
      id: filename,
      name: metadata.filename || filename,
      size: stats.size,
      uploadedAt: stats.mtime,
      status: "completed",
    };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    return null;
  }
};

export const getFiles = async () => {
  const files = await fs.promises.readdir(uploadsDir);

  // Filter out .metadata files and get metadata for each file
  const fileMetadataPromises = files
    .filter((file) => !file.endsWith(".metadata"))
    .map(getFileMetadata);

  const filesMetadata = await Promise.all(fileMetadataPromises);
  return filesMetadata.filter(Boolean); // Remove null entries
};

export const getFile = async (filename) => {
  const filepath = path.join(uploadsDir, filename);
  return fs.promises.readFile(filepath);
};

export const saveFile = async (file, originalFilename) => {
  const fileId = randomUUID();
  const extension = path.extname(originalFilename);
  const filename = `${fileId}${extension}`;
  const filepath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filepath, file);

  return {
    id: fileId,
    filename: originalFilename,
    storedFilename: filename,
    filepath,
  };
};
