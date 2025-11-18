import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { User } from "src/types";
import { isUserArr } from "src/utils/guards";
import { USERS_QUERY_KEY } from "./constants";
import { fetchWithParams } from "src/utils/fetchWithParams";

const getUsers = async (): Promise<User[]> => {
  const response = await fetchWithParams({
    url: "users",
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  return isUserArr(data) ? data : [];
};

export const useGetUsersQuery = (
  options?: Partial<UseQueryOptions<User[], Error>>
): UseQueryResult<User[], Error> =>
  useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: getUsers,
    ...options,
  });
