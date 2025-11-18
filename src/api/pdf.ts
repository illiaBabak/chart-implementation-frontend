import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  PDF_DELETE_DOCUMENT_KEY,
  PDF_EXPORT_ARCHIVE_KEY,
  PDF_GENERATE_DOCUMENT_KEY,
  PDF_GET_DOCUMENT_KEY,
  PDF_GET_DOCUMENTS_KEY,
  PDF_MUTATION_KEY,
} from "./constants";
import { Category, Chart, ChartType, Language } from "src/types";
import { isChart, isChartArray } from "src/utils/guards";
import { fetchWithParams } from "src/utils/fetchWithParams";

const generatePdf = async ({
  chartType,
  key,
}: {
  chartType: Category;
  key: string;
}): Promise<Blob> => {
  const response = await fetchWithParams({
    url: "pdf/generate-document",
    method: "POST",
    body: JSON.stringify({
      chartType,
      key,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const blob = await response.blob();

  if (!blob.size) throw new Error(`Error blob: ${response.status}`);

  return blob;
};

const getDocuments = async (chartType: Category): Promise<Chart[]> => {
  const response = await fetchWithParams({
    url: "pdf/get-documents",
    urlParams: new URLSearchParams({ chartType }),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  return isChartArray(data) ? data : [];
};

const getDocument = async (key: string): Promise<Chart | null> => {
  const response = await fetchWithParams({
    url: "pdf/get-document",
    urlParams: new URLSearchParams({ key }),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();

  return isChart(data) ? data : null;
};

const deleteDocument = async (key: string): Promise<void> => {
  const response = await fetchWithParams({
    url: "pdf/delete-document",
    method: "DELETE",
    body: JSON.stringify({ key }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok)
    throw new Error(`Error deleting document: ${response.status}`);
};

const generateArchive = async (
  categories: Category[],
  chartType: ChartType,
  language: Language
): Promise<Blob> => {
  const response = await fetchWithParams({
    url: "pdf/generate-archive",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categories, chartType, language }),
  });

  if (!response.ok)
    throw new Error(`Error generating archive: ${response.status}`);

  const blob = await response.blob();

  if (!blob.size) throw new Error(`Error blob: ${response.status}`);

  return blob;
};

export const useGeneratePdf = (): UseMutationResult<
  Blob,
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
        queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
      });
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENT_KEY, key],
      });
    },
    onMutate: async (variables) => {
      const prevDocumentsList = queryClient.getQueryData<Chart[]>([
        PDF_GET_DOCUMENTS_KEY,
        variables.chartType,
      ]);

      const latestVersion = Math.max(
        ...(prevDocumentsList?.map((doc) => doc.version ?? 0) ?? [0])
      );

      const newDocument = {
        chart_type: variables.chartType,
        status: "new",
        key: variables.key,
        url: null,
        version: latestVersion + 1,
      };

      queryClient.setQueryData(
        [PDF_GET_DOCUMENTS_KEY, variables.chartType],
        (prev: Chart[]) => {
          return [...(prev ?? []), newDocument];
        }
      );

      queryClient.setQueryData(
        [PDF_GET_DOCUMENT_KEY, variables.key],
        newDocument
      );

      return { prevDocumentsList };
    },
    onError: async (_, { chartType, key }, context) => {
      if (context?.prevDocumentsList) {
        queryClient.setQueryData(
          [PDF_GET_DOCUMENTS_KEY, chartType],
          context?.prevDocumentsList
        );
      }

      queryClient.removeQueries({ queryKey: [PDF_GET_DOCUMENT_KEY, key] });
    },
  });
};

export const useGetDocuments = (
  chartType: Category,
  options?: Partial<UseQueryOptions<Chart[], Error>>
): UseQueryResult<Chart[], Error> =>
  useQuery({
    queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
    queryFn: () => getDocuments(chartType),
    ...options,
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

      return { prevQueryData };
    },
    onSettled: async (_, __, { chartType }) => {
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, chartType],
      });
    },
    onError: async (_, { chartType }, context) => {
      if (context?.prevQueryData) {
        queryClient.setQueryData(
          [PDF_GET_DOCUMENTS_KEY, chartType],
          context?.prevQueryData
        );
      }
    },
  });
};

export const useGenerateArchive = (): UseMutationResult<
  Blob,
  Error,
  { categories: Category[]; chartType: ChartType; language: Language },
  unknown
> =>
  useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_EXPORT_ARCHIVE_KEY],
    mutationFn: ({ categories, chartType, language }) =>
      generateArchive(categories, chartType, language),
  });
