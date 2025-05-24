// components/badges/TrackingStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { TRACKING_STATUS_CONFIG } from "@/lib/constants";

interface TrackingStatusBadgeProps {
  status: string;
}

export function TrackingStatusBadge({ status }: TrackingStatusBadgeProps) {
  const config = TRACKING_STATUS_CONFIG[
    status as keyof typeof TRACKING_STATUS_CONFIG
  ] || {
    color: "bg-gray-50 text-gray-600 border-gray-200",
    label: status.replace(/_/g, " "),
  };

  return (
    <Badge
      variant="outline"
      className={`px-1.5 sm:px-3 py-0.5 sm:py-1 font-medium text-[10px] sm:text-xs whitespace-nowrap ${config.color}`}
    >
      <span>{config.label}</span>
    </Badge>
  );
}