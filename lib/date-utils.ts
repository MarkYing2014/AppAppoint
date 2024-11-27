import { format as dateFnsFormat, parseISO } from 'date-fns';

export function toUTCDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function fromUTCDate(date: Date): string {
  return dateFnsFormat(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(d, 'MMMM d, yyyy');
}

export function formatDisplayTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return dateFnsFormat(date, 'h:mm a');
}

export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
