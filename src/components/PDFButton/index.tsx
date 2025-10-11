import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { PDF_GET_DOCUMENTS_KEY } from "src/api/constants";
import { useGeneratePdf, useGetDocument, useGetDocuments } from "src/api/pdf";
import { GlobalContext } from "src/context/contexts";
import { Category } from "src/types";
import { v4 as uuidv4 } from "uuid";
import { useUrlParams } from "src/hooks/useUrlParams";

type Props = {
  selectedCategory: Category;
};

export const PDFButton = ({ selectedCategory }: Props) => {
  const { getParam, setParam } = useUrlParams();

  const { setShouldShowDocumentsList } = useContext(GlobalContext);

  const queryClient = useQueryClient();

  const { data: documents } = useGetDocuments(selectedCategory);

  const newDocument = documents?.find((doc) => doc.status === "new");

  const key = getParam("key") ?? "";

  useEffect(() => {
    if (newDocument?.key && newDocument.key !== key) {
      setParam("key", newDocument.key);
    }
  }, [newDocument, setParam, key]);

  const { data } = useGetDocument(key, {
    enabled: !!key,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (data && data.status !== "new") {
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, data?.chart_type],
      });
    }
  }, [data, queryClient]);

  const { mutateAsync: generatePdf } = useGeneratePdf();

  const isDisabled = !!newDocument;

  const handleClick = async () => {
    const blob = await generatePdf({
      chartType: selectedCategory,
      key: uuidv4(),
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCategory}-v1.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    if (!!documents?.length && documents.length >= 1)
      setShouldShowDocumentsList(true);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`font-bold px-4 py-2 rounded-md ${
        isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-white text-black hover:outline-3 hover:outline-blue-500 cursor-pointer"
      }`}
    >
      Export to PDF
    </button>
  );
};
