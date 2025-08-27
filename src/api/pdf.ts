import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_URL } from "src/utils/constants";
import {
  PDF_DELETE_DOCUMENT_KEY,
  PDF_EXPORT_ARCHIVE_KEY,
  PDF_GENERATE_DOCUMENT_KEY,
  PDF_GET_DOCUMENT_KEY,
  PDF_GET_DOCUMENTS_KEY,
  PDF_MUTATION_KEY,
} from "./constants";
import { Category, Chart, ChartType } from "src/types";
import { isChart, isChartArray } from "src/utils/guards";

const generatePdf = async ({
  chartType,
  key,
}: {
  chartType: Category;
  key: string;
}): Promise<void> => {
  const response = await fetch(`${API_URL}/pdf/generate-document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chartType,
      key,
    }),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const blob = await response.blob();

  if (!blob.size) return;

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${chartType}-v1.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
};

const getDocuments = async (chartType: Category): Promise<Chart[]> => {
  const response = await fetch(
    `${API_URL}/pdf/get-documents?chartType=${chartType}`
  );

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  return isChartArray(data) ? data : [];
};

const getDocument = async (key: string): Promise<Chart | null> => {
  const response = await fetch(`${API_URL}/pdf/get-document?key=${key}`);

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  return isChart(data) ? data : null;
};

const deleteDocument = async (key: string): Promise<void> => {
  const response = await fetch(`${API_URL}/pdf/delete-document?key=${key}`, {
    method: "DELETE",
  });

  if (!response.ok)
    throw new Error(`Error deleting document: ${response.status}`);
};

const generateArchive = async (
  categories: Category[],
  chartType: ChartType
): Promise<void> => {
  const response = await fetch(`${API_URL}/pdf/generate-archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categories, chartType }),
  });

  if (!response.ok)
    throw new Error(`Error generating archive: ${response.status}`);

  const blob = await response.blob();

  if (!blob.size) return;

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `archive.zip`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
};

export const useGeneratePdf = (): UseMutationResult<
  void,
  Error,
  {
    chartType: Category;
    key: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_GENERATE_DOCUMENT_KEY],
    mutationFn: generatePdf,
    onSettled: async (_, __, { chartType, key }) => {
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, chartType, key],
      });
    },
    onMutate: async (variables) => {
      const prevQueryData = queryClient.getQueryData<Chart[]>([
        PDF_GET_DOCUMENTS_KEY,
        variables.chartType,
      ]);

      const latestVersion = Math.max(
        ...(prevQueryData?.map((doc) => doc.version ?? 0) ?? [0])
      );

      queryClient.setQueryData(
        [PDF_GET_DOCUMENTS_KEY, variables.chartType],
        (prev: Chart[]) => {
          return [
            ...(prev ?? []),
            {
              chart_type: variables.chartType,
              status: "new",
              key: variables.key,
              url: null,
              version: latestVersion + 1,
            },
          ];
        }
      );
    },
  });
};

export const useGetDocuments = (
  chartType: Category
): UseQueryResult<Chart[], Error> =>
  useQuery({
    queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
    queryFn: () => getDocuments(chartType),
  });

export const useGetDocument = (
  key: string,
  options?: Partial<UseQueryOptions<Chart | null, Error>>
): UseQueryResult<Chart | null, Error> =>
  useQuery({
    queryKey: [PDF_GET_DOCUMENT_KEY, key],
    queryFn: () => getDocument(key),
    ...options,
  });

export const useDeleteDocument = (): UseMutationResult<
  void,
  Error,
  {
    key: string;
    chartType: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_DELETE_DOCUMENT_KEY],
    mutationFn: ({ key }) => deleteDocument(key),
    onMutate: async ({ key, chartType }) => {
      await queryClient.cancelQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
      });

      const prevQueryData = queryClient.getQueryData<Chart[]>([
        PDF_GET_DOCUMENTS_KEY,
        chartType,
      ]);

      const newQueryData = prevQueryData?.filter((doc) => doc.key !== key);

      queryClient.setQueryData(
        [PDF_GET_DOCUMENTS_KEY, chartType],
        newQueryData
      );
    },
    onSettled: async (_, __, { chartType }) => {
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
      });
    },
  });
};

export const useGenerateArchive = (): UseMutationResult<
  void,
  Error,
  { categories: Category[]; chartType: ChartType },
  unknown
> =>
  useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_EXPORT_ARCHIVE_KEY],
    mutationFn: ({ categories, chartType }) =>
      generateArchive(categories, chartType),
  });
