FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.2.0

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/

RUN pnpm --filter @11-11/types build
RUN pnpm --filter @11-11/ui build
RUN pnpm --filter @11-11/admin build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app ./

EXPOSE 3001

CMD ["node_modules/.bin/next", "start", "apps/admin", "-p", "3001"]
