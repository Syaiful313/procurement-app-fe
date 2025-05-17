"use client";
import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateProcurementNotePayload {
  id: number;
  note: string;
}

const useUpdateProcurementNote = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProcurementNotePayload) => {
      try {
        const { id, note } = payload;
        const { data } = await axiosInstance.patch(`/notes/${id}`, { note });
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Catatan procurement berhasil diperbarui");
      await queryClient.invalidateQueries({ queryKey: ["user-procurements"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui catatan procurement"
      );
    },
  });
};

export default useUpdateProcurementNote;