import { parseCronExpression, validateCron } from '../parser';
import { SPECIAL_STRINGS } from '../types';

describe('parseCronExpression', () => {
  it('should parse standard 5-field cron expression', () => {
    const result = parseCronExpression('0 9 * * 1-5');
    expect(result.fields).toBe(5);
    expect(result.minute.values).toEqual([0]);
    expect(result.hour.values).toEqual([9]);
    expect(result.weekday.values).toEqual([1, 2, 3, 4, 5]);
  });

  it('should parse 6-field cron with seconds', () => {
    const result = parseCronExpression('30 0 9 * * 1-5');
    expect(result.fields).toBe(6);
    expect(result.second?.values).toEqual([30]);
    expect(result.minute.values).toEqual([0]);
  });

  it('should handle special strings', () => {
    const result = parseCronExpression('@daily');
    expect(result.hour.values).toEqual([0]);
    expect(result.minute.values).toEqual([0]);
  });

  it('should parse wildcard fields', () => {
    const result = parseCronExpression('* * * * *');
    expect(result.minute.type).toBe('wildcard');
    expect(result.minute.values.length).toBe(60);
  });

  it('should parse step values', () => {
    const result = parseCronExpression('*/15 * * * *');
    expect(result.minute.type).toBe('step');
    expect(result.minute.values).toContain(0);
    expect(result.minute.values).toContain(15);
    expect(result.minute.values).toContain(30);
  });

  it('should parse list values', () => {
    const result = parseCronExpression('0,15,30,45 * * * *');
    expect(result.minute.type).toBe('list');
    expect(result.minute.values).toEqual([0, 15, 30, 45]);
  });

  it('should parse range values', () => {
    const result = parseCronExpression('0 9-17 * * *');
    expect(result.hour.type).toBe('range');
    expect(result.hour.values).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
  });

  it('should throw error for invalid field count', () => {
    expect(() => parseCronExpression('0 9 *')).toThrow('expected 5 or 6 fields');
  });

  it('should throw error for invalid value', () => {
    expect(() => parseCronExpression('60 * * * *')).toThrow('Invalid value');
  });

  it('should throw error for invalid range', () => {
    expect(() => parseCronExpression('0 25-30 * * *')).toThrow('Invalid range');
  });
});

describe('validateCron', () => {
  it('should return valid for correct expression', () => {
    const result = validateCron('0 9 * * 1-5');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid with error message', () => {
    const result = validateCron('invalid cron');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should validate special strings', () => {
    const result = validateCron('@hourly');
    expect(result.valid).toBe(true);
  });
});
