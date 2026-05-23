const SITE_URL = "https://bizforsale.io";

export const metadata = {
  title: "Business Insights & Resources | Blog - BizForSale.io",
  description:
    "Expert guides, industry trends, and actionable tips for buying and selling businesses. Stay informed with the latest insights on business valuation, negotiation, and acquisition strategies.",
  keywords: [
    "business buying tips",
    "business selling guide",
    "business valuation",
    "how to buy a business",
    "how to sell a business",
    "business acquisition",
    "small business blog",
    "entrepreneur resources",
    "business negotiation",
    "SBA loans guide",
    "seller financing tips",
    "business due diligence",
    "business broker advice",
  ],
  openGraph: {
    title: "Business Insights & Resources | Blog - BizForSale.io",
    description:
      "Expert guides, industry trends, and actionable tips for buying and selling businesses.",
    url: `${SITE_URL}/blogs`,
    siteName: "BizForSale.io",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Business Blog - BizForSale.io",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Blog | BizForSale.io",
    description:
      "Expert guides and actionable tips for buying and selling businesses.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
};

export default function BlogsLayout({ children }) {
  return <>{children}</>;
}
