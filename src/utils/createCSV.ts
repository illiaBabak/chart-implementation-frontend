export const createCSV = (
  data: Record<string, string | number | boolean>[]
): Blob => {
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",");

  const rows = data.map((row) =>
    headers
      .map((key) => {
        return `"${row[key].toString()}"`;
      })
      .join(",")
  );

  const csvContent = [headerRow, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });

  return blob;
};
