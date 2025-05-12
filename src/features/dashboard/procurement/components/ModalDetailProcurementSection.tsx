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
import { Textarea } from "@/components/ui/textarea";
import useGetProcurementById from "@/hooks/api/dashboard-dirops/useGetProcurementById";
import useUpdateProcurementStatus from "@/hooks/api/dashboard-dirops/useUpdateProcurementStatus";
import useUpdateProcurementNote from "@/hooks/api/dashboard-procurement/useUpdateProcurementNote";
import { ProcurementStatus } from "@/types/procurement";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

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

interface ModalDetailSectionProps {
  procurementId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ModalDetailSectionProcurement: React.FC<ModalDetailSectionProps> = ({
  procurementId,
  isOpen,
  onClose,
}) => {
  const { data: procurement, isLoading } = useGetProcurementById(procurementId);
  const updateStatusMutation = useUpdateProcurementStatus();
  const updateNoteMutation = useUpdateProcurementNote();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (procurement) {
      setNote(procurement.note || "");
    }
  }, [procurement]);

  const handleUpdateStatus = (status: ProcurementStatus) => {
    updateStatusMutation.mutate({
      id: procurementId,
      status,
    });
  };

  const handleUpdateNote = () => {
    if (note.trim() !== procurement?.note) {
      updateNoteMutation.mutate({
        id: procurementId,
        note,
      });
    }
  };

  const formatDate = (dateString: string): string => {
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

  const StatusButton = ({
    status,
    currentStatus,
  }: {
    status: ProcurementStatus;
    currentStatus: ProcurementStatus;
  }) => {
    const config = STATUS_CONFIG[status];
    const isActive = status === currentStatus;
    const baseClasses = `px-3 py-1.5 text-xs font-medium rounded-md transition-colors`;

    let className = baseClasses;
    if (isActive) {
      className += ` ${config.color} border-2`;
    } else {
      className += ` border ${config.color} opacity-70 hover:opacity-100`;
    }

    return (
      <button
        className={className}
        onClick={() => handleUpdateStatus(status)}
        disabled={isActive || updateStatusMutation.isPending}
      >
        {config.label}
      </button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 gap-6">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold">Detail Pengadaan</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Lihat dan perbarui detail pengadaan.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : procurement ? (
          <div className="space-y-6">
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-3 items-center">
                <div className="font-medium text-gray-600">Nama</div>
                <div className="col-span-2 font-medium text-gray-900">
                  {procurement.username}
                </div>
              </div>

              <div className="grid grid-cols-3 items-start">
                <div className="font-medium text-gray-600">
                  Keterangan
                </div>
                <div className="col-span-2 text-gray-900">{procurement.description}</div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="font-medium text-gray-600">Status</div>
                <div className="col-span-2">
                  <StatusBadge status={procurement.status} />
                </div>
              </div>

              <div className="grid grid-cols-3 items-center">
                <div className="font-medium text-gray-600">
                  Tanggal Dibuat
                </div>
                <div className="col-span-2 text-gray-900">
                  {formatDate(procurement.createdAt)}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="text-sm font-medium text-gray-800">Ubah Status</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_CONFIG).map(([status]) => (
                  <StatusButton
                    key={status}
                    status={status as ProcurementStatus}
                    currentStatus={procurement.status as ProcurementStatus}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <label htmlFor="note" className="text-sm font-medium text-gray-800">
                  Catatan
                </label>
                <Button
                  size="sm"
                  variant={note.trim() !== procurement.note ? "default" : "outline"}
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleUpdateNote}
                  disabled={
                    updateNoteMutation.isPending ||
                    note.trim() === procurement.note ||
                    note.length > 200
                  }
                >
                  {updateNoteMutation.isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      <span>Simpan Catatan</span>
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <Textarea
                  id="note"
                  placeholder="Tambahkan catatan untuk pengadaan ini..."
                  value={note}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setNote(e.target.value);
                    }
                  }}
                  className="min-h-[100px] text-sm resize-none break-all overflow-wrap-anywhere"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  maxLength={200}
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${note.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {note.length}/200 karakter
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            Pengadaan tidak ditemukan
          </div>
        )}

        <DialogFooter className="pt-3 border-t">
          <Button onClick={onClose} className="px-6">Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSectionProcurement;