import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '@core/services/auth.service';
import { MENU_ITEMS } from '@core/constants/app.constants';
import { MenuItem } from 'primeng/api';
import type { UserRole } from '@shared/models/user.model';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonComponent],
  template: `
    <aside
      class="sidebar flex align-items-center md:align-items-stretch md:flex-column w-full md:w-18rem h-auto md:h-screen"
    >
      <div class="sidebar-header hidden md:block">
        <h2>Hastane Sistemi</h2>
      </div>

      <nav class="sidebar-nav flex-1 overflow-y-auto">
        <p-menu [model]="menuItems()" [styleClass]="'sidebar-menu'" />
      </nav>

      <div class="sidebar-footer">
        <app-button
          label="Çıkış Yap"
          icon="pi pi-sign-out"
          severity="danger"
          [fullWidth]="true"
          (onClick)="logout()"
        />
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
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
