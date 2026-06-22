import { Button } from "@mui/material";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(212,165,55,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 30%, rgba(212,165,55,0.04) 0%, transparent 40%), linear-gradient(180deg, #0A0F1C 0%, #0D1321 50%, #0F1729 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative contour lines */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "300px",
          background:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 300'%3E%3Cpath d='M0,200 C200,150 400,250 600,180 C800,110 1000,200 1200,160 L1200,300 L0,300 Z' fill='none' stroke='rgba(212,165,55,0.06)' stroke-width='2'/%3E%3Cpath d='M0,240 C200,200 400,280 600,220 C800,160 1000,240 1200,200 L1200,300 L0,300 Z' fill='none' stroke='rgba(212,165,55,0.04)' stroke-width='1.5'/%3E%3C/svg%3E\") center bottom no-repeat",
          backgroundSize: "cover",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-4xl mx-auto text-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 500,
            color: "#F5F3EE",
            marginBottom: "1.5rem",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Businesses for Sale <br />
          <span
            style={{
              background: "linear-gradient(135deg, #F0C24B, #D4A537)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Buy or Sell a Business Free
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "#9CA3B5",
            marginBottom: "2.5rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          BizForSale.io connects serious buyers and sellers. Discover vetted
          business opportunities, connect with qualified investors, and close
          deals faster.
        </p>

        {/* Search Bar Component */}
        <SearchBar />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/business-for-sale" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #F0C24B 0%, #D4A030 100%)",
                color: "#0A0F1C",
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 700,
                padding: "14px 36px",
                borderRadius: "100px",
                boxShadow: "0 4px 20px rgba(212,165,55,0.3)",
                "&:hover": {
                  boxShadow: "0 6px 28px rgba(212,165,55,0.45)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Browse Businesses
            </Button>
          </Link>
          <Link href="/business-for-sale" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "rgba(212,165,55,0.5)",
                color: "#D4A537",
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                padding: "14px 36px",
                borderRadius: "100px",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#D4A537",
                  backgroundColor: "rgba(212,165,55,0.08)",
                  borderWidth: "2px",
                },
              }}
            >
              List Your Business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
