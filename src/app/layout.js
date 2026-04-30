import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ChatWidget from "@/components/ChatSystem/ChatWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const SITE_URL = "https://bizforsale.io";
const SITE_NAME = "BizForSale.io";

// Viewport must be a separate export (Next.js 16+)
export const viewport = {
  themeColor: "#0884ff",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BizForSale.io | #1 Marketplace to Buy & Sell Businesses Online",
    template: "%s | BizForSale.io",
  },
  description:
    "Find verified businesses for sale across every industry. Buy established businesses, franchises, and online ventures — or list yours to reach thousands of serious buyers. The trusted business marketplace.",
  keywords: [
    "business for sale",
    "buy a business",
    "sell a business",
    "business listings",
    "business marketplace",
    "small business for sale",
    "online business for sale",
    "franchise for sale",
    "investment opportunities",
    "business broker",
    "profitable business for sale",
    "acquire a business",
    "businesses for sale near me",
    "SBA approved businesses",
    "seller financing",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "BizForSale.io | Buy & Sell Profitable Businesses Online",
    description:
      "Discover thousands of verified businesses for sale. Buy or sell businesses across every industry on the most trusted business marketplace.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BizForSale.io - Business Marketplace",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bizforsale",
    creator: "@bizforsale",
    title: "BizForSale.io | Buy & Sell Profitable Businesses",
    description:
      "The #1 marketplace to find verified businesses for sale. Browse listings or sell your business today.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "The trusted online marketplace to buy and sell businesses.",
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.png`,
                width: 200,
                height: 60,
              },
            }),
          }}
        />

        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: SITE_NAME,
              description:
                "Browse and list businesses for sale on BizForSale.io.",
              publisher: { "@id": `${SITE_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/business-for-sale?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              inLanguage: "en-US",
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeRegistry>
            <Navbar />
            {children}
            <Footer />
            <ChatWidget />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
