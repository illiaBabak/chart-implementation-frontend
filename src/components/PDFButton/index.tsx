import { ChartItem } from "src/types";
import { createPdf } from "src/utils/createPDF";

type Props = {
  data: ChartItem[];
};

export const PDFButton = ({ data }: Props) => {
  return (
    <button
      onClick={() => createPdf(data)}
      className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
    >
      Export to PDF
    </button>
  );
};
