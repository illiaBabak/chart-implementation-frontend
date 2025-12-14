export type FetchWithParamsProps = {
  url: string;
  urlParams?: URLSearchParams;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
};

const API_URL =
  "https://chart-implementation-backend-production.up.railway.app/api";

export const fetchWithParams = async ({
  url,
  urlParams,
  headers,
  body,
  method = "GET",
}: FetchWithParamsProps) => {
  const response = await fetch(
    `${API_URL}/${url}${urlParams ? `?${urlParams.toString()}` : ""}`,
    { method, body, headers }
  );

  return response;
};
