import { Patient } from './patient.model';
import { Doctor } from './doctor.model';
import { Department } from './department.model';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: Date;
  appointmentTime: string;
  notes: string;
}
