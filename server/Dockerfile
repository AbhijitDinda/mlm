# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.0

################################################################################
FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --only=production

################################################################################
# Create a stage for building the application.
FROM deps AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

################################################################################
FROM base AS final
ENV NODE_ENV=production
COPY package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/dist ./dist
CMD npm start