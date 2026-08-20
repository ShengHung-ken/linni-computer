/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/titanium-it",
  assetPrefix: "/titanium-it/",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;