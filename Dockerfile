# Use an official Node.js runtime as a base image
FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN pnpm build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]