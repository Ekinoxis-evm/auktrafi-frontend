import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WalletConnect (via Privy) pulls in pino -> thread-stream, whose test files
  // require dev-only modules. Bundling them breaks `next build`; keep them external.
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
