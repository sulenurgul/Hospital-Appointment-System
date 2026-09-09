const API_BASE_URL = 'http://localhost:3000/api';

// kimlik doğrulama endpoint
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`
};

// hasta endpoint
export const PATIENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/patients`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/patients/${id}`,
  CREATE: `${API_BASE_URL}/patients`,
  UPDATE: (id: string) => `${API_BASE_URL}/patients/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/patients/${id}`
};

// doktor endpoint
export const DOCTOR_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/doctors`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/doctors/${id}`,
  GET_BY_DEPARTMENT: (deptId: string) => `${API_BASE_URL}/doctors/department/${deptId}`,
  CREATE: `${API_BASE_URL}/doctors`,
  UPDATE: (id: string) => `${API_BASE_URL}/doctors/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/doctors/${id}`
};

// departman endpoint
export const DEPARTMENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/departments`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/departments/${id}`,
  CREATE: `${API_BASE_URL}/departments`,
  UPDATE: (id: string) => `${API_BASE_URL}/departments/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/departments/${id}`
};

// randevu endpoint
export const APPOINTMENT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/appointments`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/appointments/${id}`,
  GET_BY_PATIENT: (patientId: string) => `${API_BASE_URL}/appointments/patient/${patientId}`,
  GET_BY_DOCTOR: (doctorId: string) => `${API_BASE_URL}/appointments/doctor/${doctorId}`,
  CREATE: `${API_BASE_URL}/appointments`,
  UPDATE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/appointments/${id}`
};