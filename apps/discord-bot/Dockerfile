FROM node:18-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
RUN npm install -g turbo@2
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune discord-bot --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache python3 make g++ libc6-compat autoconf automake libtool
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm ci

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
