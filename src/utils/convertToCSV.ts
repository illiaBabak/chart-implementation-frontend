export const convertToCSV = (
  data: Record<string, string | number | boolean>[]
) => {
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",");

  const rows = data.map((row) =>
    headers
      .map((key) => {
        return `"${row[key].toString().replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = [headerRow, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
