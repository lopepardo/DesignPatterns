interface Prototype<T> {
  clone(): T;
}

export class ReportTemplate implements Prototype<ReportTemplate> {
  constructor(
    public title: string,
    public sections: string[],
    public includeCharts: boolean,
  ) {}

  clone(): ReportTemplate {
    return new ReportTemplate(
      this.title,
      [...this.sections],
      this.includeCharts,
    );
  }
}
