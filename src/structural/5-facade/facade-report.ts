type ReportPdfRequest = {
  title: string;
  rows: string[][];
};

type PdfFacade = {
  createReportPdf(request: ReportPdfRequest): Buffer;
};

export const externalPdfLibrary = {
  createDocument() {
    return {
      setPageSize(size: string) {
        console.log(`Configurando tamaño de página: ${size}`);
      },

      setMargins(margins: number) {
        console.log(`Configurando márgenes: ${margins}`);
      },

      addHeader(text: string) {
        console.log(`Agregando encabezado: ${text}`);
      },

      addTable(rows: string[][]) {
        console.log(`Agregando tabla con ${rows.length + 1} filas`);
      },

      addFooter(text: string) {
        console.log(`Agregando pie de página: ${text}`);
      },

      render() {
        console.log("Renderizando PDF");
        return Buffer.from("PDF content");
      },
    };
  },
};

export const createPdfFacade = (pdfLibrary: any): PdfFacade => {
  return {
    createReportPdf(request) {
      const doc = pdfLibrary.createDocument();

      doc.setPageSize("A4");
      doc.setMargins(20);
      doc.addHeader(request.title);
      doc.addTable(request.rows);
      doc.addFooter("Generado automáticamente");

      return doc.render();
    },
  };
};
