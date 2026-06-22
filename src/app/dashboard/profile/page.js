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
  IconButton,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { createBrowserSupabaseClient } from "@/supabase/client";
import { updateUserProfile } from "@/supabase/auth-helpers";
import { FiCamera } from "react-icons/fi";

export default function ProfilePage() {
  const supabase = createBrowserSupabaseClient();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load real profile data
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: dbProfile } = await supabase
        .from("profiles")
        .select("full_name, email, role, avatar_url")
        .eq("id", user.id)
        .single();

      console.log({ dbProfile });

      setProfile({
        fullName: dbProfile?.full_name || user.user_metadata?.full_name || "",
        email: dbProfile?.email || user.email || "",
        role: dbProfile?.role || user.user_metadata?.role || "",
        avatarUrl:
          dbProfile?.avatar_url || user.user_metadata?.avatar_url || "",
      });
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Upload avatar to Supabase storage
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop().toLowerCase();
      const filePath = `avatars/${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("biz-bucket")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("biz-bucket")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Save avatar_url to profile + sync to auth metadata
      await updateUserProfile(supabase, user.id, { avatar_url: avatarUrl });
      setProfile((prev) => ({ ...prev, avatarUrl }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const result = await updateUserProfile(supabase, user.id, {
        full_name: profile.fullName,
      });

      if (!result.success) throw new Error(result.error);
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to update: " + err.message);
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
        {/* Avatar with upload */}
        <Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
          <Avatar
            src={profile.avatarUrl || undefined}
            sx={{
              width: 100,
              height: 100,
              backgroundColor: "#0884ff",
              margin: "0 auto",
              fontSize: "2rem",
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => fileRef.current?.click()}
          >
            {profile.fullName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <IconButton
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              width: 32,
              height: 32,
            }}
          >
            <FiCamera size={16} />
          </IconButton>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarUpload}
          />
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
                "& .MuiOutlinedInput-root": { borderRadius: 1 },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              disabled
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 1 },
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
                "& .MuiOutlinedInput-root": { borderRadius: 1 },
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
