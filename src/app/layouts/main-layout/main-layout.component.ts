import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/layouts/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout-container flex flex-column md:flex-row h-screen overflow-hidden layout-bg">
      <app-sidebar></app-sidebar>

      <div class="flex flex-column flex-1 overflow-hidden">
        <app-header></app-header>

        <main class="layout-main flex-1 overflow-y-auto p-3 md:p-5">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .layout-bg {
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class MainLayoutComponent {}
