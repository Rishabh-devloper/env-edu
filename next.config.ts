import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix root resolution so Turbopack uses the current project (env-edu)
  // This avoids selecting another directory due to multiple lockfiles at higher levels
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
