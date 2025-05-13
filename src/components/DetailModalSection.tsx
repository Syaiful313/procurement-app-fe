"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useGetProcurementById from "@/hooks/api/dashboard-dirops/useGetProcurementById";
import { Loader2 } from "lucide-react";

const STATUS_CONFIG = {
  WAITING_CONFIRMATION: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Menunggu Konfirmasi",
  },
  PRIORITAS: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Prioritas",
  },
  URGENT: { color: "bg-red-50 text-red-700 border-red-200", label: "Mendesak" },
  COMPLEMENT: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Melengkapi",
  },
  REJECTED: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "Ditolak",
  },
};

const DEPARTMENT_MAPPING = {
  PURCHASE: "Pembelian",
  FACTORY: "Pabrik",
  OFFICE: "Kantor",
};

interface ModalDetailSectionProps {
  procurementId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ModalDetailSection: React.FC<ModalDetailSectionProps> = ({
  procurementId,
  isOpen,
  onClose,
}) => {
  const { data: procurement, isLoading } = useGetProcurementById(procurementId);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      label: status.replace(/_/g, " "),
    };

    return (
      <Badge
        variant="outline"
        className={`px-3 py-1 font-medium text-xs whitespace-nowrap ${config.color}`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 [&>button]:hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold">Detail Pengadaan</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Informasi lengkap tentang pengadaan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : procurement ? (
            <div className="space-y-6 py-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                  <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Nama</span>
                    <span>:</span>
                  </div>
                  <div className="font-medium text-gray-900 pl-4 sm:pl-0 sm:col-span-2">
                    {procurement.username}
                  </div>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-start">
                  <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Keterangan</span>
                    <span>:</span>
                  </div>
                  <div className="text-gray-900 pl-4 sm:pl-0 sm:col-span-2">{procurement.description}</div>
                </div>

                {procurement.department && (
                  <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                    <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                      <span>Departemen</span>
                      <span>:</span>
                    </div>
                    <div className="text-gray-900 pl-4 sm:pl-0 sm:col-span-2">
                      {DEPARTMENT_MAPPING[procurement.department as keyof typeof DEPARTMENT_MAPPING] || procurement.department}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                  <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Status</span>
                    <span>:</span>
                  </div>
                  <div className="pl-4 sm:pl-0 sm:col-span-2">
                    <StatusBadge status={procurement.status} />
                  </div>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                  <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Tanggal Dibuat</span>
                    <span>:</span>
                  </div>
                  <div className="text-gray-900 pl-4 sm:pl-0 sm:col-span-2">
                    {formatDate(procurement.date)}
                  </div>
                </div>

                {procurement.user?.email && (
                  <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                    <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                      <span>Email</span>
                      <span>:</span>
                    </div>
                    <div className="text-gray-900 pl-4 sm:pl-0 sm:col-span-2">
                      {procurement.user.email}
                    </div>
                  </div>
                )}
              </div>

              {procurement.note && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="text-sm font-medium text-gray-800">Catatan:</div>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-all overflow-wrap-anywhere" 
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {procurement.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              Pengadaan tidak ditemukan
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t shrink-0">
          <Button onClick={onClose} className="px-6 w-full sm:w-auto">Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSection;