import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/api/tus",
        headers: [
          { key: "Tus-Resumable", value: "1.0.0" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "PATCH,HEAD,POST,OPTIONS",
          },
          {
            key: "Access-Control-Expose-Headers",
            value:
              "Tus-Resumable,upload-length,upload-metadata,Location,Upload-Offset",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Tus-Resumable,upload-length,upload-metadata,Location,Upload-Offset,content-type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
