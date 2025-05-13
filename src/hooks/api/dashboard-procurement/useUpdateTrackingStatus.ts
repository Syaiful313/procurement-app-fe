"use client";
import useAxios from "@/hooks/useAxios";
import { TrackingStatus } from "@/types/procurement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateTrackingStatusPayload {
  id: number;
  trackingStatus: TrackingStatus;
}

const useUpdateTrackingStatus = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTrackingStatusPayload) => {
      try {
        const { id, trackingStatus } = payload;
        const { data } = await axiosInstance.patch(
          `/notes/tracking-status/${id}`, 
          { trackingStatus }
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success("Tracking status berhasil diperbarui");
      await queryClient.invalidateQueries({ queryKey: ["procurements"] });
      await queryClient.invalidateQueries({ queryKey: ["procurement", data.id] });
      router.push("/dashboard/procurement");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui tracking status"
      );
    },
  });
};

export default useUpdateTrackingStatus;