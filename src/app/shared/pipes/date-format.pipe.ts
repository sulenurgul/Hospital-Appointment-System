import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    
    if (!value) {
      return '';
    }

    try {
      
      const date = typeof value === 'string' ? new Date(value) : value;

      
      if (isNaN(date.getTime())) {
        return '';
      }

      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error('DateFormatPipe error:', error);
      return '';
    }
  }
}