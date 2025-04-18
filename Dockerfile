FROM node:20.17.0-alpine3.19
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN npm ci --omit dev
# RUN rm -rf src/ static/ .svelte-kit/ .env .env.development .env.local .env.production playwright.config.ts postcss.config.js svelte.config.js tailwind.config.ts tsconfig.json vite.config.ts docker-compose.yml compose.yaml
EXPOSE 4006
ENV NODE_ENV=production
CMD ["node", "build/index.js"]