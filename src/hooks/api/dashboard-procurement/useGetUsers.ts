import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/Pagination";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

interface GetUsersQuery extends PaginationQueries {
  role?: string;
}

const useGetUsers = (queries: GetUsersQuery) => {
  return useQuery({
    queryKey: ["users", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<User>>(
        "/notes/users",
        {
          params: queries,
        },
      );
      return data;
    },
  });
};

export default useGetUsers;