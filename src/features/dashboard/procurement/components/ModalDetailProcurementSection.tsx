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
import useUpdateProcurementNote from "@/hooks/api/dashboard-procurement/useUpdateProcurementNote";
import { DEPARTMENT_MAPPING, STATUS_CONFIG } from "@/lib/constants";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

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
  const updateNoteMutation = useUpdateProcurementNote();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (procurement) {
      setNote(procurement.note || "");
    }
  }, [procurement]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 [&>button]:hidden">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold">Detail Pengadaan</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Lihat detail pengadaan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : procurement ? (
            <div className="space-y-6 py-6">
              {/* Informasi Umum */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                  Informasi Umum
                </h3>
                
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                  <div className="font-medium text-gray-600 mb-1 sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Nama</span>
                    <span>:</span>
                  </div>
                  <div className="font-medium text-gray-900 pl-4 sm:pl-0 sm:col-span-2">
                    {procurement.username}
                  </div>
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
              </div>

              {/* Items Pengadaan */}
              {procurement.procurementItems && procurement.procurementItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                    Items Pengadaan
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">No</th>
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">Nama Barang</th>
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">Spesifikasi</th>
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">Jumlah</th>
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">Satuan</th>
                          <th className="text-left px-4 py-2 border text-sm font-medium text-gray-700">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {procurement.procurementItems.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-2 border text-sm text-gray-900">{item.itemName}</td>
                            <td className="px-4 py-2 border text-sm text-gray-900">{item.specification}</td>
                            <td className="px-4 py-2 border text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 border text-sm text-gray-900">{item.unit}</td>
                            <td className="px-4 py-2 border text-sm text-gray-900">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Catatan */}
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
        </div>

        <DialogFooter className="p-6 pt-4 border-t shrink-0">
          <Button onClick={onClose} className="px-6 w-full sm:w-auto">Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSectionProcurement;