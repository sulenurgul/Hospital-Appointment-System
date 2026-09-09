import { Pipe, PipeTransform } from '@angular/core';
import { APPOINTMENT_STATUS_LABELS } from '@core/constants/app.constants';


@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
   
    if (!value) {
      return '';
    }


    const turkishLabel = APPOINTMENT_STATUS_LABELS[value as keyof typeof APPOINTMENT_STATUS_LABELS];

    return turkishLabel || value;
  }
}