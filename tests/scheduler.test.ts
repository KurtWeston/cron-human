import { getNextExecutions, getNextExecution } from '../src/scheduler';

describe('Scheduler', () => {
  describe('getNextExecutions', () => {
    it('should return requested number of executions', () => {
      const executions = getNextExecutions('0 9 * * *', 3);
      expect(executions).toHaveLength(3);
    });

    it('should return future dates', () => {
      const executions = getNextExecutions('* * * * *', 2);
      const now = new Date();
      executions.forEach(exec => {
        expect(exec.date.getTime()).toBeGreaterThan(now.getTime());
      });
    });

    it('should format dates correctly', () => {
      const executions = getNextExecutions('0 9 * * 1', 1);
      expect(executions[0].formatted).toMatch(/Monday/);
      expect(executions[0].formatted).toMatch(/9:00:00 AM/);
    });
  });

  describe('getNextExecution', () => {
    it('should return single next execution', () => {
      const execution = getNextExecution('0 0 * * *');
      expect(execution).not.toBeNull();
      expect(execution?.date).toBeInstanceOf(Date);
    });
  });
});
