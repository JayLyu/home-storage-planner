import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 默认只允许 localhost 的 dev 资源跨域；
  // 用 127.0.0.1 或局域网 IP 访问时需显式放行，否则 HMR WebSocket 握手失败。
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
