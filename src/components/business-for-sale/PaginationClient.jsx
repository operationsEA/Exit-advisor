"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@mui/material";

/**
 * Client Component - Pagination
 * Handles pagination clicks and URL updates
 */
export default function PaginationClient({ totalPages, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());

    router.push(`/business-for-sale?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
    />
  );
}
