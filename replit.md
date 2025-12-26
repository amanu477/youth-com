# Youth-Com (YouthConnect)

## Overview

YouthConnect is a community platform designed for youth ministry organizations. It provides member management, announcements with comments, small groups (Bible study groups), and role-based access control. The application supports English and Amharic languages and features a modern, youth-friendly design with session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and interactions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Internationalization**: Custom context-based language system (English/Amharic)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with Local Strategy, session-based auth using express-session
- **Password Hashing**: Node.js crypto (scrypt) for secure password storage
- **Session Storage**: PostgreSQL via connect-pg-simple
- **API Design**: RESTful endpoints with typed contract definitions in shared/routes.ts

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: shared/schema.ts contains all table definitions
- **Migrations**: drizzle-kit for database migrations (output to ./migrations)

### Key Data Models
- **Users**: Authentication accounts with roles (system_admin, admin, member) and granular permissions
- **Members**: Community member profiles (can be linked to user accounts)
- **Announcements**: Posts with author tracking
- **Comments**: Nested comments on announcements
- **Groups**: Small group/Bible study management with membership tracking

### Authentication & Authorization
- Session cookies with credentials include for API requests
- Role-based access: system_admin, admin, member
- Permission-based CRUD controls stored as JSON array on user records
- Protected routes check authentication and role before allowing access

### Build System
- **Development**: Vite for frontend HMR, tsx for server execution
- **Production**: esbuild bundles server code, Vite builds client to dist/public
- **Path Aliases**: @/ for client/src, @shared/ for shared directory

## External Dependencies

### Database
- PostgreSQL (required, connection via DATABASE_URL environment variable)
- connect-pg-simple for session persistence

### UI Component Libraries
- Radix UI primitives (accordion, dialog, dropdown, tabs, etc.)
- shadcn/ui component system (new-york style)
- Lucide React for icons
- Embla Carousel for carousels

### Development Tools
- Replit-specific plugins: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- TypeScript with strict mode enabled

### Fonts
- Fredoka (display font)
- Nunito (body font)
- Loaded via Google Fonts