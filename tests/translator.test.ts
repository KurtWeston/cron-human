import { cronToHuman, humanToCron } from '../src/translator';

describe('Translator', () => {
  describe('cronToHuman', () => {
    it('should translate simple time', () => {
      const result = cronToHuman('0 9 * * *');
      expect(result).toContain('9:00 AM');
    });

    it('should translate weekday range', () => {
      const result = cronToHuman('0 9 * * 1-5');
      expect(result).toContain('Monday through Friday');
    });

    it('should translate every minute', () => {
      const result = cronToHuman('* * * * *');
      expect(result).toBe('Every minute');
    });

    it('should translate specific days', () => {
      const result = cronToHuman('0 0 1 * *');
      expect(result).toContain('day 1');
    });
  });

  describe('humanToCron', () => {
    it('should generate from "every day"', () => {
      const result = humanToCron('every day');
      expect(result).toBe('0 0 * * *');
    });

    it('should generate from "every weekday"', () => {
      const result = humanToCron('every weekday');
      expect(result).toBe('0 9 * * 1-5');
    });

    it('should parse time with AM/PM', () => {
      const result = humanToCron('9am');
      expect(result).toBe('0 9 * * *');
    });

    it('should handle 12-hour format', () => {
      const result = humanToCron('3:30 pm');
      expect(result).toBe('30 15 * * *');
    });
  });
});
