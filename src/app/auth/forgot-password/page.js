"use client";

import { Grid, Container } from "@mui/material";
import SignupLeft from "@/components/Auth/SignupLeft";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="xl" sx={{ p: 0 }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        <Grid item xs={12} md={6}>
          <SignupLeft />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            px: { xs: 4, sm: 6, lg: 8 },
            backgroundColor: "#f9fafb",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              Forgot Password
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              Enter your email to receive a reset link
            </p>
            <ForgotPasswordForm />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
