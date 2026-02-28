# frontend/Dockerfile

# ─── Etapa 1: Builder ──────────────────────────────────────────────
FROM node:20-alpine AS builder

# Para evitar problemas con pnpm en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiamos manifests primero para aprovechar cache
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias (sin dev si quieres, pero para build dejamos todo)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build de producción
RUN pnpm build

# ─── Etapa 2: Runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Por si Next usa libc6
RUN apk add --no-cache libc6-compat

# No hace falta pnpm en runtime en modo standalone

# Copiamos el standalone generado por Next
# (Next genera .next/standalone con el server listo)
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Si tienes envs públicos para el cliente, los pasarás en ECS:
# ENV NEXT_PUBLIC_API_URL=https://tu-api-url

EXPOSE 3000

# El server.js viene en el output standalone de Next
CMD ["node", "server.js"]