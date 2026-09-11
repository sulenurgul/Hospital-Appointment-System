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
    <button
      pButton
      [type]="type()"
      [severity]="severity()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class.w-full]="fullWidth()"
      (click)="onClick.emit()"
    >
      @if (loading()) {
        <i class="pi pi-spin pi-spinner"></i>
      } @else if (icon()) {
        <i [class]="icon()"></i>
      }
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .w-full {
        width: 100%;
      }
    `,
  ],
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
