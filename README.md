# 🚀 SpaceX Launches — Frontend

Aplicación web moderna y responsiva construida con **Next.js + TypeScript** que visualiza los datos de lanzamientos espaciales de SpaceX. Desplegada en **Amazon ECS Fargate** con integración continua mediante **GitHub Actions**.

---

## 🌐 URL pública

| Recurso | URL |
|---------|-----|
| **Aplicación** | http://spacex-alb-110258141.us-east-2.elb.amazonaws.com |

---

## 📐 Arquitectura

```
Usuario
   │
   ▼
Application Load Balancer (puerto 80)
   │
   ▼
ECS Fargate (spacex-service)
   │
   ▼
Next.js App (puerto 3000)
   │
   ▼
Backend API (spacex-backend-alb)
   │
   ▼
DynamoDB (spaces_launches)
```

---

## ✨ Funcionalidades

- 📋 **Tabla de lanzamientos** — listado completo con paginación y filtros
- 🔍 **Modal de detalle** — al hacer clic en un lanzamiento se abre un modal con información detallada de la misión (cohete, plataforma, estado, links de webcast y artículo)
- 📊 **Gráficos por año** — visualización de lanzamientos agrupados por año
- 🔎 **Filtros** — filtrar por estado, año y nombre de misión
- 🕐 **Línea de tiempo** — vista cronológica de los lanzamientos
- 📈 **Estadísticas generales** — resumen de éxitos, fallos y próximos lanzamientos

---

## 📁 Estructura del repositorio

```
my-app/
├── src/
│   ├── app/
│   │   ├── launches/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── Launches/
│   │   └── main/
│   ├── lib/
│   │   ├── api/
│   │   ├── types/
│   │   └── ui-helper.ts
│   └── store/
│       └── useLaunches.ts
├── public/
├── Dockerfile
├── .dockerignore
├── .env.local
├── .env.production
├── next.config.js
├── tsconfig.json
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 🛠️ Correr localmente

### Prerrequisitos
- Node.js 20+
- pnpm

### Instalación
```bash
pnpm install
```

### Variables de entorno
Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> En producción el archivo `.env.production` apunta al ALB del backend:
> ```env
> NEXT_PUBLIC_API_URL=http://spacex-backend-alb-574561858.us-east-2.elb.amazonaws.com
> ```

### Correr en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de producción
```bash
pnpm build
pnpm start
```

---

## 🐳 Docker

### Build de la imagen
```bash
docker build -t spacex-frontend .
```

### Correr el contenedor
```bash
docker run -p 3000:3000 spacex-frontend
```

### Verificar
Abre [http://localhost:3000](http://localhost:3000)

> ⚠️ El proyecto usa `output: 'standalone'` en `next.config.js` para optimizar la imagen Docker.

---

## 🔁 Pipeline CI/CD (GitHub Actions)

El workflow `.github/workflows/deploy.yml` se activa con cada push a `main`.

### Flujo del pipeline

```
Push a main
    │
    ▼
┌─────────────────────────────────┐
│  1. Checkout código             │
│  2. Configurar credenciales AWS │
│  3. Login a Amazon ECR          │
│  4. Build imagen Docker         │
│  5. Push imagen a ECR           │
│  6. Descargar task definition   │
│  7. Actualizar imagen en task   │
│  8. Deploy en ECS Fargate       │
│  9. Esperar estabilidad         │
└─────────────────────────────────┘
```

### Variables de entorno en el pipeline

El build de Docker toma automáticamente el `.env.production` del repositorio, por lo que `NEXT_PUBLIC_API_URL` queda embebida en el build de Next.js sin configuración adicional en la Task Definition.

### Secrets requeridos en GitHub

Ve a **Settings → Secrets and variables → Actions** y agrega:

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Access key de IAM |
| `AWS_SECRET_ACCESS_KEY` | Secret key de IAM |
| `AWS_REGION` | `us-east-2` |

---

## ☁️ Infraestructura en AWS

| Recurso | Nombre |
|---------|--------|
| ECR Repository | `spacex-frontend` |
| ECS Cluster | `spacex-cluster` |
| ECS Service | `spacex-service` |
| Task Definition | `spacex-task` |
| Load Balancer | `spacex-alb` |
| Target Group | `spacex-tg` |
| Security Group ALB | `spacex-alb-sg` |
| Security Group ECS | `spacex-ecs-sg` |

---

## 🔗 Recursos relacionados

- [Next.js Docs](https://nextjs.org/docs)
- [Amazon ECS Docs](https://docs.aws.amazon.com/ecs/)
- [Backend API](http://spacex-backend-alb-574561858.us-east-2.elb.amazonaws.com)
- [Swagger UI](http://spacex-backend-alb-574561858.us-east-2.elb.amazonaws.com/api-docs)
- [Lambda Function URL](https://x2j244r7gcqo4bljyuqnwifayi0ruvxm.lambda-url.us-east-2.on.aws/)