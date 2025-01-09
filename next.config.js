/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ["tsx", "ts"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "my-blob-store.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "2h7ukwygdg1guh7a.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
