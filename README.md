<div align="center">

# 🪡 KORELİ ÇEYİZ & EV TEKSTİLİ

### *Modern, Hızlı ve Zarif E-Ticaret & Katalog Vitrini*

[![Canlı Site](https://img.shields.io/badge/🌐_Canlı_Site-koreliceyiz.com-966842?style=for-the-badge&logo=googlechrome&logoColor=white)](https://koreliceyiz.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://koreliceyiz.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br />

**Koreli Çeyiz**, ev tekstili ve çeyiz ürünlerini şık bir vitrinde sergileyen, dinamik kategori ve ürün yönetimi sunan modern bir full-stack web uygulamasıdır.

🔗 **Canlı Yayında:** [https://koreliceyiz.com](https://koreliceyiz.com) • [https://www.koreliceyiz.com](https://www.koreliceyiz.com)

[Canlı Demo](#-canlı-dağıtım-bilgileri) • [Özellikler](#-öne-çıkan-özellikler) • [Mimari](#-proje-mimarisi) • [Kurulum](#-kurulum-rehberi) • [Ortam-Değişkenleri](#-ortam-değişkenleri-env) • [API](#-api-servisleri)

</div>

---

## 🌐 Canlı Dağıtım Bilgileri

Proje, modern bulut servisleri üzerinde yüksek performanslı ve tam optimize olarak canlıda çalışmaktadır:

| Katman | Servis / Platform | Açıklama & Bağlantı |
| :--- | :--- | :--- |
| **Ana Alan Adı (Domain)** | **Natro DNS + Vercel SSL** | [https://koreliceyiz.com](https://koreliceyiz.com) |
| **Frontend Dağıtımı** | **Vercel** | Next.js 16 App Router & Edge CDN Entegrasyonu |
| **Backend Dağıtımı** | **Render.com** | FastAPI (Python) Web Service |
| **Veritabanı & CDN** | **Supabase** | PostgreSQL Database & Storage Bucket |

---

## 🌟 Öne Çıkan Özellikler

### 🛍️ Ziyaretçi & Müşteri Deneyimi
- **Modern Katalog & Vitrin:** Yüksek çözünürlüklü ürün görselleri, dinamik slider ve kategori bazlı filtreleme.
- **Dinamik WhatsApp Sipariş Entegrasyonu:** Müşteri ürün detayında *"WhatsApp'tan Bilgi Al"* butonuna bastığında, bulunduğu güncel alan adı (`koreliceyiz.com`) ve ürün linki otomatik olarak hazır mesaj taslağına eklenir.
- **Canlı Arama Modalı:** Ürünler arasında anında arama yapabilme ve hızlı detay önizlemesi.
- **Favoriler Sistemi:** Tarayıcı tabanlı (LocalStorage) kalıcı favori listesi yönetimi.
- **Avantajlı & İndirimli Ürünler:** Kampanyalı ürünler için özel vitrin ve etiketleme sistemi.
- **Akıcı Animasyonlar & UI:** **Lenis Smooth Scroll** ile pürüzsüz kaydırma ve tam mobil/tablet responsive tasarım.

### 🔐 Yönetim & Admin Paneli
- **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı korumalı admin girişi.
- **Ürün Yönetimi:** Ürün ekleme, düzenleme, silme, indirim/avantaj durumu belirleme ve kategori atama.
- **Görsel Yükleme & Kırpma:** `react-easy-crop` ile tarayıcıda görseli tam kare formatında kırpıp doğrudan **Supabase Storage** CDN'ine yükleme.
- **Kategori Yönetimi:** Dinamik kategori oluşturma, güncelleme ve ilişkili ürün kontrolüyle silme koruması.
- **Mağaza Ayarları:** İletişim bilgileri, WhatsApp sipariş numarası ve mağaza çalışma detayları yönetimi.

---

## 🏗️ Proje Mimarisi

```text
KORELI CEYIZ/
├── .github/
│   └── workflows/
│       └── supabase_keepalive.yml   # Supabase uyku modunu önleyici GitHub Action cron
├── backend/                         # FastAPI (Python) Servis Katmanı
│   ├── crud.py                      # Veritabanı sorguları ve iş mantığı
│   ├── database.py                  # SQLAlchemy motoru ve session yönetimi
│   ├── keep_alive.py                # Supabase veritabanı canlı tutma scripti
│   ├── main.py                      # API rotaları, CORS ve JWT middleware
│   ├── models.py                    # SQLAlchemy ORM modelleri
│   ├── requirements.txt             # Backend Python bağımlılıkları
│   ├── schemas.py                   # Pydantic veri doğrulama şemaları
│   └── .env.example                 # Örnek backend konfigürasyonu
├── frontend/                        # Next.js 16 (App Router) İstemci Katmanı
│   ├── app/                         # App Router sayfaları (admin, kategoriler, favoriler vb.)
│   ├── components/                  # Yeniden kullanılabilir UI bileşenleri ve modallar
│   │   └── WhatsAppInquiryButton.tsx # Otomatik domain algılayan WhatsApp bileşeni
│   ├── context/                     # Favoriler ve global durum yönetimi
│   ├── utils/                       # Supabase client, config ve yardımcı fonksiyonlar
│   ├── package.json                 # Frontend bağımlılıkları
│   └── .env.example                 # Örnek frontend konfigürasyonu
├── .gitignore                       # Temiz ve güvenli Git filtre kuralları
└── README.md                        # Proje dokümantasyonu
```

---

## 🚀 Yerel Kurulum Rehberi

### Ön Gereksinimler
- [Node.js](https://nodejs.org/) (v18.17 veya üzeri önerilir)
- [Python](https://www.python.org/) (v3.10 veya üzeri)
- [Supabase](https://supabase.com/) Hesabı (PostgreSQL + Storage)

---

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/enesdolgun10/koreli-ceyiz.git
cd koreli-ceyiz
```

---

### 2. Backend (FastAPI) Kurulumu

```bash
# Backend klasörüne geçin
cd backend

# Sanal ortam (venv) oluşturun ve aktif edin
python -m venv venv

# Windows için:
.\venv\Scripts\activate
# macOS/Linux için:
# source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# .env dosyasını oluşturun ve yapılandırın
cp .env.example .env
```

`.env` dosyanızı açıp Supabase veritabanı bağlantınızı ve admin şifrenizi tanımlayın:
```env
DATABASE_URL=postgresql://postgres.xxx:sifreniz@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
ADMIN_PASSWORD=guclu_bir_admin_sifresi
JWT_SECRET=super_secret_jwt_key
ALLOWED_ORIGINS=http://localhost:3000,https://koreliceyiz.com,https://www.koreliceyiz.com
```

Backend sunucusunu başlatın:
```bash
uvicorn main:app --reload --port 8000
```
> Backend API: `http://127.0.0.1:8000` | Swagger Dokümantasyonu: `http://127.0.0.1:8000/docs`

---

### 3. Frontend (Next.js) Kurulumu

Yeni bir terminal penceresi açın:

```bash
# Frontend klasörüne geçin
cd frontend

# Paketleri yükleyin
npm install

# .env.local dosyasını oluşturun
cp .env.example .env.local
```

`.env.local` dosyasını kendi API ve Supabase bilgilerinizle güncelleyin:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Frontend geliştirme sunucusunu başlatın:
```bash
npm run dev
```
> Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## ⚙️ Ortam Değişkenleri (.env)

### Backend (`backend/.env`)
| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | Supabase PostgreSQL bağlantı dizesi (Port: 5432 Direct Connection) |
| `ADMIN_PASSWORD` | Yönetim paneline giriş için kullanılan ana şifre |
| `JWT_SECRET` | Admin oturum tokenlarını imzalamak için kullanılan gizli anahtar |
| `ALLOWED_ORIGINS` | İzin verilen frontend origin listesi (`https://koreliceyiz.com` vb.) |

### Frontend (`frontend/.env.local`)
| Değişken | Açıklama |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | FastAPI Backend sunucusunun adresi (Canlıda Render URL'i) |
| `NEXT_PUBLIC_SITE_URL` | Frontend uygulamasının yayınlandığı ana URL (`https://koreliceyiz.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL adresi |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase istemci tarafı public anon anahtarı |

---

## 📡 API Servisleri

FastAPI backend aşağıdaki RESTful endpoint'leri sağlar:

- `POST /login/` - Admin kimlik doğrulaması ve JWT token üretimi
- `GET /categories/` - Tüm aktif kategorileri listeleme
- `POST /categories/` - Yeni kategori ekleme *(Admin Yetkisi Gerekir)*
- `DELETE /categories/{id}` - Kategori silme *(Admin Yetkisi Gerekir)*
- `GET /products/` - Tüm ürünleri veya kategoriye göre filtrelenmiş ürünleri listeleme
- `POST /products/` - Yeni ürün ekleme *(Admin Yetkisi Gerekir)*
- `PUT /products/{id}` - Ürün güncelleme *(Admin Yetkisi Gerekir)*
- `DELETE /products/{id}` - Ürün silme *(Admin Yetkisi Gerekir)*
- `GET /products/advantageous` - Avantajlı/kampanyalı ürünleri listeleme

---

## ⏰ Supabase Keep-Alive Otomasyonu

Supabase ücretsiz planındaki projeler 7 gün işlem görmediğinde otomatik olarak uyku moduna (pause) geçer. Projenin kesintisiz çalışması için iki katmanlı keep-alive çözümü entegre edilmiştir:

1. **GitHub Actions Workflow (`.github/workflows/supabase_keepalive.yml`):**
   - 2 günde bir otomatik çalışarak veritabanına hafif bir ping sorgusu (`SELECT 1;`) gönderir.
   - GitHub deponuzun **Settings > Secrets and variables > Actions** kısmına `DATABASE_URL` secret'ını eklemeniz yeterlidir.

2. **Yerel Görev Zamanlayıcı (`backend/install_task.ps1`):**
   - İsteğe bağlı olarak yerel Windows makinenizde Windows Task Scheduler üzerinden düzenli ping çalıştırma imkanı sunar.

---

## 📄 Lisans & Katkı

Bu proje açık kaynaklı olup, geliştirilmeye ve özelleştirilmeye açıktır.

✨ **Geliştirici:** Enes Dolgun
