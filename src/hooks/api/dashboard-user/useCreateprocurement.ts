"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProcurementPayload {
  username: string;
  description: string;
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
