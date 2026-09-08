# 11 11 | Haute Atelier Luxury E-Commerce Platform

An editorial-grade, scalable luxury fashion e-commerce architecture built for high performance, SEO dominance, and transactional integrity.

Designed following a **pragmatic, cost-effective architecture**:
- **Avoids premature infrastructure complexity** (No Kafka, Kubernetes, or OpenSearch overhead initially)
- **Monorepo Structure**: Turborepo + pnpm workspace
- **Relational Consistency**: PostgreSQL 16 + Prisma ORM
- **Backend**: Node.js + NestJS Modular Monolith
- **Queues & Caching**: Redis 7 + BullMQ
- **Search**: PostgreSQL Full-Text Search behind an injectable `SearchService` abstraction (swappable with OpenSearch later)
- **Media**: DigitalOcean Spaces (S3 compatible)
- **Storefront**: Next.js 14+ (App Router) with hybrid rendering (ISR / SSR / CSR) and editorial luxury aesthetics
- **Admin Console**: Next.js 14+ operations dashboard for catalog matrices, inventory audits, and order fulfillment
- **Deployment**: Single DigitalOcean Droplet + Docker Compose + Cloudflare Free

---

## Workspace Structure

```text
11_11_ecommerce/
├── apps/
│   ├── api/             # NestJS Modular Monolith (Port 4000)
│   ├── workers/         # NestJS BullMQ background queue consumer
│   ├── storefront/      # Next.js 14+ luxury customer experience (Port 3000)
│   └── admin/           # Next.js 14+ operations console (Port 3001)
├── packages/
│   ├── database/        # Shared Prisma schema, migrations, client & seed
│   ├── types/           # Shared TypeScript domain contracts & DTOs
│   ├── ui/              # Shared luxury design tokens, formatters & constants
│   └── config/          # Base TypeScript and linting configs
├── docker-compose.yml   # Local dev stack (PostgreSQL, Redis, Mailpit)
├── docker-compose.prod.yml # Production single-droplet stack (with Nginx)
├── turbo.json           # Turborepo task pipeline
└── pnpm-workspace.yaml  # Workspace package mapping
```

---

## Getting Started

### 1. Prerequisites
- Node.js `v20+`
- pnpm `v9+`
- Docker (optional for local PostgreSQL and Redis, or use managed instances)

### 2. Installation
```bash
# Clone repository
git clone <repo-url> 11_11_ecommerce
cd 11_11_ecommerce

# Install monorepo dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
```

### 3. Start Local Infrastructure
```bash
docker compose up -d
```
Services started:
- **PostgreSQL 16**: `localhost:5432` (`eleven_user` / `eleven_password` / `eleven11_db`)
- **Redis 7**: `localhost:6379`
- **Mailpit**: `localhost:8025` (Web UI to inspect transactional emails)

### 4. Database Setup & Seed
```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed luxury catalog, warehouses, and admin users
pnpm db:seed
```

### 5. Start Development Servers
```bash
# Runs all 4 applications concurrently with Turborepo
pnpm dev
```
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Console**: [http://localhost:3001](http://localhost:3001)
- **NestJS API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Mailpit Web UI**: [http://localhost:8025](http://localhost:8025)

---

## Testing & Quality Assurance

```bash
# Run unit & integration tests
pnpm --filter @11-11/api test

# Monorepo type-check across all apps and packages
pnpm turbo type-check

# Monorepo production build
pnpm turbo build
```

---

## Production Deployment (DigitalOcean Droplet + Cloudflare)

1. Provision a DigitalOcean Droplet (Ubuntu 22.04 LTS / 4GB RAM recommended).
2. Point your Cloudflare DNS (A record) to the Droplet's Public IPv4.
3. Configure `.env` on the server with production secrets.
4. Launch the stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
5. Cloudflare Free will manage automatic SSL termination, DDoS defense, and global CDN caching.
