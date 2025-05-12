"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { Procurement } from "@/types/procurement";
import { useQuery } from "@tanstack/react-query";

interface GetUserProcurementsQuery extends PaginationQueries {
  search?: string;
  status?: string;
}

const useGetUserProcurements = (queries?: GetUserProcurementsQuery) => {
  const { axiosInstance } = useAxios();

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
    retry: 1,
  });
};

export default useGetUserProcurements;
