import { User } from '@shared/models/user.model';
import { USER_ROLES } from '@core/constants/app.constants';


export function isDoctor(user: User | null): boolean {
  return user?.role === USER_ROLES.DOCTOR;
}


export function isNurse(user: User | null): boolean {
  return user?.role === USER_ROLES.NURSE;
}


export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}


export function formatDateTurkish(date: Date | string | null | undefined): string {
  if (!date) {
    return '';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}.${month}.${year}`;
  } catch {
    return '';
  }
}


export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}



export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}



export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}



export function removeDuplicates<T>(array: T[], key?: (item: T) => any): T[] {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const k = key(item);
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  });
}



export function booleanToTurkish(value: boolean): string {
  return value ? 'Evet' : 'Hayır';
}



export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}



export function coalesce<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}



export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



export function highlightText(text: string, search: string): string {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
}