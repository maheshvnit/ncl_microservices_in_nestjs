# syntax=docker/dockerfile:1.6

# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

# cache npm deps across builds (BuildKit)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build


# ---------- Production ----------
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4102
CMD ["node", "dist/main.js"]


