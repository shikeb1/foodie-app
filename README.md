# 🍔 FoodRush — Full-Stack Food Delivery App

> A production-ready, Zomato-inspired food delivery platform built for DevOps learning.  
> React + Node.js + PostgreSQL, fully Dockerized with CI/CD pipelines.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start (Local Development)](#quick-start-local-development)
5. [Environment Variables](#environment-variables)
6. [Running with Docker](#running-with-docker)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Authentication Flow](#authentication-flow)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [DevOps Concepts Covered](#devops-concepts-covered)
12. [Deployment Guide](#deployment-guide)
13. [Monitoring & Logging](#monitoring--logging)
14. [Troubleshooting](#troubleshooting)

---

## Project Overview

FoodRush is a full-featured food delivery web application with:

- **Customers** can browse restaurants, search by cuisine, add items to cart, place orders, and track order status.
- **Restaurant Owners** can register, manage their restaurant, add menu items and categories.
- **Admins** have full access to manage the platform.

This project is intentionally designed to cover maximum DevOps practices:
containerization, multi-stage Docker builds, Nginx reverse proxy, CI/CD with GitHub Actions, health checks, environment-based configuration, and structured logging.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Zustand | State management (auth, cart) |
| Axios | HTTP client with interceptors |
| react-hot-toast | Toast notifications |
| Lucide React | Icon library |
| CSS Variables | Theming (dark mode) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Express.js 4 | HTTP framework |
| Sequelize ORM | Database abstraction |
| PostgreSQL 16 | Primary database |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |
| Winston | Structured logging |
| Stripe | Payment processing |

### DevOps / Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Reverse proxy, static file serving |
| GitHub Actions | CI/CD pipeline |
| Multi-stage Builds | Smaller, secure images |
| Health Checks | Container orchestration readiness |

---

## Project Structure

```
foodie-app/
├── backend/                    # Node.js Express API
│   ├── config/
│   │   ├── database.js         # Sequelize/PostgreSQL connection
│   │   └── logger.js           # Winston logger setup
│   ├── controllers/            # Route handler logic
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   └── index.js            # All Sequelize models + associations
│   ├── routes/                 # Express route definitions
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   ├── users.js
│   │   ├── payments.js
│   │   └── categories.js
│   ├── seeds/
│   │   └── seed.js             # Database seeding with realistic data
│   ├── logs/                   # Winston log output (gitignored)
│   ├── server.js               # Express app entry point
│   ├── package.json
│   ├── Dockerfile              # Multi-stage Docker build
│   └── .env.example
│
├── frontend/                   # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── RestaurantCard.js
│   │   ├── context/
│   │   │   ├── authStore.js    # Zustand auth store
│   │   │   └── cartStore.js    # Zustand cart store (persisted)
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── RestaurantsPage.js
│   │   │   ├── RestaurantDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── OrderDetailPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── SearchPage.js
│   │   ├── utils/
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── App.js              # Routes + layout
│   │   ├── index.js
│   │   └── index.css           # Global styles + CSS variables
│   ├── Dockerfile              # Multi-stage build → Nginx serve
│   ├── nginx.conf              # Nginx config for SPA
│   └── package.json
│
├── nginx/
│   └── nginx.conf              # Reverse proxy config
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD pipeline
│
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Development compose (hot reload)
├── .gitignore
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js v20+
- PostgreSQL 16 (or use Docker)
- npm or yarn
- Git

### Step 1 — Clone and set up

```bash
git clone <your-repo-url>
cd foodie-app
```

### Step 2 — Set up the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
npm install
```

### Step 3 — Set up the database

Make sure PostgreSQL is running, then:

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE foodrush_db;"

# Run the seeder (creates tables + inserts sample data)
npm run seed
```

### Step 4 — Start the backend

```bash
npm run dev
# API will be available at http://localhost:5000
# Test: http://localhost:5000/health
```

### Step 5 — Set up and start the frontend

```bash
cd ../frontend
cp .env.example .env
# .env already points to http://localhost:5000/api
npm install
npm start
# App available at http://localhost:3000
```

### Demo Accounts (from seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodrush.com | admin123 |
| Restaurant Owner | rajesh@foodrush.com | password123 |
| Customer | amit@foodrush.com | password123 |

---

## Environment Variables

### Backend `.env`

```env
NODE_ENV=development         # development | production | test
PORT=5000                    # Server port

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodrush_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT — CHANGE THIS IN PRODUCTION
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRE=7d

# Stripe (optional — for card payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # requests per window
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Security Note:** Never commit `.env` files to git. Always use `.env.example` as the template.

---

## Running with Docker

### Option A — Production Stack (recommended)

```bash
# 1. Create a .env file in the project root
cp backend/.env.example .env

# 2. Edit .env with production values (especially JWT_SECRET and DB_PASSWORD)
nano .env

# 3. Build and start all services
docker compose up -d --build

# 4. Seed the database (first time only)
docker compose exec backend node seeds/seed.js

# 5. Check everything is running
docker compose ps
docker compose logs -f
```

Services will be available at:
- **App**: http://localhost (via Nginx reverse proxy)
- **API**: http://localhost/api (proxied through Nginx)
- **Backend direct**: http://localhost:5000
- **Frontend direct**: http://localhost:3000

### Option B — Development Stack (with hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Changes to backend files trigger automatic restart via nodemon.  
Changes to frontend files trigger hot reload via React dev server.

### Useful Docker Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Restart a single service
docker compose restart backend

# Rebuild after code changes
docker compose up -d --build backend

# Shell into a container
docker compose exec backend sh
docker compose exec postgres psql -U postgres -d foodrush_db

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database data)
docker compose down -v
```

---

## API Reference

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Get current user |
| PUT | `/auth/password` | Yes | Change password |

#### Register
```json
POST /auth/register
{
  "name": "Amit Kumar",
  "email": "amit@example.com",
  "password": "securepassword",
  "phone": "9876543210",
  "role": "customer"
}
```

#### Login
```json
POST /auth/login
{
  "email": "amit@foodrush.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Amit Kumar", "role": "customer" }
}
```

---

### Restaurants

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/restaurants` | No | List all (filter, sort, paginate) |
| GET | `/restaurants/featured` | No | Get featured restaurants |
| GET | `/restaurants/nearby` | No | Get nearby restaurants |
| GET | `/restaurants/:id` | No | Get restaurant + full menu |
| POST | `/restaurants` | Owner/Admin | Create restaurant |
| PUT | `/restaurants/:id` | Owner/Admin | Update restaurant |

#### Query Parameters for GET /restaurants

| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `page` | number | Page number | `?page=2` |
| `limit` | number | Results per page | `?limit=12` |
| `search` | string | Search by name/cuisine | `?search=pizza` |
| `cuisine` | string | Filter by cuisine | `?cuisine=North+Indian` |
| `rating` | number | Min rating | `?rating=4` |
| `deliveryTime` | number | Max delivery time | `?deliveryTime=30` |
| `sortBy` | string | Sort field | `?sortBy=rating` |
| `sortOrder` | string | ASC or DESC | `?sortOrder=DESC` |

---

### Menu

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/menu/restaurant/:restaurantId` | No | Get full menu with categories |
| POST | `/menu/item` | Owner/Admin | Add menu item |
| PUT | `/menu/item/:id` | Owner/Admin | Update menu item |
| DELETE | `/menu/item/:id` | Owner/Admin | Delete menu item |
| POST | `/menu/category` | Owner/Admin | Add menu category |

---

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Customer | Place a new order |
| GET | `/orders` | Customer | Get my orders |
| GET | `/orders/:id` | Customer | Get order details |
| PATCH | `/orders/:id/status` | Owner/Admin | Update order status |
| POST | `/orders/:id/cancel` | Customer | Cancel order |

#### Place Order
```json
POST /orders
{
  "restaurantId": "uuid-here",
  "items": [
    { "id": "item-uuid", "name": "Butter Chicken", "price": 380, "quantity": 2 }
  ],
  "deliveryAddress": {
    "line1": "42 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "type": "home"
  },
  "paymentMethod": "cod"
}
```

#### Order Status Flow
```
pending → confirmed → preparing → out_for_delivery → delivered
                   ↘ cancelled
```

---

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/restaurant/:restaurantId` | No | Get restaurant reviews |
| POST | `/reviews` | Customer | Submit review |
| DELETE | `/reviews/:id` | Customer/Admin | Delete review |

---

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create-intent` | Customer | Create Stripe payment intent |
| POST | `/payments/webhook` | Stripe | Stripe webhook handler |
| POST | `/payments/apply-coupon` | Customer | Validate & apply coupon |

#### Available Coupons (seeded)
| Code | Type | Discount |
|------|------|----------|
| `WELCOME50` | 50% off | Max ₹100 |
| `SAVE20` | 20% off | Max ₹200, min order ₹100 |
| `FLAT100` | ₹100 flat | Min order ₹300 |
| `FREEDEL` | Free delivery | Min order ₹200 |

---

## Database Schema

### Entity Relationships

```
User
 ├── has many Orders (as customer)
 ├── has many Restaurants (as owner)
 └── has many Reviews

Restaurant
 ├── belongs to User (owner)
 ├── has many MenuCategories
 │    └── MenuCategory has many MenuItems
 ├── has many Orders
 └── has many Reviews

Order
 ├── belongs to User
 ├── belongs to Restaurant
 └── stores items as JSONB array

Review
 ├── belongs to User
 ├── belongs to Restaurant
 └── optionally belongs to Order
```

### Key Tables

**users** — id (UUID), name, email, password (bcrypt), phone, role (ENUM), addresses (JSONB)  
**restaurants** — id, ownerId, name, cuisine (ARRAY), address (JSONB), rating, deliveryTime, deliveryFee, isOpen, isFeatured  
**menu_categories** — id, restaurantId, name, sortOrder  
**menu_items** — id, restaurantId, categoryId, name, price, isVeg, isBestseller, isAvailable  
**orders** — id, orderNumber, userId, restaurantId, items (JSONB), subtotal, total, status (ENUM), paymentStatus  
**reviews** — id, userId, restaurantId, rating (1-5), body, foodRating, deliveryRating  
**coupons** — id, code, discountType, discountValue, usageLimit, expiresAt

---

## Authentication Flow

```
1. User sends POST /auth/login { email, password }
2. Server validates credentials with bcrypt.compare()
3. Server generates JWT: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
4. Client stores token in localStorage as 'foodrush_token'
5. All subsequent requests include header: Authorization: Bearer <token>
6. authenticate middleware: jwt.verify() → looks up user in DB → attaches to req.user
7. Protected routes check req.user.role via authorize() middleware
```

**Token Expiry Handling:** When a 401 is received, the axios interceptor clears localStorage and dispatches `auth:logout` event, which triggers the Zustand store to clear state.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs in 4 stages:

### Stage 1 — Test Backend
- Spins up a PostgreSQL service container
- Installs dependencies with `npm ci`
- Runs Jest tests

### Stage 2 — Build Frontend
- Installs dependencies
- Runs `npm run build`
- Uploads build artifacts

### Stage 3 — Build & Push Docker Images
- Only runs on `main` branch
- Logs into GitHub Container Registry (ghcr.io)
- Builds multi-stage Docker images with layer caching
- Tags images with branch name, commit SHA, and `latest`

### Stage 4 — Deploy
- Only runs after successful image push
- SSHs into production server
- Pulls latest images and does a rolling restart
- Prunes old images

### Setting up GitHub Actions Secrets

Go to your repo → Settings → Secrets and Variables → Actions, and add:

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Production server IP/domain |
| `DEPLOY_USER` | SSH user (e.g., `ubuntu`) |
| `DEPLOY_SSH_KEY` | Private SSH key for server |

---

## DevOps Concepts Covered

### 1. Containerization (Docker)
- **Multi-stage builds** — separate builder and production stages to minimize image size
- The backend uses `dumb-init` for proper PID 1 signal handling
- The frontend builds React, then serves via Nginx (no Node.js in production image)
- Non-root users in containers for security

### 2. Container Orchestration (Docker Compose)
- **Named volumes** for persistent PostgreSQL data
- **Custom networks** — services communicate by name, not IP
- **Health checks** on all services — dependent services wait for upstream to be healthy
- **Environment variable injection** from `.env` file
- Separate `docker-compose.dev.yml` for development with volume mounts for hot reload

### 3. Reverse Proxy (Nginx)
- Single entry point on port 80
- Routes `/api/*` → backend container, everything else → frontend container
- **Rate limiting** — 30 req/min for API, 10 req/min for auth endpoints
- Gzip compression for all text responses
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

### 4. CI/CD (GitHub Actions)
- Automated testing on every push
- Builds and pushes Docker images to GitHub Container Registry
- Rolling deployment to production server via SSH
- Build caching with `cache-from: type=gha` for faster builds

### 5. Twelve-Factor App Principles
- **Config in environment** — no hardcoded secrets; everything via `.env`
- **Stateless processes** — the backend is stateless; state lives in PostgreSQL
- **Dev/prod parity** — same Docker images in both environments
- **Logs as streams** — Winston outputs structured JSON logs

### 6. Security Best Practices
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with expiry
- Helmet.js security headers
- Rate limiting on all API routes, stricter on auth
- Non-root Docker users
- CORS configured to specific frontend origin

### 7. Health Checks
- Every service has a `HEALTHCHECK` defined in Dockerfile
- Docker Compose uses `condition: service_healthy` for dependency ordering
- A `/health` HTTP endpoint on the backend returns service status

### 8. Observability
- Winston structured logging (JSON in production, colorized in development)
- Morgan HTTP access logs piped through Winston
- Error logs written to `logs/error.log`
- Combined logs to `logs/combined.log`

---

## Deployment Guide

### Deploy to a Linux VPS (Ubuntu/Debian)

```bash
# On your server

# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 2. Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# 3. Create app directory
sudo mkdir -p /opt/foodrush
sudo chown $USER:$USER /opt/foodrush
cd /opt/foodrush

# 4. Clone the repo
git clone <your-repo-url> .

# 5. Set up environment
cp backend/.env.example .env
nano .env  # Edit with production values

# 6. Start the stack
docker compose up -d --build

# 7. Seed the database
docker compose exec backend node seeds/seed.js

# 8. Check status
docker compose ps
```

### Useful Deployment Commands

```bash
# View all container statuses
docker compose ps

# Tail logs from all services
docker compose logs -f

# Update after a code change
git pull
docker compose up -d --build

# Backup the database
docker compose exec postgres pg_dump -U postgres foodrush_db > backup_$(date +%Y%m%d).sql

# Restore the database
cat backup.sql | docker compose exec -T postgres psql -U postgres foodrush_db
```

---

## Monitoring & Logging

### View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Backend error log file inside container
docker compose exec backend cat logs/error.log

# Postgres logs
docker compose logs postgres
```

### Container Resource Usage

```bash
# Live stats
docker stats

# Inspect a container
docker inspect foodrush_backend
```

### Adding Prometheus + Grafana (next step in your DevOps journey)

Add to `docker-compose.yml`:

```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana:latest
  ports:
    - "3001:3000"
  depends_on:
    - prometheus
```

---

## Troubleshooting

### Backend can't connect to PostgreSQL

```bash
# Check postgres is healthy
docker compose ps postgres

# Check logs
docker compose logs postgres

# Verify env vars
docker compose exec backend printenv | grep DB_
```

### Frontend shows "Network Error"

- Ensure `REACT_APP_API_URL` in `.env` matches where the backend is running
- Check CORS: `FRONTEND_URL` in backend `.env` must match the frontend origin

### Port already in use

```bash
# Find what's using port 5000
sudo lsof -i :5000
# Or
sudo ss -tulpn | grep :5000

# Kill it
sudo kill -9 <PID>
```

### Resetting the database (start fresh)

```bash
docker compose down -v         # Remove containers + volumes
docker compose up -d postgres  # Start just postgres
docker compose exec backend node seeds/seed.js  # Re-seed
docker compose up -d           # Start everything
```

### Docker build fails (npm install errors)

```bash
# Clear Docker build cache
docker builder prune

# Rebuild from scratch
docker compose build --no-cache
```

---

## What to Learn Next (Your DevOps Roadmap)

1. **Kubernetes (K8s)** — Take this Docker Compose setup and convert it to K8s manifests (Deployments, Services, Ingress, PersistentVolumeClaims)
2. **Helm Charts** — Package the K8s manifests as a Helm chart for reusable deployment
3. **Terraform** — Provision the infrastructure (VPC, EC2, RDS) on AWS as code
4. **Monitoring Stack** — Add Prometheus + Grafana to scrape backend metrics
5. **ELK Stack** — Ship logs to Elasticsearch → Kibana for centralized log management
6. **SSL/TLS** — Add Let's Encrypt certificates with Certbot or Traefik
7. **Load Balancing** — Add multiple backend replicas with Nginx upstream load balancing
8. **Secrets Management** — Move secrets to HashiCorp Vault or AWS Secrets Manager

---

## License

MIT — free to use for learning and personal projects.

---

*Built with ❤️ for DevOps learners. If this helped you, give it a ⭐ on GitHub!*
# foodie-app
