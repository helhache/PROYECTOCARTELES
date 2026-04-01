# Generador de Carteles

Aplicación web para generar carteles promocionales listos para imprimir.

## Locales disponibles
- El Turco
- Tauil
- Fiambrisima
- Beraca

## Tipos de carteles
- Promo (rojo)
- Ahorro (verde)
- Lanzamiento (azul)
- Super Combo (violeta)

---

## Requisitos previos
- Node.js v18+
- MongoDB corriendo en `localhost:27017`

---

## Instalación y ejecución

### 1. Instalar dependencias del servidor
```bash
cd server
npm install
```

### 2. Cargar datos iniciales (locales + productos de ejemplo)
```bash
node seed.js
```

### 3. Instalar dependencias del cliente
```bash
cd ../client
npm install
```

---

## Levantar la aplicación

Abrir **dos terminales**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
→ Servidor en http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
→ App en http://localhost:3000

---

## Estructura del proyecto

```
generador-carteles/
├── client/         # React + Vite (frontend)
│   └── src/
│       ├── components/   # Editor, Preview, Formulario, etc.
│       ├── pages/        # Gestión de productos y locales
│       └── templates/    # JSONs de cada tipo de cartel
└── server/         # Node.js + Express + MongoDB
    ├── models/     # Producto, Local
    ├── routes/     # CRUD productos y locales
    └── uploads/    # Imágenes subidas
```

## Variables de entorno (server/.env)
```
MONGO_URI=mongodb://localhost:27017/carteles
PORT=5000
```
