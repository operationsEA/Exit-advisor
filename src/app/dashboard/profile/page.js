"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  TextField,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/supabase/client";

export default function ProfilePage() {
  const supabase = createBrowserSupabaseClient();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profile.fullName })
        .eq("email", profile.email);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, color: "#111827" }}
      >
        Profile Settings
      </Typography>

      <Card
        sx={{
          p: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        {/* Avatar */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              backgroundColor: "#0884ff",
              margin: "0 auto",
              fontSize: "2rem",
              mb: 2,
            }}
          >
            {profile.fullName?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={profile.role}
              disabled
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#0884ff",
                py: 1.2,
                textTransform: "none",
                "&:hover": { backgroundColor: "#0670d6" },
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
