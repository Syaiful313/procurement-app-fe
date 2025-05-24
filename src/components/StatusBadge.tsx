// components/badges/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
    color: "bg-gray-50 text-gray-600 border-gray-200",
    label: status.replace(/_/g, " "),
  };

  const mobileLabel =
    {
      WAITING_CONFIRMATION: "Menunggu",
      PRIORITAS: "Prioritas Tinggi",
      URGENT: "Prioritas Sedang",
      COMPLEMENT: "Prioritas Rendah",
      REJECTED: "Ditolak",
    }[status] || config.label;

  return (
    <Badge
      variant="outline"
      className={`px-1.5 sm:px-3 py-0.5 sm:py-1 font-medium text-[10px] sm:text-xs whitespace-nowrap ${config.color}`}
    >
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">{mobileLabel}</span>
    </Badge>
  );
}