/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/linni-computer",
  assetPrefix: "/linni-computer/",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;