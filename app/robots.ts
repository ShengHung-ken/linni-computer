import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    "https://shenghung-ken.github.io/titanium-it";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/login/",
        ],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}