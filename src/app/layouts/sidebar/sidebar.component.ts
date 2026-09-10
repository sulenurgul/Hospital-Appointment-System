import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@core/services/auth.service';
import { MENU_ITEMS } from '@core/constants/app.constants';
import { MenuItem } from 'primeng/api';
import type { UserRole } from '@shared/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>🏥 Hastane Sistemi</h2>
      </div>

      <nav class="sidebar-nav">
        <p-menu [model]="menuItems()" [styleClass]="'sidebar-menu'" />
      </nav>

      <div class="sidebar-footer">
        <p-button
          label="Çıkış Yap"
          icon="pi pi-sign-out"
          (onClick)="logout()"
          severity="danger"
          [styleClass]="'w-full'"
        ></p-button>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 280px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        flex-direction: column;
        height: 100vh;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      }

      .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
      }

      .sidebar-header h2 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 600;
      }

      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        padding: 1rem 0;
      }

      :host ::ng-deep .sidebar-menu {
        background: transparent;
        border: none;
        color: white;
      }

      :host ::ng-deep .sidebar-menu .p-menuitem-link {
        color: white;
        padding: 0.75rem 1.5rem;
        border-left: 3px solid transparent;
      }

      :host ::ng-deep .sidebar-menu .p-menuitem-link:hover {
        background: rgba(255, 255, 255, 0.1);
        border-left-color: #ffc107;
      }

      :host ::ng-deep .sidebar-menu .p-menuitem.p-highlight > .p-menuitem-link {
        background: rgba(255, 255, 255, 0.2);
        border-left-color: #ffc107;
      }

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      :host ::ng-deep .sidebar-footer .p-button {
        width: 100%;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 100%;
          height: auto;
          flex-direction: row;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0;
        }

        .sidebar-footer {
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  private authService = inject(AuthService);

  menuItems = computed<MenuItem[]>(() => {
    const userRole = this.authService.userRole();
    if (!userRole) {
      return [];
    }

    const allMenus: Array<{
      label: string;
      icon: string;
      routerLink: string[];
      roles: readonly UserRole[];
    }> = [
      {
        label: MENU_ITEMS.DASHBOARD.label,
        icon: MENU_ITEMS.DASHBOARD.icon,
        routerLink: ['/dashboard'],
        roles: MENU_ITEMS.DASHBOARD.roles,
      },
      {
        label: MENU_ITEMS.PATIENTS.label,
        icon: MENU_ITEMS.PATIENTS.icon,
        routerLink: ['/patients'],
        roles: MENU_ITEMS.PATIENTS.roles,
      },
      {
        label: MENU_ITEMS.DOCTORS.label,
        icon: MENU_ITEMS.DOCTORS.icon,
        routerLink: ['/doctors'],
        roles: MENU_ITEMS.DOCTORS.roles,
      },
      {
        label: MENU_ITEMS.DEPARTMENTS.label,
        icon: MENU_ITEMS.DEPARTMENTS.icon,
        routerLink: ['/departments'],
        roles: MENU_ITEMS.DEPARTMENTS.roles,
      },
      {
        label: MENU_ITEMS.APPOINTMENTS.label,
        icon: MENU_ITEMS.APPOINTMENTS.icon,
        routerLink: ['/appointments'],
        roles: MENU_ITEMS.APPOINTMENTS.roles,
      },
    ];

    return allMenus
      .filter((menu) => menu.roles.includes(userRole))
      .map((menu) => ({
        label: menu.label,
        icon: menu.icon,
        routerLink: menu.routerLink,
      }));
  });

  logout(): void {
    this.authService.logout();
  }
}
