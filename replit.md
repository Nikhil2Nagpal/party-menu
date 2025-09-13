# Party Menu Selection App

## Overview

This is a React-based party menu selection application that allows users to browse categorized dishes, filter them by type (vegetarian/non-vegetarian), search for specific dishes, and build a custom party menu. The app features a modern UI built with shadcn/ui components and follows a full-stack architecture with Express.js backend and PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using functional components and hooks
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React's built-in useState and useContext hooks, with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for dish management (`/api/dishes`)
- **Data Storage**: In-memory storage with interface for future database integration
- **Development**: Hot reload with Vite middleware integration

### Component Structure
- **CategoryTabs**: Displays meal type categories (Starter, Main Course, Dessert, Sides) with selection counts
- **SearchFilters**: Provides search functionality and vegetarian/non-vegetarian filters
- **DishCard**: Individual dish display with add/remove functionality and ingredient access
- **IngredientModal**: Modal popup for detailed ingredient information
- **SelectedSummary**: Fixed bottom bar showing total selected items with continue action

### Data Model
- **Dish Schema**: Comprehensive dish information including name, description, image, meal type, dietary type, and ingredients array
- **Database Ready**: Drizzle ORM configuration for PostgreSQL with proper schema definitions
- **Type Safety**: Full TypeScript integration with shared types between frontend and backend

### Filtering and Search Logic
- **Category Filtering**: Dishes filtered by meal type (Starter, Main Course, Dessert, Sides)
- **Search Functionality**: Case-insensitive name-based search within selected category
- **Dietary Filters**: Toggle-based vegetarian and non-vegetarian filtering
- **Real-time Updates**: Immediate UI updates based on filter changes

### UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Visual Indicators**: Clear vegetarian/non-vegetarian badges and selection states
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Loading States**: Query-based loading indicators for async data fetching

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with TypeScript, React Query for data fetching
- **Routing**: Wouter for lightweight client-side navigation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling

### UI Component Library
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography

### Backend Dependencies
- **Express.js**: Web framework for API endpoints and middleware
- **Database**: Drizzle ORM with PostgreSQL support (Neon Database integration)
- **Development**: ESBuild for production bundling, TSX for development execution

### Development Tools
- **Vite**: Build tool with hot module replacement and optimized bundling
- **TypeScript**: Type safety across frontend, backend, and shared schemas
- **Replit Plugins**: Development banner and error overlay for Replit environment

### Database Integration
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **Drizzle Kit**: Database migrations and schema management
- **Type Generation**: Automatic TypeScript types from database schema