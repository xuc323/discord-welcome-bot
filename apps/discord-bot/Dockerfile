FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

ENV TURBO_TELEMETRY_DISABLED=1

RUN npm install -g turbo@2
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune discord-bot --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat build-base python3 autoconf automake libtool
WORKDIR /app

ENV TURBO_TELEMETRY_DISABLED=1

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm clean-install

# Build the project
COPY --from=builder /app/out/full/ .
RUN npm run build

RUN npm prune --omit=dev

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bot
USER bot

# Copy app files
COPY --from=installer --chown=bot:nodejs /app/apps/discord-bot/dist ./
COPY --from=installer --chown=bot:nodejs /app/node_modules ./node_modules

# Copy package files
COPY --from=installer --chown=bot:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=installer --chown=bot:nodejs /app/packages/database/package.json ./packages/database
COPY --from=installer --chown=bot:nodejs /app/packages/music-player/dist ./packages/music-player/dist
COPY --from=installer --chown=bot:nodejs /app/packages/music-player/package.json ./packages/music-player

CMD ["node", "main.js"]
