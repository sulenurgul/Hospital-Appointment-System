import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Doktor listesi sayfası</p>`,
  styles: [],
})
export class DoctorListComponent {}
