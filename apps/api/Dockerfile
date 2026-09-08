FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.2.0

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm --filter @11-11/database generate
RUN pnpm --filter @11-11/types build
RUN pnpm --filter @11-11/ui build
RUN pnpm --filter @11-11/database build
RUN pnpm --filter @11-11/api build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@9.2.0

COPY --from=builder /app ./

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
