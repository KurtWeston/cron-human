import { getNextExecutions, getNextExecution } from '../scheduler';

describe('getNextExecutions', () => {
  it('should return next 5 execution times by default', () => {
    const executions = getNextExecutions('0 9 * * *');
    expect(executions).toHaveLength(5);
    expect(executions[0]).toHaveProperty('date');
    expect(executions[0]).toHaveProperty('formatted');
  });

  it('should return custom count of executions', () => {
    const executions = getNextExecutions('0 * * * *', 3);
    expect(executions).toHaveLength(3);
  });

  it('should format execution times correctly', () => {
    const executions = getNextExecutions('0 9 * * 1');
    expect(executions[0].formatted).toMatch(/Monday/);
    expect(executions[0].formatted).toMatch(/9:00:00 AM/);
  });

  it('should handle every minute expression', () => {
    const executions = getNextExecutions('* * * * *', 2);
    expect(executions).toHaveLength(2);
    const diff = executions[1].date.getTime() - executions[0].date.getTime();
    expect(diff).toBe(60000);
  });

  it('should throw error for invalid expression', () => {
    expect(() => getNextExecutions('invalid')).toThrow('Invalid cron expression');
  });
});

describe('getNextExecution', () => {
  it('should return single next execution', () => {
    const execution = getNextExecution('0 9 * * *');
    expect(execution).not.toBeNull();
    expect(execution?.date).toBeInstanceOf(Date);
  });

  it('should return null for invalid expression', () => {
    expect(() => getNextExecution('999 999 * * *')).toThrow();
  });
});
