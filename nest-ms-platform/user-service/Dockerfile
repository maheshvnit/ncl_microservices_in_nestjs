# # Stage 1: Build the application
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Run the application in a lightweight environment
# FROM node:20-alpine AS production
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --only=production
# COPY --from=builder /app/dist ./dist
# EXPOSE 3101
# CMD ["node", "dist/main.js"]

# # Stage 1: Build
# FROM node:20-alpine AS builder
# WORKDIR /app

# # Copy dependency files first (cache-friendly)
# COPY package*.json ./
# RUN npm ci

# # Copy only source files
# COPY tsconfig*.json ./
# COPY src ./src

# RUN npm run build


# # Stage 2: Production
# FROM node:20-alpine AS production
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY --from=builder /app/dist ./dist

# EXPOSE 3101
# CMD ["node", "dist/main.js"]

# # ---------- Builder ----------
# FROM node:20-alpine AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY tsconfig*.json ./
# COPY src ./src

# RUN npm run build


# # ---------- Production ----------
# FROM node:20-alpine AS production
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY --from=builder /app/dist ./dist

# EXPOSE 3101
# CMD ["node", "dist/main.js"]

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

EXPOSE 4101
CMD ["node", "dist/main.js"]


