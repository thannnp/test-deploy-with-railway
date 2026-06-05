FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build && ls -la dist/

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package.json ./

EXPOSE 3000
CMD ["sh", "-c", "echo '=== /app/dist contents ===' && find /app/dist -maxdepth 2 2>/dev/null || echo 'dist not found' && npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]
