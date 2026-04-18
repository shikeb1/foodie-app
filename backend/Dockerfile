# Stage 1: Base & Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY package*.json ./
RUN npm install

# Stage 2: Builder
FROM deps AS builder
COPY . .
RUN npm run build --if-present
RUN npm audit --audit-level=high || true
RUN npm run build --no-cache

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache dumb-init

ENV DB_HOST=postgres
ENV DB_PORT=5432
# Note: DB_NAME, DB_USER, and DB_PASSWORD should be passed at runtime for security
ENV PGSSLMODE=disable


RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p logs && chown appuser:appgroup logs


COPY --from=deps /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

USER appuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

ENTRYPOINT [ "dumb-init", "--" ]
CMD ["node", "server.js"]
