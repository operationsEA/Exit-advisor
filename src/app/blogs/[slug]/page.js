import { Metadata } from "next";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "@/app/dashboard/blogs/actions";
import blogCategories from "@/data/blog-categories.json";

const getCategoryLabel = (value) => {
  return blogCategories.find((c) => c.value === value)?.label || value;
};

export async function generateMetadata(props) {
  const _props = await props;
  const _params = await _props.params;
  const result = await getPublishedBlogBySlug(_params?.slug);

  if (!result?.success) {
    return {
      title: "Blog Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  const blog = result.data;

  return {
    title: `${blog.title} | Business Selling Blog`,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      url: `https://bizforsale.io/blogs/${blog.slug}`,
      images: blog.featured_image_url
        ? [{ url: blog.featured_image_url, width: 1200, height: 630 }]
        : [],
      publishedTime: blog.published_at,
      authors: [blog.profiles?.full_name || "Admin"],
    },
  };
}

export default async function BlogDetailPage(props) {
  const _props = await props;
  const _params = await _props.params;
  const result = await getPublishedBlogBySlug(_params?.slug);

  if (!result?.success) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#6b7280", mb: 2 }}>
          Blog post not found
        </Typography>
        <Link href="/blogs">
          <Button startIcon={<FiArrowLeft />} sx={{ textTransform: "none" }}>
            Back to Blogs
          </Button>
        </Link>
      </Container>
    );
  }

  const blog = result.data;

  // Fetch other blogs for sidebar
  const otherBlogsResult = await getPublishedBlogs(5, 0);
  const otherBlogs = (otherBlogsResult?.data || [])
    .filter((b) => b.id !== blog.id)
    .slice(0, 4);

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://bizforsale.io/blogs/${blog.slug}`,
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featured_image_url || "https://bizforsale.io/default-image.jpg",
    datePublished: blog.published_at,
    dateModified: blog.created_at,
    author: {
      "@type": "Person",
      name: blog.profiles?.full_name || "Admin",
      email: blog.profiles?.email,
    },
    publisher: {
      "@type": "Organization",
      name: "Business Selling Platform",
      logo: {
        "@type": "ImageObject",
        url: "https://bizforsale.io/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bizforsale.io/blogs/${blog.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Box sx={{ backgroundColor: "#f9fafb", py: 4 }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Link href="/blogs" style={{ textDecoration: "none" }}>
            <Button
              startIcon={<FiArrowLeft size={16} />}
              sx={{
                textTransform: "none",
                color: "#0884ff",
                mb: 3,
                "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.05)" },
              }}
            >
              Back to Blogs
            </Button>
          </Link>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    mb: 2,
                    lineHeight: 1.2,
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                  }}
                >
                  {blog.title}
                </Typography>

                {blog.category_id && (
                  <Typography
                    sx={{
                      display: "inline-block",
                      backgroundColor: "#dbeafe",
                      color: "#0884ff",
                      px: 2,
                      py: 0.75,
                      borderRadius: 1,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {getCategoryLabel(blog.category_id)}
                  </Typography>
                )}
                {/* Featured Image */}
                {blog.featured_image_url && (
                  <Box
                    component="img"
                    src={blog.featured_image_url}
                    alt={blog.title}
                    sx={{
                      width: "100%",
                      height: 400,
                      objectFit: "cover",
                      borderRadius: 2,
                      mb: 4,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                )}
                {/* Meta Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Avatar
                    sx={{ width: 40, height: 40, backgroundColor: "#0884ff" }}
                  >
                    {blog.profiles?.full_name?.charAt(0) || "A"}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#0f172a" }}
                    >
                      {blog.profiles?.full_name || "Admin"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {new Date(blog.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Content */}
              <Box
                sx={{
                  "& h1": {
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    mt: 3,
                    mb: 1.5,
                  },
                  "& h2": {
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    mt: 3,
                    mb: 1.5,
                  },
                  "& h3": {
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    mt: 2.5,
                    mb: 1,
                  },
                  "& p": {
                    color: "#374151",
                    lineHeight: 1.8,
                    mb: 1.5,
                    fontSize: "1rem",
                  },
                  "& ul, & ol": {
                    color: "#374151",
                    lineHeight: 1.8,
                    mb: 1.5,
                    paddingLeft: 2.5,
                  },
                  "& li": {
                    mb: 0.75,
                  },
                  "& blockquote": {
                    borderLeft: "4px solid #0884ff",
                    backgroundColor: "rgba(8, 132, 255, 0.05)",
                    padding: "1rem 1.25rem",
                    my: 2.5,
                    fontStyle: "italic",
                    color: "#374151",
                    borderRadius: "0 4px 4px 0",
                  },
                  "& code": {
                    backgroundColor: "#f3f4f6",
                    color: "#dc2626",
                    padding: "0.25rem 0.5rem",
                    borderRadius: 1,
                    fontFamily: "monospace",
                  },
                  "& pre": {
                    backgroundColor: "#1f2937",
                    color: "#f3f4f6",
                    padding: 2,
                    borderRadius: 1,
                    overflow: "auto",
                    mb: 2,
                    "& code": {
                      backgroundColor: "transparent",
                      color: "inherit",
                      padding: 0,
                    },
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 1,
                    my: 2,
                  },
                  "& a": {
                    color: "#0884ff",
                    textDecoration: "underline",
                    "&:hover": { textDecoration: "none" },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <Divider sx={{ my: 4 }} />

              {/* Footer CTA */}
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography sx={{ color: "#6b7280", mb: 2 }}>
                  Looking to buy or sell a business?
                </Typography>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ textTransform: "none" }}
                  >
                    Explore Listings
                  </Button>
                </Link>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: 20 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    color: "#0f172a",
                  }}
                >
                  Related Articles
                </Typography>

                {otherBlogs.length > 0 ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {otherBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id}
                        href={`/blogs/${relatedBlog.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card
                          sx={{
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          {relatedBlog.featured_image_url && (
                            <Box
                              sx={{
                                width: "100%",
                                height: 120,
                                backgroundImage: `url(${relatedBlog.featured_image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          )}

                          <CardContent>
                            {relatedBlog.category_id && (
                              <Chip
                                label={getCategoryLabel(
                                  relatedBlog.category_id,
                                )}
                                size="small"
                                sx={{
                                  backgroundColor: "#dbeafe",
                                  color: "#0884ff",
                                  fontWeight: 600,
                                  mb: 1,
                                }}
                              />
                            )}

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                                lineHeight: 1.3,
                                mb: 1,
                              }}
                            >
                              {relatedBlog.title}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color: "#9ca3af",
                                display: "block",
                              }}
                            >
                              {new Date(
                                relatedBlog.published_at,
                              ).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: "#9ca3af" }}>
                    No other blogs available.
                  </Typography>
                )}

                {/* View All CTA */}
                <Link href="/blogs" style={{ textDecoration: "none" }}>
                  <Button
                    fullWidth
                    endIcon={<FiArrowRight size={16} />}
                    sx={{
                      mt: 2.5,
                      textTransform: "none",
                      color: "#0884ff",
                      fontWeight: 600,
                    }}
                  >
                    View All Articles
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
