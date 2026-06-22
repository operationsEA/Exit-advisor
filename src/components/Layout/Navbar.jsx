import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import MobileNavbarAuth from "./MobileNavbarAuth";

// Static links always visible to all users (crawlers see these immediately)
const staticLinks = [
  { label: "Browse", href: "/business-for-sale" },
  { label: "Acquisition Education", href: "/blogs" },
];

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#0D1321",
        color: "#D4A537",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        borderBottom: "1px solid rgba(212,165,55,0.08)",
        borderRadius: 0,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          mx: "auto",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 0,
            width: "100%",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Logo — server-rendered, indexable */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.5rem",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#F5F3EE" }}>Biz</span>
              <span style={{ color: "#F5F3EE" }}>forSale</span>
              <span style={{ color: "#D4A537", fontStyle: "italic" }}>.io</span>
            </Typography>
          </Link>

          {/* Desktop navigation (md and above) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", color: "#9CA3B5" }}
              >
                {link.label}
              </Link>
            ))}
            <NavbarAuth />
          </Box>

          {/* Mobile hamburger (below md) */}
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <MobileNavbarAuth staticLinks={staticLinks} />
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
