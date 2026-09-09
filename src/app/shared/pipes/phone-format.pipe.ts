import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    
    if (!value) {
      return '';
    }

    
    const digits = value.replace(/\D/g, '');

  
    if (digits.length < 10) {
      return value;
    }

    
    let phoneNumber = digits.startsWith('0') ? digits.slice(1) : digits;

  
    if (phoneNumber.length < 10) {
      return value;
    }

  
    return `+90 ${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
  }
}