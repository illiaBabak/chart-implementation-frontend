import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_URL } from "src/utils/constants";
import { PDF_GENERATE_DOCUMENT_KEY, PDF_MUTATION_KEY } from "./constants";
import { Category } from "src/types";

export const generatePdf = async ({
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
  link.download = "document.pdf";
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
  },
  unknown
> =>
  useMutation({
    mutationKey: [PDF_MUTATION_KEY, PDF_GENERATE_DOCUMENT_KEY],
    mutationFn: generatePdf,
  });
