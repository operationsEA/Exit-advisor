/**
 * Formats a UUID into a short readable listing reference.
 * Example: "417ee5d8-6024-4c9f-baa3-b81527934f22" → "AGX-baa3-b81527934f22"
 * @param {string} id - A UUID string
 * @returns {string} Formatted ID or the original if not a valid UUID
 */
export function formatListingId(id) {
  if (!id || typeof id !== "string") return id;
  const parts = id.split("-");
  if (parts.length < 2) return id;
  const secondLast = parts[parts.length - 2];
  const last = parts[parts.length - 1];
  return {
    original: id,
    formatted: `AGX-${secondLast}-${last}`,
  };
}
