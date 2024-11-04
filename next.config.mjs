/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["drive.google.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc", // Match the `/uc` path
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/file/d/**", // Match the `/file/d/...` pattern
      },
    ],
  },
};

export default nextConfig;

