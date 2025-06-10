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
RUN turbo prune discord-bot-status --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm clean-install

# Build the project
COPY --from=builder /app/out/full/ .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/status/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/status/.next/static ./apps/status/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/status/public ./apps/status/public

EXPOSE 3000

CMD ["node", "apps/status/server.js"]
