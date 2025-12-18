import { cronToHuman, humanToCron } from '../translator';

describe('cronToHuman', () => {
  it('should convert simple time expression', () => {
    const result = cronToHuman('0 9 * * *');
    expect(result).toContain('9:00 AM');
  });

  it('should convert weekday expression', () => {
    const result = cronToHuman('0 9 * * 1-5');
    expect(result).toContain('9:00 AM');
    expect(result).toContain('Monday through Friday');
  });

  it('should convert every minute', () => {
    const result = cronToHuman('* * * * *');
    expect(result).toBe('Every minute');
  });

  it('should convert specific days', () => {
    const result = cronToHuman('0 9 * * 1,3,5');
    expect(result).toContain('Mon');
    expect(result).toContain('Wed');
    expect(result).toContain('Fri');
  });

  it('should convert monthly expression', () => {
    const result = cronToHuman('0 0 1 * *');
    expect(result).toContain('day 1');
  });

  it('should convert with month specification', () => {
    const result = cronToHuman('0 9 * 1,6,12 *');
    expect(result).toContain('Jan');
    expect(result).toContain('Jun');
    expect(result).toContain('Dec');
  });
});

describe('humanToCron', () => {
  it('should convert "every weekday at 9am"', () => {
    const result = humanToCron('every weekday at 9am');
    expect(result).toBe('0 9 * * 1-5');
  });

  it('should convert "every day at midnight"', () => {
    const result = humanToCron('every day at midnight');
    expect(result).toBe('0 0 * * *');
  });

  it('should convert "every hour"', () => {
    const result = humanToCron('every hour');
    expect(result).toBe('0 * * * *');
  });

  it('should convert "every 15 minutes"', () => {
    const result = humanToCron('every 15 minutes');
    expect(result).toBe('*/15 * * * *');
  });

  it('should convert "every monday at 9am"', () => {
    const result = humanToCron('every monday at 9am');
    expect(result).toBe('0 9 * * 1');
  });

  it('should throw error for unrecognized pattern', () => {
    expect(() => humanToCron('invalid pattern xyz')).toThrow('Could not parse');
  });
});
