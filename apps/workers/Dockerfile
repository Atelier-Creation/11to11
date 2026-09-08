FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.2.0

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY apps/workers/package.json ./apps/workers/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/workers/ ./apps/workers/

RUN pnpm --filter @11-11/database generate
RUN pnpm --filter @11-11/types build
RUN pnpm --filter @11-11/database build
RUN pnpm --filter @11-11/workers build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

CMD ["node", "apps/workers/dist/main.js"]
