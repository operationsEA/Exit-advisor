"use client";

import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Link from "next/link";
import {
  FiSearch,
  FiFileText,
  FiMessageSquare,
  FiCheckCircle,
  FiEdit3,
  FiImage,
  FiSend,
  FiSmile,
} from "react-icons/fi";

const buyerSteps = [
  {
    icon: FiSearch,
    step: "01",
    title: "Search Your Business",
    description:
      "Browse thousands of verified businesses across every industry. Use filters to narrow by category, price range, revenue, and location.",
    color: "#D4A537",
  },
  {
    icon: FiFileText,
    step: "02",
    title: "Review Business Details",
    description:
      "Access detailed profiles with financials, employee info, and growth metrics. Make informed decisions with complete transparency.",
    color: "#E8B84B",
  },
  {
    icon: FiMessageSquare,
    step: "03",
    title: "Chat with the Seller",
    description:
      "Connect directly with business owners through our built-in messaging system. Ask questions, negotiate terms, and build rapport.",
    color: "#D4A537",
  },
  {
    icon: FiCheckCircle,
    step: "04",
    title: "Deal Done",
    description:
      "Close with confidence. Our platform supports a smooth handoff with all the tools you need for a successful transaction.",
    color: "#E8B84B",
  },
];

const sellerSteps = [
  {
    icon: FiEdit3,
    step: "01",
    title: "Create Your Listing",
    description:
      "List your business in minutes. Add detailed descriptions, financial data, images, and set your asking price.",
    color: "#D4A537",
  },
  {
    icon: FiImage,
    step: "02",
    title: "Add Media & Documents",
    description:
      "Upload photos, financial statements, and supporting documents. A complete listing attracts serious buyers faster.",
    color: "#E8B84B",
  },
  {
    icon: FiSend,
    step: "03",
    title: "Receive & Review Offers",
    description:
      "Get notified when buyers show interest. Review their profiles, answer questions, and negotiate through our secure chat.",
    color: "#D4A537",
  },
  {
    icon: FiSmile,
    step: "04",
    title: "Close the Deal",
    description:
      "Finalize the sale with confidence. We help you through the process so you get the best value for your business.",
    color: "#E8B84B",
  },
];

function StepCard({ step, index }) {
  const Icon = step.icon;
  const isLeft = index % 2 === 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: isLeft ? "row" : "row-reverse" },
        alignItems: "center",
        gap: { xs: 2, md: 4 },
        mb: { xs: 4, md: 6 },
      }}
    >
      {/* Icon circle */}
      <Box
        sx={{
          width: { xs: 72, md: 88 },
          height: { xs: 72, md: 88 },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: `linear-gradient(135deg, ${step.color}, rgba(212,165,55,0.3))`,
          boxShadow: `0 0 0 4px rgba(212,165,55,0.08), 0 8px 24px rgba(0,0,0,0.15)`,
          position: "relative",
        }}
      >
        <Icon size={32} color="#0A0F1C" />
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: step.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#0A0F1C",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {step.step}
        </Box>
      </Box>

      {/* Connector line */}
      {index < 3 && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            width: 2,
            height: 32,
            backgroundColor: "rgba(212,165,55,0.2)",
          }}
        />
      )}

      {/* Text content */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: isLeft ? "left" : "right" },
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            fontWeight: 700,
            color: "#F5F3EE",
            mb: 0.75,
          }}
        >
          {step.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.95rem",
            color: "#8B95A8",
            lineHeight: 1.7,
            maxWidth: 480,
            ml: { xs: "auto", md: isLeft ? 0 : "auto" },
            mr: { xs: "auto", md: isLeft ? "auto" : 0 },
          }}
        >
          {step.description}
        </Typography>
      </Box>
    </Box>
  );
}

export default function HowItWorksSection() {
  return (
    <Box sx={{ backgroundColor: "#0D1321", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* ─── How to Buy Section ─── */}
        <Box sx={{ mb: { xs: 10, md: 16 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: "rgba(212,165,55,0.1)",
                color: "#D4A537",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              For Buyers
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 700,
                color: "#F5F3EE",
                mb: 1.5,
              }}
            >
              How to Buy a Business
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8B95A8",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              Find and acquire the perfect business in four simple steps.
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 800,
              mx: "auto",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 44,
                bottom: 44,
                left: { xs: "50%", md: 44 },
                width: 2,
                backgroundColor: "rgba(212,165,55,0.12)",
                transform: { xs: "translateX(-50%)", md: "none" },
                display: { xs: "none", md: "block" },
              },
            }}
          >
            {buyerSteps.map((step, index) => (
              <StepCard key={`buy-${index}`} step={step} index={index} />
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Link href="/business-for-sale" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(135deg, #F0C24B 0%, #D4A030 100%)",
                  color: "#0A0F1C",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "100px",
                  boxShadow: "0 4px 20px rgba(212,165,55,0.25)",
                  "&:hover": {
                    boxShadow: "0 6px 28px rgba(212,165,55,0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Start Browsing Businesses
              </Button>
            </Link>
          </Box>
        </Box>

        {/* ─── Divider ─── */}
        <Box
          sx={{
            maxWidth: 300,
            mx: "auto",
            mb: { xs: 10, md: 16 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(212,165,55,0.15)",
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "#D4A537",
                whiteSpace: "nowrap",
              }}
            >
              or
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(212,165,55,0.15)",
              }}
            />
          </Box>
        </Box>

        {/* ─── How to Sell Section ─── */}
        <Box>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: "rgba(212,165,55,0.1)",
                color: "#D4A537",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              For Sellers
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 700,
                color: "#F5F3EE",
                mb: 1.5,
              }}
            >
              How to Sell Your Business
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "#8B95A8",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              List your business and connect with qualified buyers in four
              simple steps.
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 800,
              mx: "auto",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 44,
                bottom: 44,
                left: { xs: "50%", md: 44 },
                width: 2,
                backgroundColor: "rgba(212,165,55,0.12)",
                transform: { xs: "translateX(-50%)", md: "none" },
                display: { xs: "none", md: "block" },
              },
            }}
          >
            {sellerSteps.map((step, index) => (
              <StepCard key={`sell-${index}`} step={step} index={index} />
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(212,165,55,0.5)",
                  color: "#D4A537",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
