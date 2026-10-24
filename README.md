# Calendar API

API **REST** para una **aplicación de calendario** construida con **Node.js**, **Express** y **MongoDB** (Mongoose). Ofrece registro e inicio de sesión con contraseñas cifradas y **JWT**, renovación del token y un **CRUD de eventos** protegido en el que **solo el creador de un evento puede editarlo o borrarlo**. Las peticiones se validan con **express-validator** y las fechas con **Moment.js**.

![Tech](https://img.shields.io/badge/Node.js-JavaScript-339933)
![Tech](https://img.shields.io/badge/Express-4-000000)
![Tech](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248)
![Tech](https://img.shields.io/badge/Auth-JWT-000000)
![Tech](https://img.shields.io/badge/express--validator-7-blue)
![Tech](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D)

---

## Tabla de contenidos

- [Calendar API](#calendar-api)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Scripts disponibles](#scripts-disponibles)
    - [Documentación (Swagger)](#documentación-swagger)
  - [Endpoints](#endpoints)
    - [Autenticación](#autenticación)
    - [Eventos](#eventos)
  - [Cómo funciona](#cómo-funciona)
    - [1. `index.js`](#1-indexjs)
    - [2. Rutas y middlewares](#2-rutas-y-middlewares)
    - [3. Controladores](#3-controladores)
    - [4. Modelos y helpers](#4-modelos-y-helpers)
    - [Flujo de una petición](#flujo-de-una-petición)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Registro** (`name`, `email`, `password`) con el email normalizado a minúsculas, rechazo de emails ya registrados (`400`) y la contraseña cifrada con **bcryptjs**.
- **Login** (email sin distinguir mayúsculas) que devuelve `uid`, `name` y un **JWT** válido durante **2 horas**.
- **Renovación del token** (`/api/auth/renew`) a partir del token actual.
- **CRUD de eventos** (`title`, `notes`, `start`, `end`) asociados al usuario que los crea. Es un **calendario compartido**: el listado devuelve los eventos de todos los usuarios con el nombre del autor (`populate`), y el cliente Calendar-app los muestra todos y distingue por color los propios.
- **Autorización por propietario**: actualizar o eliminar un evento de otro usuario devuelve `403`.
- **Validación** de campos obligatorios, formato de email, longitud de contraseña, fechas válidas e `id` de evento con formato de `ObjectId`, con respuesta `400` y el detalle de cada error.
- **Documentación OpenAPI 3** con **Swagger UI** en `/api/docs`.
- **Directorio público** (`public/`) servido como estáticos.

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js** y **npm**
- Una base de datos **MongoDB** (local o MongoDB Atlas)
- **nodemon** instalado globalmente para el modo desarrollo:

```bash
npm i nodemon -g
```

### Instalación

```bash
npm install
```

### Variables de entorno

Crea un `.env` a partir de `.env.example`:

```env
PORT=4000

# mongooseDB
DB_API=<cadena_de_conexion_mongodb>

# JWT secret
SECRET_JWT_SEED=<tu_secreto>
```

### Scripts disponibles

| Script        | Descripción                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Arranca con `nodemon index.js` (recarga) |
| `npm start`   | Arranca con `node index.js`              |

```bash
npm run dev
```

La API escucha en el puerto definido en `PORT` (`http://localhost:4000` con el valor de ejemplo).

### Documentación (Swagger)

Con la API levantada, abre **Swagger UI** en:

```
http://localhost:4000/api/docs
```

Incluye todas las rutas de `Auth` y `Events` con sus cuerpos de ejemplo y las respuestas de éxito y error (`400`, `401`, `403`, `404`, `500`). Para probar las rutas protegidas: ejecuta **register** o **login** con **Try it out**, copia el `token` de la respuesta, pulsa **Authorize** y pégalo en `xToken` (se envía como cabecera `x-token`).

La especificación está escrita a mano en [`docs/openapi.json`](docs/openapi.json) y también se sirve en `http://localhost:4000/api/docs.json` (útil para importarla en Postman o Insomnia). Si cambias una ruta, actualiza ese archivo.

---

## Endpoints

Documentación interactiva en [`/api/docs`](http://localhost:4000/api/docs).

### Autenticación

Base: `/api/auth`

| Método | Ruta        | Descripción                     | Cuerpo                         | Respuesta                    |
| ------ | ----------- | ------------------------------- | ------------------------------ | ---------------------------- |
| `POST` | `/register` | Registra un usuario             | `{ name, email, password }`    | `201` `{ uid, name, token }` |
| `POST` | `/`         | Inicia sesión                   | `{ email, password }`          | `200` `{ uid, name, token }` |
| `GET`  | `/renew`    | Genera un token nuevo           | — (cabecera `x-token`)         | `{ uid, name, token }`       |

### Eventos

Base: `/api/events` — todas las rutas requieren la cabecera **`x-token: <jwt>`**.

| Método   | Ruta   | Descripción                          | Cuerpo                                |
| -------- | ------ | ------------------------------------ | ------------------------------------- |
| `GET`    | `/`    | Lista los eventos de todos los usuarios con el autor | —                     |
| `POST`   | `/`    | Crea un evento del usuario actual    | `{ title, notes?, start, end }`       |
| `PUT`    | `/:id` | Actualiza un evento propio           | `{ title, notes?, start, end }`       |
| `DELETE` | `/:id` | Elimina un evento propio             | —                                     |

Ejemplo:

```bash
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -H "x-token: <jwt>" \
  -d '{ "title": "Reunión", "notes": "Sprint review", "start": "2024-01-15T10:00:00", "end": "2024-01-15T11:00:00" }'
```

---

## Cómo funciona

### 1. `index.js`

Crea el servidor Express, habilita **CORS**, sirve `public/` con `express.static`, conecta a MongoDB con `dbConnection()` (`database/config.js`), activa `express.json()`, monta las rutas `/api/auth` y `/api/events`, sirve Swagger UI en `/api/docs` con `swagger-ui-express` (y el documento en `/api/docs.json`), registra `handleJsonError` (un cuerpo JSON mal formado responde `400` en JSON en lugar de la página HTML con la traza de Express) y escucha en `PORT`.

### 2. Rutas y middlewares

- `routes/auth.js` y `routes/events.js` declaran las validaciones con `check()` de **express-validator** antes de cada controlador.
- `validateFields` recoge los errores con `validationResult` y responde `400` con `errors.mapped()`.
- `validateJwt` lee la cabecera `x-token`, la verifica con `jwt.verify` y `SECRET_JWT_SEED`, y deja `req.uid` y `req.name` para el controlador. En eventos se aplica a todas las rutas con `router.use(validateJwt)`.

### 3. Controladores

- `controllers/auth.js`:
  - `userRegister` normaliza el email, comprueba con `User.findOne({ email })` que no exista ya (si existe responde `400`), cifra la contraseña con `bcrypt.genSaltSync` + `hashSync`, guarda el usuario y genera el token.
  - `userLogin` normaliza el email a minúsculas igual que el registro, busca por email, compara con `bcrypt.compareSync` y genera el token.
  - `revalidateToken` firma un token nuevo con el `uid` y `name` del token actual.
- `controllers/events.js`:
  - `getEvents` hace `Event.find().populate("user", "name")` sin filtrar por usuario (calendario compartido); la restricción por propietario solo aplica a editar y borrar.
  - `createEvents` asigna `req.uid` como `user` y guarda.
  - `updateEvents` / `deleteEvents` buscan el evento, devuelven `404` si no existe y `403` si `event.user` no coincide con `req.uid`; luego usan `findByIdAndUpdate` (`new: true`) o `findByIdAndDelete`.

### 4. Modelos y helpers

- `models/User.js`: `name`, `email` (único) y `password`.
- `models/Events.js`: `title`, `notes`, `start`, `end` y `user` (referencia a `User`); su `toJSON` elimina `__v` y renombra `_id` a `id`.
- `helpers/jwt.js`: `generateJWT(uid, name)` envuelve `jwt.sign` en una promesa con `expiresIn: "2h"`.
- `helpers/isDate.js`: validador personalizado que usa `moment(value).isValid()`.

### Flujo de una petición

```
Cliente HTTP
   │  PUT /api/events/:id   (x-token: <jwt>)
   ▼
validateJwt ──► jwt.verify(SECRET_JWT_SEED) → req.uid, req.name
   ▼
param(id) + check(...) + isDate  ──►  validateFields  → 400 si hay errores
   ▼
updateEvents
   ├─ Event.findById(id)            → 404 si no existe
   ├─ event.user === req.uid ?      → 403 si no es el dueño
   └─ Event.findByIdAndUpdate()
   ▼
Mongoose ──► MongoDB
```

---

## Tecnologías

- **Node.js** + **Express 4** (CommonJS).
- **MongoDB** con **Mongoose 8**.
- **jsonwebtoken** para JWT y **bcryptjs** para contraseñas.
- **express-validator 7** para validación y **Moment.js** para fechas.
- **cors** y **dotenv**.
- **swagger-ui-express** para la documentación OpenAPI.
- **nodemon** (global) para desarrollo.

---

## Estructura del proyecto

```
calendar-api/
├── index.js                 # Servidor Express, middlewares globales, rutas y Swagger UI
├── docs/
│   └── openapi.json         # Especificación OpenAPI 3 (servida en /api/docs)
├── database/
│   └── config.js            # dbConnection (Mongoose)
├── routes/
│   ├── auth.js              # /api/auth
│   └── events.js            # /api/events
├── controllers/
│   ├── auth.js              # userRegister, userLogin, revalidateToken
│   └── events.js            # getEvents, createEvents, updateEvents, deleteEvents
├── middlewares/
│   ├── validate-fields.js   # Errores de express-validator
│   ├── handle-json-error.js # 400 para cuerpos JSON mal formados
│   └── validate-jwt.js      # Verificación de x-token
├── helpers/
│   ├── jwt.js               # generateJWT
│   └── isDate.js            # Validador de fechas
├── models/
│   ├── User.js
│   └── Events.js
├── public/                  # index.html y styles.css
├── .env.example
└── package.json
```

---

## Personalización

| Variable          | Significado                                | Ejemplo                   |
| ----------------- | ------------------------------------------ | ------------------------- |
| `PORT`            | Puerto HTTP del servidor                   | `4000`                    |
| `DB_API`          | Cadena de conexión de MongoDB              | `mongodb+srv://...`       |
| `SECRET_JWT_SEED` | Secreto para firmar y verificar los tokens | —                         |

La duración del token (`"2h"`) se define en `helpers/jwt.js`.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica (el `package.json` declara licencia `ISC`).
