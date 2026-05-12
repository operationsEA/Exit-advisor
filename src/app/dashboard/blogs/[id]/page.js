"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { TipTapEditor } from "@/components/TipTapEditor";
import blogCategories from "@/data/blog-categories.json";
import { getBlogById, createBlog, updateBlog } from "../actions";

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuth, isLoading } = useAuth();
  const role = user?.user_metadata?.role;
  const blogId = params?.id;
  const isNewBlog = blogId === "new";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
  });

  const [loading, setLoading] = useState(!isNewBlog);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBlog = useCallback(async () => {
    if (isNewBlog) {
      setLoading(false);
      return;
    }

    const result = await getBlogById(blogId);
    if (result?.success) {
      setFormData(result.data);
      setError("");
    } else {
      setError(result?.error || "Failed to load blog");
    }
    setLoading(false);
  }, [blogId, isNewBlog]);

  useEffect(() => {
    if (!isAuth || role !== "admin") return;
    loadBlog();
  }, [isAuth, role, loadBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Slug is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = isNewBlog
        ? await createBlog(formData)
        : await updateBlog(blogId, formData);

      if (result?.success) {
        router.push("/dashboard/blogs");
      } else {
        setError(result?.error || "Failed to save blog");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (!isAuth || role !== "admin") {
    return (
      <Alert severity="error">
        You don't have permission to access this page.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => router.push("/dashboard/blogs")}
          sx={{ textTransform: "none" }}
        >
          <FiArrowLeft size={18} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0 }}>
          {isNewBlog ? "Create Blog" : "Edit Blog"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Blog post title"
            disabled={saving}
          />

          {/* Slug */}
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 1,
              }}
            >
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="blog-post-slug"
                disabled={saving}
                helperText="URL-friendly slug for the blog post"
              />
              <Button
                variant="outlined"
                onClick={handleGenerateSlug}
                disabled={saving || !formData.title.trim()}
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  mt: "auto",
                }}
              >
                Generate
              </Button>
            </Box>
          </Box>

          {/* Excerpt */}
          <TextField
            fullWidth
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short summary of the blog post"
            multiline
            rows={2}
            disabled={saving}
          />

          {/* Content */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Content
            </Typography>
            <TipTapEditor
              value={formData.content}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, content: html }))
              }
              placeholder="Write your blog post content here..."
              disabled={saving}
              minHeight={400}
            />
          </Box>

          {/* Category */}
          <FormControl fullWidth disabled={saving}>
            <InputLabel>Category (Optional)</InputLabel>
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              label="Category (Optional)"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {blogCategories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/dashboard/blogs")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<FiSave size={18} />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : isNewBlog ? "Create Blog" : "Update Blog"}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
