"use client";
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
import { Badge } from "@/components/ui/badge";
import useGetProcurementById from "@/hooks/api/dashboard-dirops/useGetProcurementById";
import useUpdateProcurementStatus from "@/hooks/api/dashboard-dirops/useUpdateProcurementStatus";
import useUpdateProcurementNote from "@/hooks/api/auth/dashboard-procurement/useUpdateProcurementNote";
import { ProcurementStatus } from "@/types/procurement";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

// Status configuration for consistent styling
const STATUS_CONFIG = {
  WAITING_CONFIRMATION: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Waiting Confirmation" },
  PRIORITAS: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Prioritas" },
  URGENT: { color: "bg-red-50 text-red-700 border-red-200", label: "Urgent" },
  COMPLEMENT: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Complement" },
  REJECTED: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Rejected" },
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
      label: status.replace(/_/g, " ") 
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

  const StatusButton = ({ status, currentStatus }: { status: ProcurementStatus, currentStatus: ProcurementStatus }) => {
    const config = STATUS_CONFIG[status];
    const isActive = status === currentStatus;
    const baseClasses = `px-3 py-1 text-xs font-medium rounded-md transition-colors`;
    
    let className = baseClasses;
    if (isActive) {
      // Active status - more prominent
      className += ` ${config.color} border-2`;
    } else {
      // Inactive status - more subtle
      className += ` border hover:${config.color} ${config.color.replace('bg-', 'hover:bg-')}`;
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
          <DialogTitle className="text-xl">Detail Procurement</DialogTitle>
          <DialogDescription>
            Lihat dan update detail procurement.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : procurement ? (
          <div className="space-y-6">
            {/* Detail Information */}
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center">
                <div className="text-sm font-medium text-gray-500">Nama</div>
                <div className="col-span-2 font-medium">{procurement.username}</div>
              </div>
              
              <div className="grid grid-cols-3 items-start">
                <div className="text-sm font-medium text-gray-500">Keterangan</div>
                <div className="col-span-2">{procurement.description}</div>
              </div>
              
              <div className="grid grid-cols-3 items-center">
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="col-span-2">
                  <StatusBadge status={procurement.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center">
                <div className="text-sm font-medium text-gray-500">Tanggal Dibuat</div>
                <div className="col-span-2">{formatDate(procurement.createdAt)}</div>
              </div>
            </div>

            {/* Status Management */}
            <div className="space-y-3 pt-2 border-t">
              <div className="text-sm font-medium">Ubah Status</div>
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

            {/* Notes Section */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex justify-between items-center">
                <label htmlFor="note" className="text-sm font-medium">
                  Catatan
                </label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleUpdateNote}
                  disabled={updateNoteMutation.isPending || note.trim() === procurement.note}
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
              <Textarea
                id="note"
                placeholder="Tambahkan catatan untuk procurement ini..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            Procurement tidak ditemukan
          </div>
        )}

        <DialogFooter className="pt-2 border-t">
          <Button onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSectionProcurement;