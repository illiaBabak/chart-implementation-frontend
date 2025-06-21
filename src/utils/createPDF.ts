import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { capitalize } from "./capitalize";

pdfMake.vfs = pdfFonts.vfs;

export const createPdf = (
  data: Record<string, string | number | boolean>[]
) => {
  const headers = Object.keys(data[0]);

  const docDefinition = {
    content: [
      {
        text: "User stats",
        fontSize: 16,
        bold: true,
      },
      {
        table: {
          body: [
            [...headers.map((header) => capitalize(header))],
            ...data.map((item) => Object.values(item)),
          ],
        },
      },
    ],
  };

  pdfMake.createPdf(docDefinition).download("document.pdf");
};
