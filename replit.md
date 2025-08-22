# AI Career Coach Platform

## Overview

The AI Career Coach Platform is an advanced, AI-powered career development application built to help professionals accelerate their career growth through personalized assessments, resume optimization, mock interviews, and comprehensive career planning. The platform leverages modern web technologies and Google's Gemini AI to provide intelligent career guidance and actionable insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using a modern React-based stack with Next.js 15 and React 19, implementing a single-page application (SPA) architecture. The application uses a component-based architecture with reusable UI components powered by Shadcn UI and Radix UI primitives. The design system implements a glassmorphism aesthetic with Tailwind CSS for styling, supporting both light and dark themes with smooth transitions.

Key architectural decisions:
- **Component Library**: Shadcn UI with Radix UI primitives for accessibility and consistency
- **Styling Strategy**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: Zustand for client-side state, TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
The backend follows a REST API architecture built with Express.js, implementing a modular structure with separate concerns for routing, data access, and AI integration. The application uses a repository pattern through the storage abstraction layer, enabling clean separation between business logic and data persistence.

Key architectural decisions:
- **API Design**: RESTful endpoints with consistent JSON responses and error handling
- **Data Access Layer**: Repository pattern with TypeScript interfaces for clean abstractions
- **ORM Strategy**: Drizzle ORM for type-safe database interactions with PostgreSQL
- **AI Integration**: Dedicated service layer for Google Gemini AI interactions
- **Error Handling**: Centralized error middleware with consistent error responses

### Data Storage Architecture
The application uses PostgreSQL as the primary database with Neon as the serverless PostgreSQL provider. The database schema is managed through Drizzle ORM with TypeScript-first schema definitions and automatic migrations.

Database design decisions:
- **Schema Management**: Drizzle ORM with code-first approach and automatic type generation
- **Data Relationships**: Relational design with foreign key constraints and cascade deletes
- **Data Types**: JSONB for flexible data storage (assessments, analysis results)
- **Connection Pooling**: Neon serverless connection pooling for scalability

### AI Integration Architecture
The platform integrates Google's Gemini AI through a service layer that handles various AI-powered features including career assessments, resume analysis, interview question generation, and career recommendations.

AI integration decisions:
- **AI Provider**: Google Gemini AI for advanced natural language processing capabilities
- **Service Abstraction**: Dedicated AI service layer with typed interfaces for different analysis types
- **Response Handling**: Structured JSON responses with schema validation for consistent AI outputs
- **Error Resilience**: Fallback mechanisms and error handling for AI service failures

### Authentication and State Management
The application implements a simplified authentication flow with user session management. State management is handled through a combination of server state (TanStack Query) and client state (Zustand) for optimal performance and data consistency.

### Development and Build Architecture
The project uses Vite for fast development builds and hot module replacement, with TypeScript for type safety across the entire codebase. The build process supports both development and production environments with optimized asset bundling.

Build system decisions:
- **Development Server**: Vite with custom middleware for API proxying
- **Type Safety**: TypeScript across frontend, backend, and shared schema definitions
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Asset Handling**: Vite for optimized asset bundling and tree shaking

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database for primary data storage with automatic scaling and connection pooling
- **Drizzle ORM**: TypeScript ORM for database interactions with schema management and migrations

### AI and Machine Learning
- **Google Gemini AI**: Advanced AI service for career analysis, resume optimization, interview preparation, and personalized recommendations
- **Google Cloud Platform**: Infrastructure for AI API access and potential future scaling

### UI and Styling
- **Shadcn UI**: High-quality React component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for smooth transitions and interactions

### Development and Tooling
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and developer experience
- **React Hook Form**: Performant form library with validation
- **Zod**: TypeScript-first schema validation
- **TanStack Query**: Data fetching and caching for server state
- **Wouter**: Lightweight routing library

### Deployment and Infrastructure
- **Vercel**: Frontend deployment platform with automatic deployments
- **Node.js**: Runtime environment for server-side JavaScript
- **WebSocket**: Real-time communication capabilities (configured but not actively used)

The architecture is designed for scalability, maintainability, and developer experience, with clear separation of concerns and modern best practices throughout the stack.