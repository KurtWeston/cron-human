import { parseCronExpression, validateCron } from '../src/parser';

describe('Parser', () => {
  describe('parseCronExpression', () => {
    it('should parse basic 5-field cron', () => {
      const result = parseCronExpression('0 9 * * 1-5');
      expect(result.minute.values).toEqual([0]);
      expect(result.hour.values).toEqual([9]);
      expect(result.weekday.values).toEqual([1, 2, 3, 4, 5]);
    });

    it('should parse wildcards', () => {
      const result = parseCronExpression('* * * * *');
      expect(result.minute.type).toBe('wildcard');
      expect(result.hour.type).toBe('wildcard');
    });

    it('should parse step values', () => {
      const result = parseCronExpression('*/15 * * * *');
      expect(result.minute.type).toBe('step');
      expect(result.minute.values).toContain(0);
      expect(result.minute.values).toContain(15);
    });

    it('should parse lists', () => {
      const result = parseCronExpression('0 9,12,15 * * *');
      expect(result.hour.values).toEqual([9, 12, 15]);
    });

    it('should handle special strings', () => {
      const result = parseCronExpression('@daily');
      expect(result.minute.values).toEqual([0]);
      expect(result.hour.values).toEqual([0]);
    });
  });

  describe('validateCron', () => {
    it('should validate correct expressions', () => {
      expect(validateCron('0 9 * * *').valid).toBe(true);
    });

    it('should reject invalid field count', () => {
      expect(validateCron('0 9 *').valid).toBe(false);
    });

    it('should reject out of range values', () => {
      expect(validateCron('0 25 * * *').valid).toBe(false);
    });
  });
});
