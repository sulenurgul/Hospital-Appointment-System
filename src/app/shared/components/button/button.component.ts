import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


type ButtonSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
type ButtonSize = 'small' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      [type]="type()"
      [label]="label()"
      [icon]="icon()"
      [severity]="severity()"
      [size]="size()"
      [loading]="loading()"
      [disabled]="disabled() || loading()"
      [class.w-full]="fullWidth()"
      (onClick)="onClick.emit()"
    />
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    :host(.w-full) {
      width: 100%;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class ButtonComponent {
  
  label = input('');
  icon = input('');
  severity = input<ButtonSeverity>('info');
  disabled = input(false);
  loading = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  size = input<ButtonSize>();
  fullWidth = input(false);


  onClick = output<void>();
}