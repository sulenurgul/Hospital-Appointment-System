import type { UserRole } from '@shared/models/user.model';

export const USER_ROLES = {
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
} as const;

export const USER_ROLES_LABELS = {
  Doctor: 'Doktor',
  Nurse: 'Hemşire',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  Scheduled: 'Planlandı',
  Completed: 'Tamamlandı',
  Cancelled: 'İptal Edildi',
  'No-show': 'Gelmedi',
} as const;

export const GENDER_OPTIONS = [
  { label: 'Erkek', value: 'Male' },
  { label: 'Kadın', value: 'Female' },
  { label: 'Diğer', value: 'Other' },
];

export const APPOINTMENT_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export const STORAGE_KEYS = {
  TOKEN: 'hospital_token',
  USER: 'hospital_user',
  ROLE: 'hospital_role',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 25, 50],
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Başarıyla oluşturuldu',
    UPDATE: 'Başarıyla güncellendi',
    DELETE: 'Başarıyla silindi',
    LOGIN: 'Giriş başarılı',
  },

  ERROR: {
    UNAUTHORIZED: 'Yetkisiz erişim. Lütfen giriş yapınız.',
    FORBIDDEN: 'Bu işlem için yetkiniz yoktur.',
    NOT_FOUND: 'İçerik bulunamadı.',
    SERVER_ERROR: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.',
    NETWORK_ERROR: 'Ağ hatası oluştu. İnternet bağlantınızı kontrol ediniz.',
    VALIDATION_ERROR: 'Lütfen tüm alanları doğru şekilde doldurunuz.',
  },

  WARNING: {
    CONFIRM_DELETE: 'Bu işlemi onaylıyor musunuz?',
    UNSAVED_CHANGES: 'Kaydedilmemiş değişiklikleriniz var.',
  },

  INFO: {
    LOADING: 'Yükleniyor...',
    NO_DATA: 'Veri bulunamadı.',
  },
} as const;

// form validasyon mesajları

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Bu alan zorunludur.',
  EMAIL_INVALID: 'Geçerli bir e-posta adresi giriniz.',
  PHONE_INVALID: 'Geçerli bir telefon numarası giriniz.',
  MIN_LENGTH: (min: number) => `En az ${min} karakter giriniz.`,
  MAX_LENGTH: (max: number) => `En fazla ${max} karakter giriniz.`,
  PATTERN: 'Geçersiz format.',
  DATE_INVALID: 'Geçerli bir tarih giriniz.',
  IDENTITY_NUMBER_INVALID: 'TC kimlik numarası 11 haneli olmalıdır.',
} as const;

export const MENU_ITEMS = {
  DASHBOARD: { label: 'Pano', icon: 'pi pi-home', roles: ['Doctor', 'Nurse'] },
  PATIENTS: { label: 'Hastalar', icon: 'pi pi-users', roles: ['Doctor'] },
  DOCTORS: { label: 'Doktorlar', icon: 'pi pi-user-md', roles: ['Doctor'] },
  DEPARTMENTS: { label: 'Birimler', icon: 'pi pi-building', roles: ['Doctor'] },
  APPOINTMENTS: { label: 'Randevular', icon: 'pi pi-calendar', roles: ['Doctor', 'Nurse'] },
} as const satisfies Record<
  'DASHBOARD' | 'PATIENTS' | 'DOCTORS' | 'DEPARTMENTS' | 'APPOINTMENTS',
  { label: string; icon: string; roles: readonly UserRole[] }
>;
