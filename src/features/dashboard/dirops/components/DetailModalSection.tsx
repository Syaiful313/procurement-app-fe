"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import useGetProcurementById from "@/hooks/api/dashboard-dirops/useGetProcurementById";
import { ProcurementStatus } from "@/types/procurement";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle
} from "lucide-react";

const ModalDetailSection = ({
  procurementId,
  isOpen,
  onClose,
}: {
  procurementId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data, isLoading, error } = useGetProcurementById(procurementId);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "WAITING_CONFIRMATION":
        return {
          variant: "outline",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      case "PRIORITAS":
        return {
          variant: "outline",
          color: "text-orange-600",
          bg: "bg-orange-50",
        };
      case "URGENT":
        return { variant: "outline", color: "text-red-600", bg: "bg-red-50" };
      case "COMPLEMENT":
        return {
          variant: "outline",
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "REJECTED":
        return { variant: "outline", color: "text-gray-600", bg: "bg-gray-50" };
      default:
        return {
          variant: "outline",
          color: "text-muted-foreground",
          bg: "bg-muted",
        };
    }
  };

  const getStatusIcon = (status: ProcurementStatus) => {
    switch (status) {
      case "WAITING_CONFIRMATION":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "PRIORITAS":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "URGENT":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "COMPLEMENT":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const procurement = data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <>
            <DialogTitle>Loading</DialogTitle>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading procurement details...</span>
            </div>
          </>
        ) : error ? (
          <>
            <DialogTitle>Error</DialogTitle>
            <div className="py-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-600">
                Error Loading Data
              </h3>
              <p className="text-muted-foreground mt-2">
                {error.message ||
                  "Terjadi kesalahan saat memuat data procurement"}
              </p>
            </div>
          </>
        ) : procurement ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Detail Procurement</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-semibold text-lg">Keterangan</h3>
                <p className="mt-2 text-muted-foreground">
                  {procurement.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Diajukan oleh
                  </h4>
                  <p className="font-medium">{procurement.username}</p>
                </div>
                {procurement.user?.email && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Email
                    </h4>
                    <p>{procurement.user.email}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Tanggal Dibuat
                  </h4>
                  <p>{formatDate(procurement.createdAt)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogTitle>Not Found</DialogTitle>
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Procurement tidak ditemukan
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSection;
