import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { Procurement } from "@/types/procurement";
import { useQuery } from "@tanstack/react-query";

interface GetProcurementsQuery extends PaginationQueries {
  search?: string
   status?: string;
}

const useGetProcurements = (queries: GetProcurementsQuery) => {
  return useQuery({
    queryKey: ["procurements", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Procurement>>(
        "/dirops",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetProcurements;
