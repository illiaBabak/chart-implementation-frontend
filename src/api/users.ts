import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "src/types";
import { API_URL } from "src/utils/constants";
import { isUserArr } from "src/utils/guards";

const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();

  return isUserArr(data) ? data : [];
};

export const useGetUsersQuery = (): UseQueryResult<User[], Error> =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
