type ReportFormat = "pdf" | "html";
type Language = "es" | "en";

type Report = {
  title: string;
  format: ReportFormat;
  language: Language;
  includeCharts: boolean;
  includeSummary: boolean;
};

export class ReportBuilder {
  private title?: string;
  private format: ReportFormat = "pdf";
  private language: Language = "es";
  private includeCharts = false;
  private includeSummary = true;

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  asPdf(): this {
    this.format = "pdf";
    return this;
  }

  asHtml(): this {
    this.format = "html";
    return this;
  }

  inSpanish(): this {
    this.language = "es";
    return this;
  }

  inEnglish(): this {
    this.language = "en";
    return this;
  }

  withCharts(): this {
    this.includeCharts = true;
    return this;
  }

  withoutSummary(): this {
    this.includeSummary = false;
    return this;
  }

  build(): Report {
    if (!this.title) {
      throw new Error("El reporte necesita un título");
    }

    return {
      title: this.title,
      format: this.format,
      language: this.language,
      includeCharts: this.includeCharts,
      includeSummary: this.includeSummary,
    };
  }
}
