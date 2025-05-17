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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRACKING_STATUS_CONFIG } from "@/lib/constants";
import { Procurement, TrackingStatus } from "@/types/procurement";
import { Loader2 } from "lucide-react";

interface ModalUpdateTrackingStatusProps {
  isOpen: boolean;
  onClose: () => void;
  procurement: Procurement | null;
  selectedTrackingStatus: TrackingStatus | "";
  onTrackingStatusChange: (status: TrackingStatus) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

const TrackingStatusBadge = ({ status }: { status: string }) => {
  const config = TRACKING_STATUS_CONFIG[
    status as keyof typeof TRACKING_STATUS_CONFIG
  ] || {
    color: "bg-gray-50 text-gray-600 border-gray-200",
    label: status.replace(/_/g, " "),
  };

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 font-medium text-xs whitespace-nowrap ${config.color}`}
    >
      <span>{config.label}</span>
    </Badge>
  );
};

export default function ModalUpdateTrackingStatus({
  isOpen,
  onClose,
  procurement,
  selectedTrackingStatus,
  onTrackingStatusChange,
  onUpdate,
  isUpdating,
}: ModalUpdateTrackingStatusProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[95%] sm:max-w-[450px] flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 gap-0 rounded-lg sm:rounded-xl overflow-hidden [&>button]:hidden mx-auto">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Update Tracking Status
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500 mt-1">
            Perbarui status tracking untuk pengadaan barang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {procurement ? (
            <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center">
                  <div className="font-medium text-gray-600 text-sm mb-1 sm:text-base sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Pemohon</span>
                    <span className="hidden sm:inline">:</span>
                  </div>
                  <div className="text-gray-900 text-sm sm:text-base pl-0 sm:pl-0 sm:col-span-2">
                    {procurement.username}
                  </div>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center pt-2 sm:pt-0">
                  <div className="font-medium text-gray-600 text-sm mb-1 sm:text-base sm:mb-0 sm:flex sm:justify-between sm:pr-2">
                    <span>Status Saat Ini</span>
                    <span className="hidden sm:inline">:</span>
                  </div>
                  <div className="pl-0 sm:pl-0 sm:col-span-2">
                    <TrackingStatusBadge status={procurement.trackingStatus} />
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-800 block">
                    Pilih Status Tracking Baru:
                  </label>
                  <Select
                    value={selectedTrackingStatus}
                    onValueChange={(value) =>
                      onTrackingStatusChange(value as TrackingStatus)
                    }
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Pilih status tracking" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRACKING_STATUS_CONFIG).map(
                        ([value, config]) => (
                          <SelectItem key={value} value={value} className="text-sm">
                            {config.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <p className="text-gray-500 text-sm sm:text-base">Data pengadaan tidak ditemukan</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 sm:pt-4 border-t shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto text-sm h-9 sm:h-10"
            >
              Batal
            </Button>
            <Button
              onClick={onUpdate}
              disabled={!selectedTrackingStatus || isUpdating || selectedTrackingStatus === procurement?.trackingStatus}
              className="w-full sm:w-auto text-sm h-9 sm:h-10"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span>Memperbarui...</span>
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}