# Maze Solver Robot - Interactive Pathfinding Visualization

## Overview

An educational web application that visualizes the Depth-First Search (DFS) pathfinding algorithm using a stack-based approach. The application demonstrates how AI agents navigate unknown environments through systematic exploration and intelligent backtracking. Users can interact with a grid-based maze, customize obstacles, select from preset mazes, and watch the algorithm solve paths in real-time with adjustable speed controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable interface elements. Material Design principles guide the visual system with emphasis on clarity, immediate feedback, and educational focus.

**Styling**: Tailwind CSS with custom design tokens for consistent spacing (2, 4, 8, 12, 16 units), typography (Inter/Roboto primary, Roboto Mono for data), and color theming. Supports light/dark mode with CSS variables for seamless theme switching.

**State Management**: React hooks-based architecture with custom `useMazeSolver` hook managing:
- Grid state (2D array representing walls/paths)
- Algorithm execution state (idle, running, paused, finished, no-path)
- Stack visualization (position history for DFS backtracking)
- Statistics tracking (steps, backtracks, cells visited, path length, elapsed time)
- History management for step-by-step playback

**Routing**: Wouter for lightweight client-side routing (single-page application with one main route)

**Data Fetching**: TanStack Query (React Query) configured for API communication, though currently the application operates primarily client-side without backend persistence

### Backend Architecture

**Server Framework**: Express.js running on Node.js

**Server Structure**: Minimal REST API setup with:
- Modular route registration system (`registerRoutes`)
- Static file serving for production builds
- Development mode with Vite middleware for HMR (Hot Module Replacement)
- Request logging middleware tracking API call duration and response status

**Storage Interface**: Abstracted storage layer with `IStorage` interface and `MemStorage` in-memory implementation. Designed to support future database integration without changing application logic.

### Design Patterns

**Component Composition**: Atomic design approach with reusable UI components (Button, Card, Slider) composed into feature components (ControlPanel, MazeGrid, StatsDashboard)

**Custom Hooks Pattern**: Business logic extracted into reusable hooks (e.g., `useMazeSolver` encapsulates entire algorithm state machine)

**Provider Pattern**: React Context used for theme management and React Query client provision

**Algorithm Visualization**: DFS pathfinding implemented with:
- Stack-based LIFO exploration
- Visited set for cycle prevention
- Real-time visualization updates
- Configurable execution speed (50ms to 600ms intervals)

### Build & Development

**Build Process**: Custom build script using esbuild for server bundling and Vite for client bundling. Server dependencies are selectively bundled (allowlist) to optimize cold start times by reducing file system calls.

**Development Environment**: Vite dev server with middleware mode integrated into Express, enabling full-stack development with HMR. Replit-specific plugins for error overlay and development tools when running in Replit environment.

**TypeScript Configuration**: Strict mode enabled with ESNext modules, path aliases for clean imports (@/, @shared/, @assets/), and bundler module resolution for Vite compatibility.

## External Dependencies

### Database

**Drizzle ORM**: PostgreSQL ORM with schema-first design. Configuration set up for migrations and database synchronization, though not actively used in current implementation. Schema defines basic user table structure (id, username, password) ready for future authentication features.

### UI Libraries

**Radix UI**: Headless component primitives providing accessibility and behavior (30+ components including Dialog, Dropdown, Tooltip, Slider)

**Lucide React**: Icon library for consistent iconography across the application

**Tailwind Merge & CVA**: Utility functions for managing conditional class names and component variants

### Form & Validation

**React Hook Form**: Form state management with validation capabilities

**Zod**: Schema validation library with Drizzle integration for type-safe database schemas

### Developer Tools

**Replit Integration**: Custom Vite plugins for development banner, error handling, and cartographer when running on Replit platform

**PostCSS & Autoprefixer**: CSS processing pipeline for Tailwind compilation and browser compatibility