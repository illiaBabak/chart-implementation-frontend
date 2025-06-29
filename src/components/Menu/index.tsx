import { useEffect, useState } from "react";
import { useGetDocument, useGetDocuments } from "src/api/pdf";
import { Category, Chart } from "src/types";
import { useQueryClient } from "@tanstack/react-query";
import { PDF_GET_DOCUMENTS_KEY } from "src/api/constants";

type Props = {
  onClose: () => void;
  selectedCategory: Category;
};

export const Menu = ({ onClose, selectedCategory }: Props) => {
  const [pollingDocKey, setPollingDocKey] = useState<string | null>(null);

  const { data: documents } = useGetDocuments(selectedCategory);

  const { data } = useGetDocument(pollingDocKey ?? "", {
    enabled: !!pollingDocKey,
    refetchInterval: 1000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const key = documents?.find((doc) => doc.status === "new")?.key;

    if (key) setPollingDocKey(key);

    if (data && (data?.status === "success" || data?.status === "error")) {
      setPollingDocKey(null);
      queryClient.invalidateQueries({
        queryKey: [PDF_GET_DOCUMENTS_KEY, data?.chart_type],
      });
    }
  }, [documents, data, queryClient, pollingDocKey, setPollingDocKey]);

  const handleDownload = async (doc: Chart) => {
    if (!doc.url) return;

    const response = await fetch(doc.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.chart_type}-v${doc.version}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed bottom-[8px] right-[8px] mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-80 z-50">
      <button
        onClick={onClose}
        className="absolute flex items-center justify-center top-[6px] right-[6px] w-[24px] h-[24px] cursor-pointer text-2xl text-gray-400 hover:text-gray-600 transition-colors"
      >
        x
      </button>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Documents</h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {documents?.map((doc) => (
          <div
            key={`${doc.chart_type}-v${doc.key}`}
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {doc.chart_type}-v{doc.version}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>Status: {doc.status}</span>
                {doc.status === "new" && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => handleDownload(doc)}
                disabled={!doc.url || doc.status !== "success"}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  doc.url && doc.status === "success"
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
