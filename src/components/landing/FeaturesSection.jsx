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
    color: "text-primary-600",
  },
  {
    icon: FiLock,
    title: "Secure Transactions",
    description:
      "Protected deals with escrow services and professional legal support included.",
    color: "text-secondary-600",
  },
  {
    icon: FiZap,
    title: "Fast Process",
    description:
      "Close deals in weeks, not months. Streamlined process from listing to handoff.",
    color: "text-success-600",
  },
  {
    icon: FiUsers,
    title: "Expert Support",
    description:
      "Dedicated support team to guide you through every step of the transaction.",
    color: "text-warning-600",
  },
  {
    icon: FiTrendingUp,
    title: "Market Analytics",
    description:
      "Access detailed analytics and trends to make informed buying decisions.",
    color: "text-error-600",
  },
  {
    icon: FiShield,
    title: "Privacy Protected",
    description:
      "Your sensitive business information is always encrypted and confidential.",
    color: "text-primary-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Why Choose BizForSale.io?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
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
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    transform: "translateY(-5px)",
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
                  avatar={
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  }
                  title={
                    <span className="font-bold text-neutral-900">
                      {feature.title}
                    </span>
                  }
                />
                <CardContent>
                  <p className="text-neutral-600 text-sm leading-relaxed">
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
