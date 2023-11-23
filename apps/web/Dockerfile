# Use the official Node.js Alpine image as the base image
FROM node:18-alpine AS base

# Create a builder stage
FROM base AS builder

# Install dependencies for Turbo
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Install Turbo globally
RUN yarn global add pnpm turbo

# Copy the entire project
COPY . .

# Prune the project using Turbo
RUN turbo prune --scope=@nisomnia/web --docker

# Copy necessary files and directories for dependency installation
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY pnpm-lock.yaml pnpm-lock-yaml
COPY package.json package.json
COPY .env .env

# Install dependencies
RUN yarn global add pnpm turbo
RUN pnpm install

# Build the project
RUN pnpm turbo run build --filter=@nisomnia/web...

# Create an installer stage
FROM base AS installer

# Install additional dependencies
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Copy files for dependency installation
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN yarn global add pnpm turbo
RUN pnpm install

# Copy built project from the builder stage
COPY --from=builder /app/out/full/ .

# Create a runner stage
FROM base AS runner
RUN yarn global add pnpm turbo dotenv-cli

# Set working directory
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files from the installer stage
COPY --chown=nextjs:nodejs --from=builder /app/ ./

# Expose the port and set environment variables
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

# Command to run the application
CMD cd apps/web && npm run start
