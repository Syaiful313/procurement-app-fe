"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProcurementPayload {
  username: string;
  description: string;
  date: Date | string;
  department: "PURCHASE" | "FACTORY" | "OFFICE";
}

const useCreateProcurement = () => {
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ProcurementPayload) => {
      const { data } = await axiosInstance.post("/procurements", {
        username: payload.username,
        description: payload.description,
        date: payload.date,
        department: payload.department,
      });
      return data;
    },
    onSuccess: async () => {
      toast.success("Procurement berhasil dibuat");
      await queryClient.invalidateQueries({ queryKey: ["procurements"] });
      router.push("/dashboard/user");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useCreateProcurement;