"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import {
  FiBriefcase,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";

import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");
  const showFooter = !isDashboard && !isAuth;

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
              <FiBriefcase size={24} color="#0884ff" />
              <Typography
                variant="h6"
                sx={{ color: "#f3f4f6", fontWeight: "bold" }}
              >
                BizForSale.io
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 3 }}>
              The trusted marketplace for buying and selling businesses online.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MuiLink
                href="#"
                target="_blank"
                sx={{ color: "#0884ff", "&:hover": { color: "#22bfa3" } }}
              >
                <FiFacebook size={20} />
              </MuiLink>
              <MuiLink
                href="#"
                target="_blank"
                sx={{ color: "#0884ff", "&:hover": { color: "#22bfa3" } }}
              >
                <FiTwitter size={20} />
              </MuiLink>
              <MuiLink
                href="#"
                target="_blank"
                sx={{ color: "#0884ff", "&:hover": { color: "#22bfa3" } }}
              >
                <FiLinkedin size={20} />
              </MuiLink>
              <MuiLink
                href="#"
                target="_blank"
                sx={{ color: "#0884ff", "&:hover": { color: "#22bfa3" } }}
              >
                <FiInstagram size={20} />
              </MuiLink>
            </Box>
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
              <Link href="/browse" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  All Businesses
                </Typography>
              </Link>
              <Link href="/sell" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Sell Your Business
                </Typography>
              </Link>
              <Link href="/pricing" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Pricing
                </Typography>
              </Link>
              <Link href="/faq" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  FAQ
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{ color: "#f3f4f6", fontWeight: "bold", mb: 2 }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  About Us
                </Typography>
              </Link>
              <Link href="/blog" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Blog
                </Typography>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Contact
                </Typography>
              </Link>
              <Link href="/careers" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Careers
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
              <Link href="/privacy" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/terms" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Terms of Service
                </Typography>
              </Link>
              <Link href="/cookies" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", "&:hover": { color: "#0884ff" } }}
                >
                  Cookie Policy
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
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            © {currentYear} BizForSale.io. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Made with ❤️ for entrepreneurs and business buyers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
