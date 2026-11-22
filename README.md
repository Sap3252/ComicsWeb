# ComicsWeb

Aplicación full stack para ver, buscar y votar cómics y libros. Los usuarios registrados pueden votar y el administrador gestiona el catálogo y los roles de los usuarios.

## Entidad

La entidad principal es el **cómic**, que también puede ser un **libro** (campo `tipo`). Se expone en la API como `/api/comics`.

| Campo | Tipo | Descripción |
|---|---|---|
| tipo | texto | `comic` o `libro` |
| titulo | texto | Título de la obra |
| saga | texto | Saga o serie a la que pertenece |
| volumen | número | Número de tomo dentro de la saga |
| autor | texto | Autor o autores |
| año | número | Año de publicación |
| portada | texto (URL) | Imagen de la portada |
| contraportada | texto (URL) | Imagen de la contraportada (opcional) |
| tags | lista de textos | Etiquetas para buscar (hasta 10) |
| activo | booleano | `false` cuando se da de baja |

## URLs

- Frontend: https://comicsweb-dbz3.onrender.com
- Backend: https://comicsweb-tuj8.onrender.com


## Tecnologías

- Backend: Express, TypeScript, MongoDB (Mongoose), Better Auth y Zod.
- Frontend: React, Vite, TypeScript, React Hook Form y Zod.
- Deploy: Render (backend como Web Service y frontend como Static Site).

## Funcionalidades

- Listado y detalle de cómics y libros, con visor 3D de portada y contraportada.
- Búsqueda por tags, filtro por tipo y orden por votos, año o nombre.
- Registro e inicio de sesión con email, GitHub y Google.
- Votos a favor y en contra para usuarios logueados.
- Panel de admin con el ABM del catálogo y la gestión de roles de los usuarios.
- Roles: `user` (por defecto, solo lectura y votos) y `admin` (crea, edita y elimina).

## Correr en local

Requisitos: Node.js 22 o superior, una base de MongoDB (por ejemplo, un cluster gratuito de MongoDB Atlas) y las credenciales OAuth de GitHub y Google.

### Backend

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Completar el archivo `backend/.env` antes de `npm run dev`. El backend queda en http://localhost:3000.

### Frontend

En otra terminal:

```
cd frontend
npm install
npm run dev
```

Abrir http://localhost:5173. Vite reenvía las llamadas a `/api` al backend, así que el frontend no necesita variables de entorno.

### Crear un administrador

Todo usuario que se registra recibe el rol `user`. Para crear un admin, o convertir en admin a un usuario existente:

```
cd backend
npm run create-admin -- email@ejemplo.com contraseña "Nombre"
```

### Variables de entorno (backend/.env)

| Variable | Descripción |
|---|---|
| PORT | Puerto del backend (en local, 3000) |
| MONGODB_URI | URI de conexión a MongoDB, con el nombre de la base |
| BETTER_AUTH_SECRET | Clave para firmar las sesiones. Se genera con `npx @better-auth/cli secret` |
| BETTER_AUTH_URL | URL del frontend: http://localhost:5173 en local |
| GITHUB_CLIENT_ID | Client ID de la OAuth App de GitHub |
| GITHUB_CLIENT_SECRET | Client secret de la OAuth App de GitHub |
| GOOGLE_CLIENT_ID | Client ID del cliente OAuth de Google |
| GOOGLE_CLIENT_SECRET | Client secret del cliente OAuth de Google |

URLs de callback para configurar en GitHub y Google:

- GitHub: `<BETTER_AUTH_URL>/api/auth/callback/github`
- Google: `<BETTER_AUTH_URL>/api/auth/callback/google`

## Endpoints de la API

### Catálogo

| Método | Ruta | Rol requerido |
|---|---|---|
| GET | /api/comics | Público |
| GET | /api/comics/:id | Público |
| POST | /api/comics | admin |
| PUT | /api/comics/:id | admin |
| DELETE | /api/comics/:id | admin |
| POST | /api/comics/:id/votos | Usuario logueado |
| DELETE | /api/comics/:id/votos | Usuario logueado |

`GET /api/comics` acepta estos parámetros opcionales:

- `tags`: solo los que tienen todos esos tags. Ejemplo: `?tags=manga,shonen`
- `tipo`: `comic` o `libro`
- `orden`: `votos`, `nuevos`, `viejos` o `nombre`

`DELETE /api/comics/:id` hace una baja lógica (marca el registro como inactivo).

### Autenticación (Better Auth)

| Método | Ruta | Rol requerido |
|---|---|---|
| POST | /api/auth/sign-up/email | Público |
| POST | /api/auth/sign-in/email | Público |
| POST | /api/auth/sign-in/social | Público |
| POST | /api/auth/sign-out | Usuario logueado |
| GET | /api/auth/get-session | Público |
| GET | /api/auth/admin/list-users | admin |
| POST | /api/auth/admin/set-role | admin |

### Respuestas de error

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos (validación con Zod) o ID mal formado |
| 401 | No hay sesión iniciada |
| 403 | La sesión no tiene el rol necesario |
| 404 | El cómic o libro no existe |

## Deploy en Render

Backend (Web Service):

- Root Directory: `backend`
- Build Command: `npm ci --include=dev && npm run build`
- Start Command: `npm start`
- Variables de entorno: las mismas de `backend/.env`, más `NODE_ENV=production`. `BETTER_AUTH_URL` es la URL del frontend.

Frontend (Static Site):

- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Rewrites, en este orden:
  - `/api/*` hacia `https://comicsweb-tuj8.onrender.com/api/*`
  - `/*` hacia `/index.html`
