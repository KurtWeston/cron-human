import { Cron } from 'croner';
import { ExecutionTime } from './types';
import { log } from '@onamfc/developer-log';

export function getNextExecutions(expression: string, count: number = 5): ExecutionTime[] {
  try {
    const job = Cron(expression, { paused: true });
    const executions: ExecutionTime[] = [];
    
    let nextDate = job.nextRun();
    for (let i = 0; i < count && nextDate; i++) {
      executions.push({
        date: new Date(nextDate),
        formatted: formatExecutionTime(new Date(nextDate))
      });
      nextDate = job.nextRun(nextDate);
    }

    job.stop();
    return executions;
  } catch (error) {
    log.error('Failed to calculate execution times', error);
    throw new Error('Invalid cron expression for scheduling');
  }
}

function formatExecutionTime(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${dayName}, ${month} ${day}, ${year} at ${hour12}:${minutes}:${seconds} ${period}`;
}

export function getNextExecution(expression: string): ExecutionTime | null {
  const executions = getNextExecutions(expression, 1);
  return executions.length > 0 ? executions[0] : null;
}
