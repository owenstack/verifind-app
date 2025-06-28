# Verifind App - Development Guide

## Commands

- **Build**: `bun run build` (React Router build)
- **Dev**: `bun run dev` (development server)
- **Format/Lint**: `bun run format` (Biome check & write)
- **Typecheck**: `bun run typecheck` (generates types & checks)
- **Database**: `bun run db:generate` (Drizzle migrations), `bun run db:studio` (Drizzle Studio)
- **Deploy**: `bun run deploy` (build & Cloudflare deploy)

## Architecture

- **Framework**: React Router v7 with SSR, Cloudflare Workers
- **Database**: SQLite with Drizzle ORM, Cloudflare D1
- **Auth**: Better-auth with sessions
- **API**: tRPC with TanStack Query, Superjson serialization
- **Storage**: Cloudflare R2 bucket, Images API
- **Structure**: Role-based routes (`_seeker/`, `_owner/`, `_provider/`), shared components in `/components`

## Code Style

- **Formatting**: Biome with tabs, double quotes, organize imports
- **Imports**: Use `~/` alias for app root, `type` imports for types
- **Components**: Default exports, async loaders with typed `Route.LoaderArgs`
- **Naming**: camelCase variables, PascalCase components, kebab-case files
- **UI**: Tailwind CSS (use shadcn color variables as defined in the `app.css`), Shadcn UI components (install different shadcn components with `bunx --bun shadcn@latest add`), Lucide icons
