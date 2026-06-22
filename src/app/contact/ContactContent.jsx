"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Card,
} from "@mui/material";
import { FiMail, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { submitContactForm } from "./actions";

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    const result = await submitContactForm(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(212,165,55,0.08) 0%, transparent 60%), linear-gradient(180deg, #0A0F1C 0%, #0D1321 100%)",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="md">
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              color: "#F5F3EE",
              mb: 1.5,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#8B95A8",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Have a question about buying or selling a business? We are here to
            help.
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 3, md: 5 },
            backgroundColor: "#0F1729",
            border: "1px solid rgba(212,165,55,0.08)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {sent ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <FiCheckCircle
                style={{
                  fontSize: 56,
                  color: "#D4A537",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <Typography
                sx={{
                  mt: 3,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#F5F3EE",
                }}
              >
                Message Sent!
              </Typography>
              <Typography sx={{ mt: 1, color: "#8B95A8" }}>
                We will get back to you within 24 hours.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.03)",
                        "& input": { color: "#F5F3EE" },
                        "& fieldset": {
                          borderColor: "rgba(212,165,55,0.15)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(212,165,55,0.35)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#D4A537",
                        },
                      },
                      "& .MuiInputLabel-root": { color: "#8B95A8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#D4A537" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Your Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.03)",
                        "& input": { color: "#F5F3EE" },
                        "& fieldset": {
                          borderColor: "rgba(212,165,55,0.15)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(212,165,55,0.35)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#D4A537",
                        },
                      },
                      "& .MuiInputLabel-root": { color: "#8B95A8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#D4A537" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="message"
                    label="Your Message"
                    multiline
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.03)",
                        "& textarea": { color: "#F5F3EE" },
                        "& fieldset": {
                          borderColor: "rgba(212,165,55,0.15)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(212,165,55,0.35)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#D4A537",
                        },
                      },
                      "& .MuiInputLabel-root": { color: "#8B95A8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#D4A537" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #F0C24B 0%, #D4A030 100%)",
                      color: "#0A0F1C",
                      fontWeight: 700,
                      fontSize: "1rem",
                      py: 1.5,
                      borderRadius: "100px",
                      textTransform: "none",
                      boxShadow: "0 4px 16px rgba(212,165,55,0.25)",
                      "&:hover": {
                        boxShadow: "0 6px 24px rgba(212,165,55,0.4)",
                      },
                    }}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>

              {/* Contact info below form */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid rgba(212,165,55,0.08)",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: { xs: 3, md: 6 },
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <FiMail size={18} color="#D4A537" />
                    <Typography sx={{ color: "#8B95A8", fontSize: "0.9rem" }}>
                      mail@bizforsale.io
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <FiMessageSquare size={18} color="#D4A537" />
                    <Typography sx={{ color: "#8B95A8", fontSize: "0.9rem" }}>
                      Response within 24 hours
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
}
