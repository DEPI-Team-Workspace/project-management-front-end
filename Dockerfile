# ================================
# Stage 1: Install Development Dependencies
# ================================

# Use Node.js 20 Alpine image (lightweight Linux image)
FROM node:20-alpine AS development-dependencies-env

# Copy all project files from local machine to /app inside container
COPY . /app

# Set working directory inside container
WORKDIR /app

# Install all dependencies including devDependencies
# npm ci is faster and safer for production/build environments
RUN npm ci


# ================================
# Stage 2: Install Production Dependencies Only
# ================================

# Create a separate lightweight environment for production packages
FROM node:20-alpine AS production-dependencies-env

# Copy only package files
# This improves Docker cache performance
COPY ./package.json package-lock.json /app/

# Set working directory
WORKDIR /app

# Install ONLY production dependencies
# --omit=dev removes devDependencies to reduce final image size
RUN npm ci --omit=dev


# ================================
# Stage 3: Build Application
# ================================

# Create build stage
FROM node:20-alpine AS build-env

# Copy all project files
COPY . /app/

# Copy node_modules from development stage
# because build tools usually exist in devDependencies
COPY --from=development-dependencies-env /app/node_modules /app/node_modules

# Set working directory
WORKDIR /app

# Build the application
# Example: React/Vite/Next/Remix/etc build process
RUN npm run build


# ================================
# Stage 4: Final Production Image
# ================================

# Create final clean production container
FROM node:20-alpine

# Copy package files
COPY ./package.json package-lock.json /app/

# Copy ONLY production node_modules
# This keeps image smaller and more secure
COPY --from=production-dependencies-env /app/node_modules /app/node_modules

# Copy built application files from build stage
COPY --from=build-env /app/build /app/build

# Set working directory
WORKDIR /app

# Start the application when container runs
CMD ["npm", "run", "start"]