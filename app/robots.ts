import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide", "/dev/", "/panier"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
