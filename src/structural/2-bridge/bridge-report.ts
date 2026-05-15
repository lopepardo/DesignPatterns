type ReportExporter = {
  export(title: string, rows: string[][]): string;
};

export const csvExporter: ReportExporter = {
  export(title, rows) {
    return [title, ...rows.map((row) => row.join(","))].join("\n");
  },
};

export const htmlExporter: ReportExporter = {
  export(title, rows) {
    const tableRows = rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join("");

    return `<h1>${title}</h1><table>${tableRows}</table>`;
  },
};

export class SalesReport {
  constructor(private readonly exporter: ReportExporter) {}

  generate(): string {
    const rows = [
      ["Producto", "Ventas"],
      ["Camisa", "120"],
      ["Zapatos", "80"],
    ];

    return this.exporter.export("Reporte de ventas", rows);
  }
}
