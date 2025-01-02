import { getFiles } from "@/utils/fileStorage";

export default async function GET(req, res) {
  try {
    const files = await getFiles();
    return res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
