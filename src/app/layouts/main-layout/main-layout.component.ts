
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/layouts/header/header.component';


@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  template: `
    <div class="layout-container">
      <app-sidebar></app-sidebar>

      <div class="layout-content">
        <app-header></app-header>

        <main class="layout-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .layout-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .layout-main {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

   
    @media (max-width: 768px) {
      .layout-container {
        flex-direction: column;
      }

      .layout-main {
        padding: 1rem;
      }
    }
  `]
})
export class MainLayoutComponent {}