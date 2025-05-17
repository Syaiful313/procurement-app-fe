"use client";
import useAxios from "@/hooks/useAxios";
import { ProcurementStatus } from "@/types/procurement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateProcurementStatusPayload {
  id: number;
  status: ProcurementStatus;
}

const useUpdateProcurementStatus = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProcurementStatusPayload) => {
      try {
        const { id, status } = payload;
        const { data } = await axiosInstance.patch(`/dirops/${id}`, { status });
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (data) => {
      toast.success("Status procurement berhasil diperbarui");
      await queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui status procurement"
      );
    },
  });
};

export default useUpdateProcurementStatus;
