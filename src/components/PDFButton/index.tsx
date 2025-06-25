import { useGeneratePdf } from "src/api/pdf";
import { Category } from "src/types";

type Props = {
  selectedCategory: Category;
};

export const PDFButton = ({ selectedCategory }: Props) => {
  const { mutate: generatePdf } = useGeneratePdf();

  return (
    <button
      onClick={() => generatePdf({ chartType: selectedCategory })}
      className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
    >
      Export to PDF
    </button>
  );
};
