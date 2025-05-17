"use client";
import useAxios from "@/hooks/useAxios";
import { Procurement } from "@/types/procurement";
import { useQuery } from "@tanstack/react-query";

const useGetProcurementById = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["user-procurements", "detail", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Procurement>(`/dirops/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export default useGetProcurementById;
