import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mounted at shadcndeck.com/chartcn via a rewrite in the shadcndeck-landing
  // repo's next.config.ts. This keeps this app's own links, assets, and
  // routes self-prefixed so they resolve correctly under that path.
  basePath: "/chartcn",
};

export default nextConfig;
