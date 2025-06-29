import { useContext, useState, useEffect } from "react";
import { useGeneratePdf, useGetDocuments } from "src/api/pdf";
import { GlobalContext } from "src/root";
import { Category } from "src/types";

type Props = {
  selectedCategory: Category;
};

export const PDFButton = ({ selectedCategory }: Props) => {
  const { setShouldShowMenu } = useContext(GlobalContext);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: documents } = useGetDocuments(selectedCategory);

  const { mutateAsync: generatePdf } = useGeneratePdf();

  const handleClick = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    await generatePdf({ chartType: selectedCategory });

    if (!!documents?.length && documents.length >= 1) setShouldShowMenu(true);
    else setShouldShowMenu(false);
  };

  useEffect(() => {
    if (isDisabled) {
      const timer = setTimeout(() => {
        setIsDisabled(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isDisabled]);

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
