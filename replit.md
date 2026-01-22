# Espaço Castro - Event Venue Website

## Overview

This is a marketing website for "Espaço Castro," a Brazilian event venue offering party halls with pool, barbecue area, and accommodation. The site is built as a single-page application showcasing the venue's features, photo gallery, and event packages with a contact form for booking inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for scroll animations and transitions
- **State Management**: TanStack Query for server state
- **Carousel**: Embla Carousel for package showcase

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server bundling, Vite for client
- **Development**: Hot module replacement via Vite middleware

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface ready for database migration
- **Database Config**: Drizzle Kit configured with `DATABASE_URL` environment variable

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI and section components
    pages/        # Route pages
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route registration
  storage.ts      # Data access layer
  static.ts       # Static file serving
shared/           # Shared types and schema
  schema.ts       # Drizzle schema definitions
```

### Design Patterns
- **Component-based architecture**: Reusable UI components in `components/ui/`
- **Section components**: Page sections as separate components (Hero, Features, Marketing, PhotoGallery)
- **Storage interface pattern**: `IStorage` interface allows swapping between memory and database implementations
- **Path aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets

## External Dependencies

### UI Framework
- Radix UI primitives for accessible components
- Lucide React for icons
- class-variance-authority for component variants

### Build & Development
- Vite with React plugin
- Tailwind CSS v4 with PostCSS
- Custom Vite plugins for Replit integration (cartographer, dev-banner, meta-images)

### Database
- PostgreSQL (via DATABASE_URL environment variable)
- Drizzle ORM with drizzle-zod for schema validation
- connect-pg-simple for session storage (available but not currently used)

### Form Handling
- React Hook Form with Zod resolver
- Zod for schema validation

### Fonts
- Google Fonts: Fredoka (heading) and Outfit (body)