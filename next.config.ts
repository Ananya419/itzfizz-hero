import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/itzfizz-hero",
  assetPrefix: "/itzfizz-hero/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
