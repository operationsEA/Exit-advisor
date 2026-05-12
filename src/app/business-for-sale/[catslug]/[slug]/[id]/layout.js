import { getListingDetail } from "@/app/business-for-sale/actions";

const SITE_URL = "https://bizforsale.io";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id, catslug, slug } = params;

  const result = await getListingDetail(id);

  if (!result.success || !result.data) {
    return {
      title: "Listing Not Found",
      robots: { index: false },
    };
  }

  const listing = result.data;
  const location = [listing.state, listing.country].filter(Boolean).join(", ");
  const description =
    listing.description?.substring(0, 160) ||
    `${listing.title} - ${listing.business_category} for sale`;
  const canonicalUrl = `${SITE_URL}/business-for-sale/${catslug}/${slug}/${id}`;
  const imageUrl = listing.image_url || `${SITE_URL}/og-image.png`;

  return {
    title: `${listing.title} - ${listing.business_category} for Sale${location ? ` in ${location}` : ""} | BizForSale.io`,
    description,
    keywords: [
      listing.business_category,
      `${listing.business_category} for sale`,
      ...(listing.tags || []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: listing.status === "available",
      follow: true,
    },
    openGraph: {
      title: listing.title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ListingDetailLayout({
  children,
  params: propsParams,
}) {
  const params = await propsParams;
  const { id, catslug, slug } = params;

  const result = await getListingDetail(id);

  if (!result.success || !result.data) {
    return <>{children}</>;
  }

  const listing = result.data;
  const imageUrl = listing.image_url || `${SITE_URL}/og-image.png`;
  const canonicalUrl = `${SITE_URL}/business-for-sale/${catslug}/${slug}/${id}`;

  // Product Schema JSON-LD
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": canonicalUrl,
    name: listing.title,
    description: listing.description || "",
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: "BizForSale.io",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: listing.currency || "USD",
      price: listing.min_price
        ? listing.min_price.toString()
        : "Contact for pricing",
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: listing.profiles?.full_name || "BizForSale.io",
      },
    },
    ...(listing.rating && listing.review_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: listing.rating,
            reviewCount: listing.review_count,
          },
        }
      : {}),
  };

  // BreadcrumbList Schema JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
      {
        "@type": "ListItem",
        position: 3,
        name: listing.business_category,
        item: `${SITE_URL}/business-for-sale/${catslug}/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: listing.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
