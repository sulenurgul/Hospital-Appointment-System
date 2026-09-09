export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  departmentId: string;
  licenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  departmentId: string;
  licenseNumber: string;
}