"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  nik: string;
  role: string;
}

const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await axiosInstance.post("/auth/register", payload);
      return data;
    },
    onSuccess: async () => {
      toast.success("Register successfully");
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      router.push("/dashboard/procurement/users");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useRegister;
