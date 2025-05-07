FROM node:22.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN npm ci --omit dev
# RUN rm -rf src/ static/ .svelte-kit/ .env .env.development .env.local .env.production playwright.config.ts postcss.config.js svelte.config.js tailwind.config.ts tsconfig.json vite.config.ts docker-compose.yml compose.yaml
EXPOSE 5555
ENV NODE_ENV=production
CMD ["node", "build/index.js"]