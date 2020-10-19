import { PrometheusLabels, PrometheusMetric, PrometheusMetricType } from './index'

interface PrometheusCounterOptions {
  description: string;
  labels?: PrometheusLabels;
}

interface PrometheusCounterLabelValues {
  [key: string]: number;
}

export class PrometheusCounter implements PrometheusMetric {
  // Public Attributes
  public key: string;
  public type: PrometheusMetricType;
  public labels: PrometheusLabels;
  public values: PrometheusCounterLabelValues;
  public description?: string;
  // Private attributes
  // Constructor
  constructor (key: string, options?: PrometheusCounterOptions) {
    this.key = key;
    this.type = PrometheusMetricType.COUNTER;
    this.values = {};
    this.labels = options?.labels || {};
    if (options?.description) { this.description = options?.description }
  }
  // Public Methods
  public inc (value = 1, circuitName: string): void {
    this.values[circuitName] = this.values[circuitName] || 0;
    this.values[circuitName] += value;
  }
  public scrap (): string {
    let str = this.scrapHelp();
    str += this.scrapValues();
    return str;
  }
  public scrapHelp (): string {
    let str = '';
    str += `# HELP ${this.key} ${this.description}\n`;
    str += `# TYPE ${this.key} ${this.type}\n`;
    return str;
  }
  public scrapValues (): string {
    let res = '';
    if (Object.keys(this.values).length) {
      for (const circuit in this.values) {
        let labels = `circuit="${circuit}"`;
        for (const label in this.labels) {
          labels+= `, ${label}="${this.labels[label]}"`;
        }
        res += `${this.key}{${labels}} ${this.values[circuit]}\n`;
      }
    }
    return res;
  }
}
