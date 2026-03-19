# FROM node:22-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# RUN npm ci --omit=dev
## COPY . .
## RUN npm install && npm run build
## RUN npm ci --omit dev
## RUN rm -rf src/ static/ .svelte-kit/ .env .env.development .env.local .env.production playwright.config.ts postcss.config.js svelte.config.js tailwind.config.ts tsconfig.json vite.config.ts docker-compose.yml compose.yaml
# EXPOSE 5554
# ENV NODE_ENV=production
# CMD ["node", "build/index.js"]



# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --omit=dev

# Stage 2: Runtime (sadece gerekli dosyalar)
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package.json ./package.json
EXPOSE 5554
ENV NODE_ENV=production
CMD ["node", "build/index.js"]