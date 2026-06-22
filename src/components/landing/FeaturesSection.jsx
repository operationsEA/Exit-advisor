"use client";

import { Card, CardContent, CardHeader } from "@mui/material";
import {
  FiCheckCircle,
  FiLock,
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";

const features = [
  {
    icon: FiCheckCircle,
    title: "Verified Listings",
    description:
      "All businesses are vetted and verified to ensure authenticity and legitimacy.",
    color: "#D4A537",
  },
  {
    icon: FiLock,
    title: "Secure Transactions",
    description:
      "Protected deals with escrow services and professional legal support included.",
    color: "#E8B84B",
  },
  {
    icon: FiZap,
    title: "Fast Process",
    description:
      "Close deals in weeks, not months. Streamlined process from listing to handoff.",
    color: "#D4A537",
  },
  {
    icon: FiUsers,
    title: "Expert Support",
    description:
      "Dedicated support team to guide you through every step of the transaction.",
    color: "#E8B84B",
  },
  {
    icon: FiTrendingUp,
    title: "Market Analytics",
    description:
      "Access detailed analytics and trends to make informed buying decisions.",
    color: "#D4A537",
  },
  {
    icon: FiShield,
    title: "Privacy Protected",
    description:
      "Your sensitive business information is always encrypted and confidential.",
    color: "#E8B84B",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#0D1321" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#F5F3EE",
              marginBottom: "1rem",
            }}
          >
            Why Choose BizForSale.io?
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#8B95A8",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            The most trusted marketplace for buying and selling businesses
            online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                sx={{
                  height: "100%",
                  border: "1px solid rgba(212,165,55,0.08)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  backgroundColor: "#0F1729",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    transform: "translateY(-5px)",
                    borderColor: "rgba(212,165,55,0.2)",
                  },
                }}
              >
                <CardHeader
                  sx={{
                    pb: 1,
                    "& .MuiCardHeader-avatar": {
                      marginRight: 0,
                    },
                  }}
                  avatar={<IconComponent size={32} color={feature.color} />}
                  title={
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#F5F3EE",
                        fontSize: "1.1rem",
                      }}
                    >
                      {feature.title}
                    </span>
                  }
                />
                <CardContent>
                  <p
                    style={{
                      color: "#8B95A8",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
