# CLAUDE.md — Generador de Carteles v2

Este archivo contiene instrucciones para Claude y para cualquier persona que quiera correr este proyecto en una PC nueva.

---

## Qué hace este proyecto

Aplicación web para generar carteles de promociones de Coca-Cola. Tiene login con roles (ADMIN y LOCAL), panel de admin para gestionar locales, productos y activaciones, y panel de local para descargar carteles en PNG/PDF.

- **Frontend:** React + Vite — corre en `http://localhost:3000`
- **Backend:** Node.js + Express — corre en `http://localhost:5000`
- **Base de datos:** MySQL — base de datos llamada `carteles_db`

---

## Requisitos de la PC nueva

### 1. Node.js
- Versión mínima: **v18**
- Descargar en: https://nodejs.org → elegir la versión LTS
- Verificar instalación: `node -v` y `npm -v`

### 2. MySQL
- Versión mínima: **v8**
- Descargar en: https://dev.mysql.com/downloads/installer/
- Durante la instalación, configurar:
  - Usuario: `root`
  - Contraseña: (puede quedar vacía o poner una — después se actualiza en el `.env`)
  - Puerto: `3306` (el default)
- También se puede usar **XAMPP** (viene con MySQL incluido y es más fácil de instalar)

### 3. Git (opcional pero recomendado)
- Para clonar el proyecto desde GitHub
- Descargar en: https://git-scm.com

---

## Pasos para instalar el proyecto en la PC nueva

### Paso 1 — Obtener el código

**Opción A — Clonar desde GitHub:**
```bash
git clone https://github.com/helhache/PROYECTOCARTELES.git
cd PROYECTOCARTELES
```

**Opción B — Copiar la carpeta directamente** desde el pendrive o la PC original.

---

### Paso 2 — Crear la base de datos en MySQL

Abrir MySQL Workbench (o la consola de MySQL) y ejecutar:

```sql
CREATE DATABASE IF NOT EXISTS carteles_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carteles_db;

CREATE TABLE IF NOT EXISTS locales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  logo VARCHAR(255),
  activo TINYINT DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN', 'LOCAL') NOT NULL DEFAULT 'LOCAL',
  local_id INT,
  activo TINYINT DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tipos_cartel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  orientacion ENUM('vertical', 'horizontal') DEFAULT 'vertical'
);

CREATE TABLE IF NOT EXISTS activaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(200) NOT NULL,
  dinamica TEXT,
  precio_oferta DECIMAL(10,2),
  desde DATE,
  hasta DATE,
  imagen VARCHAR(255),
  tipo VARCHAR(100),
  dcto VARCHAR(50),
  activo TINYINT DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asignaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  local_id INT NOT NULL,
  activacion_id INT NOT NULL,
  precio_personalizado DECIMAL(10,2),
  activa TINYINT DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_asignacion (local_id, activacion_id),
  FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE,
  FOREIGN KEY (activacion_id) REFERENCES activaciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS log_descargas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  activacion_id INT,
  tipo_cartel VARCHAR(100),
  formato VARCHAR(20),
  descargado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (activacion_id) REFERENCES activaciones(id) ON DELETE SET NULL
);
```

---

### Paso 3 — Configurar el archivo .env del servidor

Ir a la carpeta `server/` y crear un archivo llamado `.env` con este contenido:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         ← poner la contraseña de MySQL si tiene, si no dejar vacío
DB_NAME=carteles_db
PORT=5000
JWT_SECRET=carteles_secret_2026
```

El archivo `.env` ya existe en la PC original con estos valores. Si se copia la carpeta completa ya debería estar ahí.

---

### Paso 4 — Instalar dependencias

Abrir una terminal en la carpeta del proyecto y ejecutar:

```bash
# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

---

### Paso 5 — Crear usuario admin y datos iniciales

Desde la carpeta `server/`, ejecutar:

```bash
node seed_mysql.js
```

Esto crea:
- Usuario admin: `admin.coca.repo` / contraseña: `repos2026`
- Los 5 tipos de cartel (Promo, Ahorro, Lanzamiento, SuperCombo, Horizontal)

---

### Paso 6 — Actualizar el archivo iniciar.bat

El archivo `iniciar.bat` en la raíz del proyecto tiene la ruta de la PC original de Henry:
```
C:\Users\henry\Desktop\CREADOR DE CARTELES\generador-carteles
```

Hay que cambiar esa ruta por la ruta donde está el proyecto en la PC nueva. Por ejemplo si lo pusiste en el escritorio:
```
C:\Users\TU_USUARIO\Desktop\PROYECTOCARTELES
```

Abrir `iniciar.bat` con el Bloc de notas y editar las dos líneas que dicen `cd /d`.

---

### Paso 7 — Iniciar el proyecto

Hacer doble clic en `iniciar.bat`. Eso abre dos ventanas de consola (backend y frontend) y luego abre el navegador en `http://localhost:3000`.

Si no abre automáticamente, entrar manualmente a: **http://localhost:3000**

---

## Estructura de carpetas

```
generador-carteles/
├── client/          ← Frontend React
│   ├── src/
│   └── package.json
├── server/          ← Backend Node.js
│   ├── routes/
│   ├── models/
│   ├── uploads/     ← Imágenes subidas (logos, productos)
│   ├── .env         ← Credenciales (NO se sube a GitHub)
│   └── package.json
└── iniciar.bat      ← Arranca todo con doble clic
```

---

## Credenciales por defecto

| Rol   | Usuario            | Contraseña  |
|-------|--------------------|-------------|
| Admin | admin.coca.repo    | repos2026   |

Los usuarios de cada local los crea el admin desde el panel de administración.

---

## Solución de problemas comunes

**"Cannot connect to database"**
- Verificar que MySQL está corriendo (en XAMPP darle Start al servicio MySQL)
- Verificar que el `.env` tiene la contraseña correcta

**"Port 5000 already in use"**
- Cerrar cualquier proceso que use el puerto 5000, o cambiar `PORT=5001` en el `.env` y actualizar el proxy en `client/vite.config.js`

**"node_modules not found"**
- Correr `npm install` dentro de `server/` y dentro de `client/` por separado

**El bat abre y cierra rápido**
- La ruta en el `.bat` es incorrecta, ver Paso 6

---

## Notas para Claude

- El proyecto usa **MySQL** (no MongoDB, aunque `mongoose` aparece en package.json es una dependencia sin uso activo)
- El `.env` del server **no está en el repositorio** (está en `.gitignore`) — hay que crearlo a mano en la PC nueva con los valores del Paso 3
- La carpeta `uploads/` tampoco se sube a GitHub — las imágenes de productos y logos quedan solo en la PC local
- El cliente usa proxy de Vite hacia `localhost:5000`, no hay URL hardcodeada del backend
- Para agregar locales y usuarios hay que entrar como admin y hacerlo desde el panel web
