"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: Pick<User, "nik" | "password">) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      await signIn("credentials", {
        ...data,
        token: data.token,
        redirect: false,
      });
      toast.success("Login successfully");
      
      if (data.role === "DIROPS") {
        router.push("/dashboard/dirops");
      } else if (data.role === "USER") {
        router.push("/dashboard/user");
      } else if (data.role === "MANAGER") {
        router.push("/dashboard/manager");
      } else if (data.role === "PROCUREMENT") {
        router.push("/dashboard/procurement");
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Login failed");
    },
  });
};

export default useLogin;
