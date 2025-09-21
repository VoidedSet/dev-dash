FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

# --- Development Stage ---
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]


# --- Production Stage ---
FROM base AS prod
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]