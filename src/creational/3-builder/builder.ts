type ReportFormat = "pdf" | "html";

type ReportOptions = {
  title: string;
  format: ReportFormat;
  includeCharts?: boolean;
  includeSummary?: boolean;
  language?: "es" | "en";
};

export const createReport = (options: ReportOptions) => {
  return {
    title: options.title,
    format: options.format,
    includeCharts: options.includeCharts ?? false,
    includeSummary: options.includeSummary ?? true,
    language: options.language ?? "es",
  };
};
