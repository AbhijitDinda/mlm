# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.0

################################################################################
FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

################################################################################
# Create a stage for building the application.
FROM base AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --force
COPY . .
RUN npm run ci-build

################################################################################
FROM base AS final
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
RUN npm i -g serve

CMD serve -s dist