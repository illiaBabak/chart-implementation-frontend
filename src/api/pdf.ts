import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { API_URL } from "src/utils/constants";
import {
  PDF_GENERATE_DOCUMENT_KEY,
  PDF_GET_DOCUMENT_KEY,
  PDF_GET_DOCUMENTS_KEY,
  PDF_MUTATION_KEY,
} from "./constants";
import { Category, Chart } from "src/types";
import { isChart, isChartArray } from "src/utils/guards";

const generatePdf = async ({
  chartType,
}: {
  chartType: Category;
}): Promise<void> => {
  const response = await fetch(`${API_URL}/pdf/generate-document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chartType,
    }),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${chartType}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
};

const getDocuments = async (): Promise<Chart[]> => {
  const response = await fetch(`${API_URL}/pdf/get-documents`);

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

export const useGeneratePdf = (): UseMutationResult<
  void,
  Error,
  {
    chartType: Category;
  },
  unknown
> =>
  useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_GENERATE_DOCUMENT_KEY],
    mutationFn: generatePdf,
  });

export const useGetDocuments = (): UseQueryResult<Chart[], Error> =>
  useQuery({
    queryKey: [PDF_GET_DOCUMENTS_KEY],
    queryFn: getDocuments,
  });

export const useGetDocument = (
  key: string
): UseQueryResult<Chart | null, Error> =>
  useQuery({
    queryKey: [PDF_GET_DOCUMENT_KEY, key],
    queryFn: () => getDocument(key),
  });
