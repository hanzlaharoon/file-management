import { Server as TusServer } from "@tus/server";
import { FileStore } from "@tus/file-store";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadPath = path.join(process.cwd(), process.env.UPLOAD_DIR);

const tusServer = new TusServer({
  path: "/api/tus",
  datastore: new FileStore({ directory: uploadPath }),
  namingFunction: () => Math.random().toString(36).substring(2, 15),
  metadata: {
    filename: (req) => {
      const metadata = req.metadata;
      return metadata.filename;
    },
  },
});

export default async function handler(req, res) {
  return await tusServer.handle(req, res);
}
