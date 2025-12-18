import { ParsedCron, MONTH_NAMES, DAY_NAMES } from './types';
import { parseCronExpression } from './parser';

export function cronToHuman(expression: string): string {
  const parsed = parseCronExpression(expression);
  const parts: string[] = [];

  const timeStr = buildTimeString(parsed);
  if (timeStr) parts.push(timeStr);

  const dayStr = buildDayString(parsed);
  if (dayStr) parts.push(dayStr);

  const monthStr = buildMonthString(parsed);
  if (monthStr) parts.push(monthStr);

  return parts.length > 0 ? parts.join(', ') : 'Every minute';
}

function buildTimeString(parsed: ParsedCron): string {
  const { hour, minute } = parsed;
  
  if (hour.type === 'wildcard' && minute.type === 'wildcard') {
    return 'Every minute';
  }

  if (hour.type === 'wildcard') {
    if (minute.values.length === 1) {
      return `At ${minute.values[0]} minutes past the hour`;
    }
    return `At minutes ${formatList(minute.values)}`;
  }

  if (hour.values.length === 1 && minute.values.length === 1) {
    return `At ${formatTime(hour.values[0], minute.values[0])}`;
  }

  if (minute.values.length === 1 && minute.values[0] === 0) {
    return `At ${formatHours(hour.values)}`;
  }

  return `At ${formatHours(hour.values)}:${formatMinutes(minute.values)}`;
}

function buildDayString(parsed: ParsedCron): string {
  const { day, weekday } = parsed;

  if (weekday.type !== 'wildcard') {
    const days = weekday.values.map(d => DAY_NAMES[d === 7 ? 0 : d]);
    if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) {
      return 'Monday through Friday';
    }
    return days.length === 1 ? `on ${days[0]}` : `on ${formatList(days)}`;
  }

  if (day.type !== 'wildcard') {
    return day.values.length === 1 
      ? `on day ${day.values[0]}` 
      : `on days ${formatList(day.values)}`;
  }

  return '';
}

function buildMonthString(parsed: ParsedCron): string {
  const { month } = parsed;
  if (month.type === 'wildcard') return '';
  
  const months = month.values.map(m => MONTH_NAMES[m - 1]);
  return months.length === 1 ? `in ${months[0]}` : `in ${formatList(months)}`;
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${period}`;
}

function formatHours(hours: number[]): string {
  return hours.map(h => {
    const period = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12} ${period}`;
  }).join(', ');
}

function formatMinutes(minutes: number[]): string {
  return minutes.map(m => m.toString().padStart(2, '0')).join(',');
}

function formatList(items: (string | number)[]): string {
  if (items.length === 1) return items[0].toString();
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function humanToCron(text: string): string {
  const lower = text.toLowerCase().trim();

  if (lower.includes('every minute')) return '* * * * *';
  if (lower.includes('every hour')) return '0 * * * *';
  if (lower.includes('every day') || lower.includes('daily')) return '0 0 * * *';
  if (lower.includes('every week') || lower.includes('weekly')) return '0 0 * * 0';
  if (lower.includes('every month') || lower.includes('monthly')) return '0 0 1 * *';

  const weekdayMatch = lower.match(/every (weekday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  if (weekdayMatch) {
    const day = weekdayMatch[1];
    if (day === 'weekday') return '0 9 * * 1-5';
    const dayNum = DAY_NAMES.findIndex(d => d.toLowerCase() === day);
    return `0 9 * * ${dayNum}`;
  }

  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))? ?(am|pm)?/);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3];

    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;

    return `${minute} ${hour} * * *`;
  }

  throw new Error('Could not parse natural language input');
}
