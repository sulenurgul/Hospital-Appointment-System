# Hastane Randevu Sistemi

Angular ve Express.js ile geliştirilmiş, hasta/doktor/departman/randevu yönetimi yapılabilen bir hastane randevu sistemi.

## Canlı Demo

- **Uygulama:** https://hospitalapointmentsystem.netlify.app
- **Backend API:** https://hastane-mock-api.onrender.com/api

> Not: Backend Render'ın ücretsiz planında barındırılıyor, uzun süre kullanılmazsa uyku moduna geçiyor. İlk istek 30-50 saniye sürebilir, bu normal.

## Kullanılan Teknolojiler

**Frontend**

- Angular v22 (standalone components, signals, `@defer`, resolvers, functional guard/interceptor)
- PrimeNG v22 (Aura tema) + PrimeFlex
- Reactive Forms
- RxJS

**Backend**

- Express.js
- connect-api-mocker (mock REST API)

## Özellikler

- Kullanıcı girişi ve rol tabanlı yetkilendirme (guard + interceptor)
- Hasta yönetimi (listeleme, ekleme, düzenleme)
- Doktor yönetimi
- Departman yönetimi
- Randevu yönetimi (oluşturma, düzenleme, durum güncelleme)
- Responsive arayüz (PrimeFlex)

## Proje Yapısı

Bu repo Angular frontend'ini içerir. Mock API backend'i ayrı bir repoda:
https://github.com/sulenurgul/hastane-mock-api

## Lokal Kurulum

### Backend

```bash
git clone https://github.com/sulenurgul/hastane-mock-api.git
cd hastane-mock-api
npm install
npm start
```

Backend `http://localhost:3001` adresinde çalışır.

### Frontend

```bash
git clone https://github.com/sulenurgul/Hospital-Appointment-System
cd hastane
npm install
ng serve
```

Uygulama `http://localhost:4200` adresinde açılır.
