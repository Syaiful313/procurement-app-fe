"use client";
import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteProcurementResponse {
  status: string;
  message: string;
  data: {
    id: number;
    userId: number;
    username: string;
    status: string;
    note: string | null;
    department: string;
    date: string;
    trackingStatus: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    procurementItems: Array<{
      id: number;
      procurementId: number;
      itemName: string;
      specification: string;
      quantity: number;
      unit: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

const useDeleteProcurement = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (
      procurementId: number
    ): Promise<DeleteProcurementResponse> => {
      const { data } = await axiosInstance.delete<DeleteProcurementResponse>(
        `/notes/procurement/${procurementId}`
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Procurement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
      queryClient.invalidateQueries({
        queryKey: ["procurement", data.data.id],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message ||
          error.response?.data ||
          "Failed to delete procurement"
      );
    },
  });
};

export default useDeleteProcurement;
