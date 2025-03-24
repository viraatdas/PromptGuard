/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: "3001",
  },
  // Set port in server.js
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
};

export default nextConfig; 