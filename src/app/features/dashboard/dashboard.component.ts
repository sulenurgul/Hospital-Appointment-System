import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';
import { PatientService } from '@core/services/patient.service';
import { DoctorService } from '@core/services/doctor.service';
import { DepartmentService } from '@core/services/department.service';
import { AppointmentService } from '@core/services/appointment.service';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { StatusPipe } from '@shared/pipes/status.pipe';

type ResourceState = 'loading' | 'error' | 'empty' | 'success';

interface CountResource {
  isLoading(): boolean;
  error(): unknown;
  value(): { total: number } | undefined;
  reload(): boolean;
}

interface StatCard {
  label: string;
  icon: string;
  color: string;
  state: ResourceState;
  value: number;
  resource: CountResource;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, StatusPipe],
  template: `
    <div class="dashboard">
      <header class="welcome">
        <h1>{{ greeting() }}, {{ currentUser()?.firstName }}</h1>
        <p>{{ roleLabel() }} olarak giriş yaptınız.</p>
      </header>

      <section class="stats-grid">
        @for (card of statCards(); track card.label) {
          <div class="stat-card" [style.--accent]="card.color">
            <i class="pi" [class]="card.icon"></i>
            <div class="stat-body">
              <div class="stat-label">{{ card.label }}</div>

              @switch (card.state) {
                @case ('loading') {
                  <div class="stat-value skeleton">&nbsp;</div>
                }
                @case ('error') {
                  <div class="stat-value error-text">
                    Yüklenemedi
                    <button type="button" class="retry-btn" (click)="card.resource.reload()">
                      Tekrar dene
                    </button>
                  </div>
                }
                @case ('empty') {
                  <div class="stat-value empty-text">Kayıt yok</div>
                }
                @default {
                  <div class="stat-value">{{ card.value }}</div>
                }
              }
            </div>
          </div>
        }
      </section>

      @defer (on viewport) {
        <section class="upcoming">
          <div class="upcoming-header">
            <h2>Yaklaşan Randevular</h2>
            <a routerLink="/appointments">Tümünü gör →</a>
          </div>

          @if (upcomingAppointments.isLoading()) {
            <p class="upcoming-info">Yükleniyor...</p>
          } @else if (upcomingAppointments.error()) {
            <p class="upcoming-info error-text">
              Randevular yüklenemedi.
              <button type="button" class="retry-btn" (click)="upcomingAppointments.reload()">
                Tekrar dene
              </button>
            </p>
          } @else if (!upcomingAppointments.value()?.data?.length) {
            <p class="upcoming-info">Kayıtlı randevu bulunamadı.</p>
          } @else {
            <ul class="appointment-list">
              @for (appt of upcomingAppointments.value()!.data; track appt.id) {
                <li>
                  <span class="appt-date">
                    {{ appt.appointmentDate | dateFormat }} · {{ appt.appointmentTime }}
                  </span>
                  <span class="appt-patient">
                    {{ appt.patient?.firstName ?? 'Hasta #' + appt.patientId }}
                    {{ appt.patient?.lastName }}
                  </span>
                  <span class="appt-status" [attr.data-status]="appt.status">
                    {{ appt.status | status }}
                  </span>
                </li>
              }
            </ul>
          }
        </section>
      } @placeholder {
        <div class="defer-placeholder">Yaklaşan randevular</div>
      } @loading (minimum 200ms) {
        <div class="defer-placeholder">Yükleniyor...</div>
      }
    </div>
  `,
  styles: [
    `
      .dashboard {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .welcome h1 {
        margin: 0 0 0.25rem;
        font-size: 1.6rem;
        color: #333;
      }

      .welcome p {
        margin: 0;
        color: #666;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .stat-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: white;
        border-radius: 10px;
        padding: 1.25rem;
        border-left: 4px solid var(--accent, #667eea);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }

      .stat-card i {
        font-size: 1.75rem;
        color: var(--accent, #667eea);
      }

      .stat-label {
        color: #666;
        font-size: 0.85rem;
      }

      .stat-value {
        font-size: 1.6rem;
        font-weight: 700;
        color: #333;
      }

      .stat-value.skeleton {
        width: 3rem;
        height: 1.4rem;
        border-radius: 4px;
        background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
      }

      .stat-value.error-text,
      .upcoming-info.error-text {
        color: #e24c4c;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .stat-value.empty-text {
        color: #999;
        font-size: 1rem;
        font-weight: 500;
      }

      .retry-btn {
        border: none;
        background: none;
        color: #667eea;
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.85rem;
        padding: 0;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .upcoming {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }

      .upcoming-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .upcoming-header h2 {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
      }

      .upcoming-header a {
        font-size: 0.85rem;
        color: #667eea;
        text-decoration: none;
      }

      .upcoming-info {
        color: #666;
      }

      .appointment-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .appointment-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        background: #f8f9fb;
        flex-wrap: wrap;
      }

      .appt-date {
        color: #666;
        font-size: 0.85rem;
        min-width: 140px;
      }

      .appt-patient {
        font-weight: 600;
        color: #333;
        flex: 1;
      }

      .appt-status {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        background: #eee;
        color: #555;
      }

      .appt-status[data-status='Scheduled'] {
        background: #e3f2fd;
        color: #1565c0;
      }

      .appt-status[data-status='Completed'] {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .appt-status[data-status='Cancelled'] {
        background: #ffebee;
        color: #c62828;
      }

      .appt-status[data-status='No-show'] {
        background: #fff3e0;
        color: #ef6c00;
      }

      .defer-placeholder {
        color: #999;
        padding: 1.5rem;
        text-align: center;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .appt-date {
          min-width: 0;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private departmentService = inject(DepartmentService);
  private appointmentService = inject(AppointmentService);

  currentUser = this.authService.currentUser;
  userRole = this.authService.userRole;

  isDoctor = computed(() => this.userRole() === 'Doctor');

  roleLabel = computed(() => (this.isDoctor() ? 'Doktor' : 'Hemşire'));

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  });

  constructor() {
    effect(() => {
      const user = this.currentUser();
      document.title = user ? `Dashboard · ${user.firstName} ${user.lastName}` : 'Dashboard';
    });
  }

  private patientsRes = rxResource({
    params: () => (this.isDoctor() ? {} : undefined),
    stream: () => this.patientService.getAll(1, 1),
  });

  private doctorsRes = rxResource({
    params: () => (this.isDoctor() ? {} : undefined),
    stream: () => this.doctorService.getAll(1, 1),
  });

  private departmentsRes = rxResource({
    params: () => (this.isDoctor() ? {} : undefined),
    stream: () => this.departmentService.getAll(1, 1),
  });

  private appointmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.appointmentService.getAll(1, 1),
  });

  upcomingAppointments = rxResource({
    params: () => ({}),
    stream: () => this.appointmentService.getAll(1, 5),
  });

  statCards = computed<StatCard[]>(() => {
    const cards: StatCard[] = [];

    if (this.isDoctor()) {
      cards.push(this.toStatCard('Hasta', 'pi-users', '#667eea', this.patientsRes));
      cards.push(this.toStatCard('Doktor', 'pi-user-md', '#43a047', this.doctorsRes));
      cards.push(this.toStatCard('Birim', 'pi-building', '#fb8c00', this.departmentsRes));
    }

    cards.push(this.toStatCard('Randevu', 'pi-calendar', '#e53935', this.appointmentsRes));

    return cards;
  });

  private toStatCard(
    label: string,
    icon: string,
    color: string,
    resource: CountResource,
  ): StatCard {
    let state: ResourceState;
    let value = 0;

    if (resource.isLoading()) {
      state = 'loading';
    } else if (resource.error()) {
      state = 'error';
    } else {
      value = resource.value()?.total ?? 0;
      state = value === 0 ? 'empty' : 'success';
    }

    return { label, icon, color, state, value, resource };
  }
}
