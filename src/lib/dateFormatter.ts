// utils/dateFormatter.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const isMobile = window.innerWidth < 640;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: isMobile ? "numeric" : "short",
    year: isMobile ? "2-digit" : "numeric",
  });
}