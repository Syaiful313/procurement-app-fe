"use client";
import useAxios from "@/hooks/useAxios";
import { useAppSelector } from "@/redux/hooks";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { Procurement } from "@/types/procurement";
import { useQuery } from "@tanstack/react-query";

interface GetUserProcurementsQuery extends PaginationQueries {
  search?: string;
  status?: string;
}

const useGetUserProcurements = (queries?: GetUserProcurementsQuery) => {
  const { axiosInstance } = useAxios();
  const { token } = useAppSelector((state) => state.user);

  return useQuery({
    queryKey: ["user-procurements", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Procurement>>(
        "/procurements",
        {
          params: queries,
        }
      );
      return data;
    },
    enabled: !!token, // Query hanya dijalankan jika token tersedia
    retry: 1, // Coba lagi sekali jika gagal
  });
};

export default useGetUserProcurements;
