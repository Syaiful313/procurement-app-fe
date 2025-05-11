"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppDispatch } from "@/redux/hooks";
import { loginAction } from "@/redux/slices/userSlice";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: Pick<User, "nik" | "password">) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      dispatch(loginAction(data));
      localStorage.setItem("token", JSON.stringify(data));
      if (data.role === "DIROPS") {
        router.push("/dashboard/dirops");
      } else if (data.role === "USER") {
        router.push("/dashboard/user");
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Login failed");
    },
  });
};

export default useLogin;
