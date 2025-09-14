# Festival Planner

## Overview

Festival Planner is a comprehensive web application designed to help music festival enthusiasts discover events, create personalized schedules, and connect with other attendees. The platform combines event discovery with social features, allowing users to plan their festival experience, track artist performances, detect scheduling conflicts, and see which friends are attending events. The application follows a modern full-stack architecture with a focus on mobile-first design and real-time user interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development and building
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom design system featuring festival-inspired color palette (purple/blue gradients)
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Mobile-first responsive design with Inter/Poppins fonts, drawing inspiration from Spotify and Airbnb

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration and session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Data Architecture
- **Database**: PostgreSQL with the following core entities:
  - Users (authentication and profile data)
  - Events (festival information and metadata)
  - Artists (performer details and social links)
  - Stages (venue locations within events)
  - Performances (time-based artist schedule entries)
  - Event Attendances (user participation tracking)
  - User Schedules (personal timetable management)
  - User Connections (social following system)

### Key Features Implementation
- **Event Discovery**: Search and filter functionality with rich event cards showing attendance data
- **Personal Timetable**: Drag-and-drop schedule building with clash detection for overlapping performances
- **Social Features**: Friend attendance tracking, user connections, and social proof indicators
- **Admin Dashboard**: Content management interface for events, artists, and user moderation
- **Responsive Design**: Mobile-optimized interface with bottom navigation and touch-friendly interactions

### Development Patterns
- **Type Safety**: End-to-end TypeScript with shared schemas between frontend and backend
- **Component Architecture**: Reusable UI components with example implementations for development
- **API Design**: RESTful endpoints with consistent error handling and response formatting
- **Database Migrations**: Drizzle Kit for schema evolution and deployment

## External Dependencies

### Database & Infrastructure
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless
- **Session Storage**: connect-pg-simple for PostgreSQL session persistence

### Authentication & Security
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware with openid-client strategy
- **Express Session**: Server-side session management with secure cookie configuration

### UI & Styling
- **Radix UI**: Complete set of accessible React components (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Google Fonts**: Inter and Poppins font families for typography
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Frontend build tool with React plugin and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Drizzle Kit**: Database migration and introspection tools

### Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation with Drizzle integration
- **Date-fns**: Date manipulation and formatting utilities

### Additional Libraries
- **Class Variance Authority**: Type-safe CSS class composition
- **CLSX/Tailwind Merge**: Conditional CSS class handling
- **Memoizee**: Function memoization for performance optimization