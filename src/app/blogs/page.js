import { Metadata } from "next";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { getPublishedBlogs } from "@/app/dashboard/blogs/actions";
import blogCategories from "@/data/blog-categories.json";

const getCategoryLabel = (value) => {
  return blogCategories.find((c) => c.value === value)?.label || value;
};

export const metadata = {
  title: "Blog | Business Selling Platform",
  description:
    "Insights, tips, and resources for buying and selling businesses. Expert advice on business valuation, negotiation, and more.",
  openGraph: {
    title: "Blog | Business Selling Platform",
    description:
      "Insights, tips, and resources for buying and selling businesses.",
    type: "website",
    url: "https://yourdomain.com/blogs",
  },
};

export default async function BlogsPage() {
  const result = await getPublishedBlogs(12, 0);

  const blogs = result?.data || [];

  return (
    <Box sx={{ py: 8, backgroundColor: "#f9fafb" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "#0f172a",
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Business Insights & Resources
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#6b7280",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Expert guides, industry trends, and actionable tips for buying and
            selling businesses
          </Typography>
        </Box>

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  {/* Featured Image */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      backgroundColor: "#e5e7eb",
                      overflow: "hidden",
                      backgroundImage: blog.featured_image_url
                        ? `url(${blog.featured_image_url})`
                        : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    {/* Category Chip */}
                    {blog.category_id && (
                      <Chip
                        label={getCategoryLabel(blog.category_id)}
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#0884ff",
                          fontWeight: 600,
                          width: "fit-content",
                        }}
                      />
                    )}

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.4,
                        mb: 0.5,
                      }}
                    >
                      {blog.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}
                    >
                      {blog.excerpt?.substring(0, 100) +
                        (blog.excerpt?.length > 100 ? "..." : "")}
                    </Typography>

                    {/* Meta Info */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1.5,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        {blog.profiles?.full_name} •{" "}
                        {new Date(blog.published_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* Read More Button */}
                    <Link
                      href={`/blogs/${blog.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        fullWidth
                        endIcon={<FiArrowRight size={16} />}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          color: "#0884ff",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "rgba(8, 132, 255, 0.05)",
                          },
                        }}
                      >
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: "#6b7280" }}>
              No blogs published yet.
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
}
