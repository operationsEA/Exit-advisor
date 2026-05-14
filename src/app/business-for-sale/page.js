import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import FilterPanel from "@/components/business-for-sale/FilterPanel";
import ListingsGrid from "@/components/business-for-sale/ListingsGrid";
import SearchBarClient from "@/components/business-for-sale/SearchBarClient";

const SITE_URL = "https://bizforsale.io";

/**
 * Server Component - Business For Sale Page
 * Coordinates filter panel and listings grid
 */
export default async function BusinessForSalePage(props) {
  const _props = await props;
  const searchParams = await _props.searchParams;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/business-for-sale/#page`,
    url: `${SITE_URL}/business-for-sale`,
    name: "Businesses For Sale",
    description:
      "Browse verified businesses for sale across every industry on BizForSale.io.",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Businesses For Sale",
          item: `${SITE_URL}/business-for-sale`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{ fontWeight: 700, mb: 1, fontSize: "2rem" }}
          >
            🏢 Business Listings
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Explore approved business opportunities
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 3, backgroundColor: "#ffffff" }}>
          <SearchBarClient initialSearch={searchParams.search || ""} />
        </Paper>

        <Grid container spacing={3}>
          {/* Left Sidebar - Filters (Client Component) */}
          <Grid item xs={12} md={3}>
            <FilterPanel />
          </Grid>

          {/* Right Content - Listings Grid (Server Component) */}
          <Grid item xs={12} md={9}>
            <ListingsGrid searchParams={searchParams} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
