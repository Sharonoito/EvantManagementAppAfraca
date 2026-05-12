# ---- deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app

# Install deps based on lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# ---- production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Default port for Next.js
ENV PORT=3000

# Copy runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["sh", "-c", "next start -p $PORT"]

