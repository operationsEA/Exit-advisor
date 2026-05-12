"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiClock,
  FiImage,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllBlogs,
  deleteBlog,
  publishBlog,
  uploadBlogImage,
} from "./actions";

const STATUS_COLORS = {
  draft: { bg: "#f3f4f6", text: "#374151", label: "Draft" },
  published: { bg: "#dcfce7", text: "#166534", label: "Published" },
};

export default function BlogsPage() {
  const router = useRouter();
  const { user, isAuth, isLoading } = useAuth();
  const role = user?.user_metadata?.role;

  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingBlogId, setUploadingBlogId] = useState(null);

  const fetchBlogs = useCallback(async () => {
    const result = await getAllBlogs();
    if (result?.success) {
      setBlog(result.data);
      setError("");
    } else {
      setError(result?.error || "Failed to fetch blogs");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuth || role !== "admin") return;
    fetchBlogs();
  }, [isAuth, role, fetchBlogs]);

  const handleCreateBlog = () => {
    router.push("/dashboard/blogs/new");
  };

  const handleEditBlog = (blogId) => {
    router.push(`/dashboard/blogs/${blogId}`);
  };

  const handleDeleteClick = (blogId) => {
    setSelectedBlogId(blogId);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteBlog(selectedBlogId);

      if (result?.success) {
        setBlog((prev) => prev.filter((blog) => blog.id !== selectedBlogId));
        setDeleteDialog(false);
      } else {
        setError(result?.error || "Failed to delete blog");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublishBlog = async (blogId) => {
    const result = await publishBlog(blogId);
    if (result?.success) {
      setBlog((prev) =>
        prev.map((blog) =>
          blog.id === blogId
            ? { ...blog, status: "published", published_at: new Date() }
            : blog,
        ),
      );
    } else {
      setError(result?.error || "Failed to publish blog");
    }
  };

  const handleImageUpload = async (e, blogId, currentImage, slug) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBlogId(blogId);
      const result = await uploadBlogImage(
        blogId,
        currentImage,
        file,
        file.name,
        slug,
      );

      if (result?.success) {
        setBlog((prev) =>
          prev.map((blog) =>
            blog.id === blogId
              ? { ...blog, featured_image_url: result.imageUrl }
              : blog,
          ),
        );
      } else {
        setError(result?.error || "Failed to upload image");
      }
    } finally {
      setUploadingBlogId(null);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Blogs
        </Typography>
        <Button
          variant="contained"
          startIcon={<FiPlus size={18} />}
          onClick={handleCreateBlog}
          sx={{ textTransform: "none" }}
        >
          Create Blog
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={30} />
        </Box>
      ) : blogs.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ color: "#6b7280", mb: 2 }}>
            No blogs created yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<FiPlus size={18} />}
            onClick={handleCreateBlog}
          >
            Create Your First Blog
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {blogs.map((blog) => {
            const statusInfo =
              STATUS_COLORS[blog.status] || STATUS_COLORS.draft;
            return (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {/* Featured Image */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 180,
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {blog.featured_image_url ? (
                      <Box
                        component="img"
                        src={blog.featured_image_url}
                        alt={blog.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          color: "#9ca3af",
                        }}
                      >
                        <FiImage size={32} />
                        <Typography variant="caption">No image</Typography>
                      </Box>
                    )}

                    {/* Upload Button Overlay */}
                    <Box
                      component="label"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                      }}
                    >
                      <Button
                        component="span"
                        variant="contained"
                        size="small"
                        startIcon={<FiImage size={14} />}
                        sx={{
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          textTransform: "none",
                          "&:hover": { opacity: 1 },
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = "1")}
                      >
                        {uploadingBlogId === blog.id
                          ? "Uploading..."
                          : "Upload"}
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          handleImageUpload(
                            e,
                            blog.id,
                            blog.featured_image_url,
                            blog.slug,
                          )
                        }
                        disabled={uploadingBlogId === blog.id}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {blog.title}
                      </Typography>
                      <Chip
                        icon={
                          blog.status === "published" ? (
                            <FiCheck size={14} />
                          ) : (
                            <FiClock size={14} />
                          )
                        }
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.text,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mb: 1 }}
                    >
                      {blog.slug}
                    </Typography>

                    {blog.excerpt && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#9ca3af", display: "block" }}
                      >
                        {blog.excerpt.substring(0, 80)}
                        {blog.excerpt.length > 80 ? "..." : ""}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{ color: "#d1d5db", display: "block", mt: 1.5 }}
                    >
                      Created {new Date(blog.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<FiEdit2 size={14} />}
                      onClick={() => handleEditBlog(blog.id)}
                      sx={{ textTransform: "none", color: "#0884ff" }}
                    >
                      Edit
                    </Button>
                    {blog.status === "draft" && (
                      <Button
                        size="small"
                        startIcon={<FiCheck size={14} />}
                        onClick={() => handlePublishBlog(blog.id)}
                        sx={{ textTransform: "none", color: "#16a34a" }}
                      >
                        Publish
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(blog.id)}
                      sx={{ ml: "auto", color: "#ef4444" }}
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Blog?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
