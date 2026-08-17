
# CineClub-
Parcial de Desarrollo Web

Aplicación web Full-Stack para consultar películas utilizando la API de The Movie Database (TMDB) y gestionar reseñas de usuarios en memoria.

---

## Configuración de Variables de Entorno y API Key

Antes de ejecutar las aplicaciones, es necesario configurar los archivos `.env` correspondientes:

### 1. API Key de TMDB (Backend)
El backend requiere una API Key de TMDB para consultar el catálogo de películas.
- Creá un archivo llamado `.env` dentro de la carpeta `backend/`.
- Agregá las siguientes variables:

env
PORT=3001
TMDB_API_KEY=tu_api_key_de_tmdb_aqui


2. URL de la API (Frontend)
El cliente de React necesita conocer la dirección del backend para realizar las peticiones HTTP.

Creá un archivo llamado .env dentro de la carpeta frontend/.

Agregá la siguiente variable:

Fragmento de código
VITE_API_URL=http://localhost:3001
 Instrucciones de Instalación y Ejecución
Seguí estos pasos para levantar cada parte del proyecto por separado:

1. Backend (Servidor Node.js + Express)
Abrí una terminal y parate en el directorio del backend:

Bash
cd backend
Instalá las dependencias del proyecto:

Bash
npm install
Iniciá el servidor en modo desarrollo:

Bash
npm run dev
El servidor quedará corriendo en http://localhost:3001.

2. Frontend (Cliente React + Vite)
Abrí otra pestaña o ventana de la terminal y parate en el directorio del frontend:

Bash
cd frontend
Instalá las dependencias del proyecto:

Bash
npm install
Iniciá la aplicación en modo desarrollo:

Bash
npm run dev
El frontend estará disponible para abrir en el navegador en http://localhost:5173.

 Endpoints Principales del Backend
GET /api/health: Verificación del estado del servidor.

GET /api/movies/popular: Lista inicial de películas populares con avgScore.

GET /api/movies/search?q=:query: Búsqueda de películas en TMDB con cálculo de promedio (avgScore).

GET /api/movies/:tmdbId: Obtiene el detalle de la película junto a sus reseñas locales y promedio.

POST /api/movies/:tmdbId/reviews: Guarda una nueva reseña en memoria (requiere author, score del 1 al 5 y comment).

DELETE /api/reviews/:reviewId: Elimina una reseña por su ID.
