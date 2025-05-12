"use client";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteUserResponse {
  status: string;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    deletedAt: string;
  };
}

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number): Promise<DeleteUserResponse> => {
      const { data } = await axiosInstance.delete<DeleteUserResponse>(
        `/notes/${userId}`
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.data.id] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message ||
          error.response?.data ||
          "Failed to delete user"
      );
    },
  });
};

export default useDeleteUser;
