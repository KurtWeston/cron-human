export interface CronField {
  raw: string;
  values: number[];
  type: 'wildcard' | 'specific' | 'range' | 'step' | 'list';
}

export interface ParsedCron {
  second?: CronField;
  minute: CronField;
  hour: CronField;
  day: CronField;
  month: CronField;
  weekday: CronField;
  original: string;
  fields: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  field?: string;
}

export interface ExecutionTime {
  date: Date;
  formatted: string;
}

export const SPECIAL_STRINGS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *'
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
