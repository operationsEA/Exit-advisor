import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0884ff" />
        <meta
          name="description"
          content="Buy and sell businesses with confidence"
        />
        <meta
          name="keywords"
          content="business, selling, marketplace, listings"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeRegistry>
            <Navbar />
            {children}
            <Footer />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
