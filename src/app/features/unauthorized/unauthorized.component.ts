import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-card">
        <i class="pi pi-lock"></i>
        <h1>Yetkisiz Erişim</h1>
        <p>Bu sayfayı görüntülemek için yetkiniz bulunmuyor.</p>
        <app-button
          label="Dashboard'a Dön"
          icon="pi pi-home"
          severity="info"
          (onClick)="goHome()"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .unauthorized-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f5f5f5;
        padding: 1rem;
      }

      .unauthorized-card {
        background: white;
        border-radius: 12px;
        padding: 2.5rem;
        text-align: center;
        max-width: 380px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .unauthorized-card i {
        font-size: 2.5rem;
        color: #e24c4c;
      }

      .unauthorized-card h1 {
        margin: 0;
        font-size: 1.3rem;
        color: #333;
      }

      .unauthorized-card p {
        margin: 0;
        color: #666;
      }
    `,
  ],
})
export class UnauthorizedComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
