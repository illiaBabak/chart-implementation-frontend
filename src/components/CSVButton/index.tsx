import { convertToCSV } from "src/utils/convertToCSV";

type Props = {
  data: Record<string, string | number | boolean>[];
};

export const CSVButton = ({ data }: Props) => {
  return (
    <button
      onClick={() => convertToCSV(data)}
      className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
    >
      Export to CSV
    </button>
  );
};
