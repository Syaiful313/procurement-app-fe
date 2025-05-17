"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProcurementItemPayload {
  itemName: string;
  specification: string;
  quantity: number;
  unit: string;
  description: string;
}

interface ProcurementPayload {
  username: string;
  date: Date | string;
  department: "PURCHASE" | "FACTORY" | "OFFICE";
  items: ProcurementItemPayload[];
}

const useCreateProcurement = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ProcurementPayload) => {
      const { data } = await axiosInstance.post("/procurements", {
        username: payload.username,
        date: payload.date,
        department: payload.department,
        items: payload.items,
      });
      return data;
    },
    onSuccess: async () => {
      toast.success("Procurement berhasil dibuat");
      await queryClient.invalidateQueries({ queryKey: ["user-procurements"] });
      router.push("/dashboard/user");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useCreateProcurement;
