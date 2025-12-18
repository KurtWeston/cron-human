import { CronField, ParsedCron, ValidationResult, SPECIAL_STRINGS } from './types';
import { log } from '@onamfc/developer-log';

const FIELD_RANGES: Record<string, [number, number]> = {
  second: [0, 59],
  minute: [0, 59],
  hour: [0, 23],
  day: [1, 31],
  month: [1, 12],
  weekday: [0, 7]
};

export function parseCronExpression(expression: string): ParsedCron {
  let normalized = expression.trim();
  
  if (normalized in SPECIAL_STRINGS) {
    normalized = SPECIAL_STRINGS[normalized];
  }

  const parts = normalized.split(/\s+/);
  
  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error(`Invalid cron expression: expected 5 or 6 fields, got ${parts.length}`);
  }

  const hasSeconds = parts.length === 6;
  const fieldNames = hasSeconds 
    ? ['second', 'minute', 'hour', 'day', 'month', 'weekday']
    : ['minute', 'hour', 'day', 'month', 'weekday'];

  const parsed: Partial<ParsedCron> = {
    original: expression,
    fields: parts.length
  };

  parts.forEach((part, index) => {
    const fieldName = fieldNames[index] as keyof ParsedCron;
    parsed[fieldName] = parseField(part, fieldName as string);
  });

  return parsed as ParsedCron;
}

function parseField(value: string, fieldName: string): CronField {
  const [min, max] = FIELD_RANGES[fieldName];
  
  if (value === '*') {
    return { raw: value, values: range(min, max), type: 'wildcard' };
  }

  if (value.includes('/')) {
    const [rangeOrWildcard, step] = value.split('/');
    const stepNum = parseInt(step, 10);
    const baseValues = rangeOrWildcard === '*' 
      ? range(min, max)
      : parseRange(rangeOrWildcard, min, max);
    return { raw: value, values: baseValues.filter((_, i) => i % stepNum === 0), type: 'step' };
  }

  if (value.includes(',')) {
    const values = value.split(',').flatMap(v => parseRange(v, min, max));
    return { raw: value, values: [...new Set(values)].sort((a, b) => a - b), type: 'list' };
  }

  if (value.includes('-')) {
    return { raw: value, values: parseRange(value, min, max), type: 'range' };
  }

  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid value ${value} for field ${fieldName}`);
  }
  return { raw: value, values: [num], type: 'specific' };
}

function parseRange(rangeStr: string, min: number, max: number): number[] {
  const [start, end] = rangeStr.split('-').map(v => parseInt(v, 10));
  if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
    throw new Error(`Invalid range: ${rangeStr}`);
  }
  return range(start, end);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function validateCron(expression: string): ValidationResult {
  try {
    parseCronExpression(expression);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
