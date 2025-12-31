# Platformă de anunțuri second-hand

Aplicație web de tip marketplace, care permite utilizatorilor să publice, să vizualizeze și să gestioneze anunțuri de vânzare.

## Funcționalități Principale
- **Autentificare:** Înregistrare și logare utilizatori (JWT).
- **Management Anunțuri:** Creare, editare și ștergere anunțuri.
- **Upload Imagini:** Integrare cu Cloudinary pentru stocarea și optimizarea imaginilor.
- **Categorii & Filtrare:** Organizarea produselor pe categorii (Auto, Electronice, etc.).
- **Favorite:** Sistem de salvare a anunțurilor preferate pentru fiecare utilizator.
- **Design Responsive:** Interfață adaptată pentru desktop, tabletă și mobil.

## Tehnologii Utilizate
* **Frontend:** React (Vite), CSS Modules.
* **Backend:** Express.js
* **Bază de date:** PostgreSQL (Neon).
* **Stocare media:** Cloudinary API.

## Prerequisites
Înainte de a începe, asigură-te că ai instalate/setate:
* **Node.js** & **npm**
* Bază de date **PostgreSQL** (de preferat Neon)
* Cont **Cloudinary** (pentru stocarea imaginilor)

---

## Instalare și Rulare

### 1. Clonarea repository-ului:
```bash
git clone https://github.com/UO-CTI-CG/proiect-ubd-2025-2026-Andrei25i.git
cd proiect-ubd-2025-2026-Andrei25i
```
### 2. Configurarea Backend-ului:
Accesează folderul `backend`, instalează dependințele și configurează variabilele de mediu:
```bash
cd backend
npm install
```

Creează un fișier `.env` în folderul `backend` și adaugă următoarele chei:

```bash
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_RESET_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://HOST:PORT # PORT = 3000 default
```
### 3. Configurarea Frontend-ului:
Accesează folderul `frontend`, instalează dependințele și configurează link-ul către API:
```bash
cd ../frontend
npm install
```
Creează un fișier `.env` în folderul `frontend` și adaugă următoarele chei::
```bash
VITE_API_URL=http://HOST:PORT/api # PORT = Portul setat in backend/.env
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### 4. Configurarea Bazei de Date
Pentru a inițializa structura bazei de date rulează scriptul **[db_schema](https://gist.github.com/Andrei25i/ff55f3dfcdd5852728d8ffab0bd5cdcc)** în interfața SQL Editor a bazei de date.

### 5. Rularea Aplicației
Start Backend:

Deschide o fereastră de terminal și rulează:
```bash
cd backend
npm run dev
```

Start Frontend:

Deschide o fereastră nouă de terminal și rulează:
```bash
cd frontend
npm run dev
```
Aplicația va fi disponibilă la adresa afișată în consolă.

---
## 🔗 Link Demo

Aplicația este live și poate fi testată accesând următorul link:

**[Live Demo](https://revinde.onrender.com)**

> **Notă importantă:** Deoarece aplicația este găzduită pe un plan gratuit Render, serverul intră în modul "sleep" după o perioadă de inactivitate. La prima accesare, s-ar putea să dureze aproximativ **30-50 de secunde** până când serverul se pornește și datele sunt afișate.