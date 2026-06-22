"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { FiBriefcase } from "react-icons/fi";

import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Hide footer on dashboard/chat page
  if (pathname.includes("/dashboard/chat")) {
    return null;
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");
  const showFooter = !isDashboard && !isAuth;

  if (!showFooter) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#111827",
        color: "#e5e7eb",
        pt: 10,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FiBriefcase size={24} color="#D4A537" />
              <Typography
                variant="h6"
                sx={{ color: "#F5F3EE", fontWeight: "bold" }}
              >
                BizForSale.io
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#8B95A8", mb: 3 }}>
              The trusted marketplace for buying and selling businesses online.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{ color: "#f3f4f6", fontWeight: "bold", mb: 2 }}
            >
              Browse
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/business-for-sale"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#8B95A8", "&:hover": { color: "#D4A537" } }}
                >
                  All Businesses
                </Typography>
              </Link>
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#8B95A8", "&:hover": { color: "#D4A537" } }}
                >
                  Sell Your Business
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{ color: "#f3f4f6", fontWeight: "bold", mb: 2 }}
            >
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/blogs" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#8B95A8", "&:hover": { color: "#D4A537" } }}
                >
                  Acquisition Education
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{ color: "#f3f4f6", fontWeight: "bold", mb: 2 }}
            >
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#8B95A8", "&:hover": { color: "#D4A537" } }}
                >
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="#" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#8B95A8", "&:hover": { color: "#D4A537" } }}
                >
                  Terms of Service
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: "1px solid #374151",
            pt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#8B95A8" }}>
            © {currentYear} BizForSale.io. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: "#8B95A8" }}>
            Made with ❤️ for entrepreneurs and business buyers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
