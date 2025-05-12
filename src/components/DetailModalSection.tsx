"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useGetProcurementById from "@/hooks/api/dashboard-dirops/useGetProcurementById";
import { Calendar, Clock, FileText, Mail, User, XCircle } from "lucide-react";

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
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const procurement = data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        {isLoading ? (
          <div className="p-6">
            <DialogTitle>Memuat Data</DialogTitle>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Memuat detail pengadaan...
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <DialogTitle>Terjadi Kesalahan</DialogTitle>
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-600">
                Kesalahan Memuat Data
              </h3>
              <p className="text-muted-foreground mt-2">
                {error.message ||
                  "Terjadi kesalahan saat memuat data pengadaan"}
              </p>
            </div>
          </div>
        ) : procurement ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  Detail Pengadaan
                </DialogTitle>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3>Keterangan</h3>
                  </div>
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {procurement.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <h4 className="font-medium">Diajukan oleh</h4>
                    </div>
                    <p className="font-medium text-lg">
                      {procurement.username}
                    </p>
                  </div>

                  {procurement.user?.email && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <h4 className="font-medium">Email</h4>
                      </div>
                      <p className="text-muted-foreground">
                        {procurement.user.email}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <h4 className="font-medium">Tanggal Dibuat</h4>
                  </div>
                  <p className="text-muted-foreground">
                    {formatDate(procurement.date)}
                  </p>
                </div>

                {procurement.note && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3>Catatan</h3>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {procurement.note}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-6">
            <DialogTitle>Data Tidak Ditemukan</DialogTitle>
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-muted-foreground">Pengadaan tidak ditemukan</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailSection;
