#stage 1 base/dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY package*.json ./
RUN npm install

#stage 2 builder stage
FROM deps AS builder
# ── ONLY ADDED THESE 2 LINES ──
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# ──────────────────────────────
COPY . .
RUN npm run lint --if-present
RUN npm audit --audit-level=high || true
RUN npm run build --no-cache

#stage3 test staage
FROM deps AS test
COPY . .
RUN npm run test:ci --if-present

#stage 4 production 
FROM nginx:1.25-alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create Nginx cache and pid directories and change ownership
RUN mkdir -p /var/cache/nginx/client_temp \
  /var/cache/nginx/proxy_temp \
  /var/cache/nginx/fastcgi_temp \
  /var/cache/nginx/uwsgi_temp \
  /var/cache/nginx/scgi_temp \
  && chown -R appuser:appgroup /var/cache/nginx \
  && chown -R appuser:appgroup /etc/nginx/conf.d \
  && chmod -R 755 /var/cache/nginx \
  && touch /var/run/nginx.pid \
  && chown appuser:appgroup /var/run/nginx.pid

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]