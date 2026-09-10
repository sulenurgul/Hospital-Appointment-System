import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AuthService } from '@core/services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, MenuModule, AvatarModule, AvatarGroupModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h1>Hoşgeldiniz</h1>
      </div>

      <div class="header-right">
        <div class="user-info">
          <p-avatar
            [label]="userInitials()"
            shape="circle"
            size="large"
            styleClass="user-avatar"
          ></p-avatar>

          <div class="user-details">
            <p class="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
            <p class="user-role">{{ currentUser()?.role }}</p>
          </div>
        </div>

        <p-menu #userMenu [model]="userMenuItems()" [popup]="true" #userMenuButton></p-menu>
        <button
          pButton
          type="button"
          icon="pi pi-chevron-down"
          class="p-button-text user-menu-btn"
          (click)="userMenu.toggle($event)"
          #userMenuButton
        ></button>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .header-left h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-avatar {
        cursor: pointer;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .user-name {
        margin: 0;
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .user-role {
        margin: 0;
        color: #666;
        font-size: 0.85rem;
      }

      .user-menu-btn {
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .header {
          padding: 1rem;
          flex-direction: column;
          gap: 1rem;
        }

        .header-left h1 {
          font-size: 1.2rem;
        }

        .user-details {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  userMenuItems = computed(() => {
    return [
      {
        label: 'Profilim',
        icon: 'pi pi-user',
        command: () => this.viewProfile(),
      },
      {
        label: 'Ayarlar',
        icon: 'pi pi-cog',
        command: () => this.openSettings(),
      },
      {
        separator: true,
      },
      {
        label: 'Çıkış Yap',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ] as MenuItem[];
  });

  viewProfile(): void {
    console.log('Profil sayfasına yönlendir');
  }

  openSettings(): void {
    console.log('Ayarlar sayfasına yönlendir');
  }

  logout(): void {
    this.authService.logout();
  }
}
