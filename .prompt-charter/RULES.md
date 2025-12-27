# VocoLabAI Architecture Rules

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: shadcn/ui components + Radix UI primitives
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Server Components + Client Components (no global state)
- **Animations**: Framer Motion (motion package)
- **Icons**: lucide-react
- **Backend**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (Supabase)
- **AI Services**: Whisper API, Azure Speech, Claude API, ElevenLabs

---

## 1. NEXT.JS APP ROUTER RULES

### Component Types
✅ REQUIRED: Use Server Components by default (no "use client" directive)
✅ REQUIRED: Mark Client Components with `"use client"` at top of file
✅ REQUIRED: Client Components needed for: hooks, event handlers, browser APIs, animations
❌ FORBIDDEN: Add "use client" to components that don't need interactivity
❌ FORBIDDEN: Pass functions/classes from Server to Client Components

### File Structure
✅ REQUIRED: Pages in `app/[route]/page.tsx` with default export
✅ REQUIRED: Layouts in `app/[route]/layout.tsx` with children prop
✅ REQUIRED: Use `app/globals.css` for global styles and Tailwind directives
✅ REQUIRED: Export metadata from page files for SEO
❌ FORBIDDEN: Create pages outside the `app/` directory

### Routing
✅ REQUIRED: Use Next.js `<Link>` component for internal navigation
✅ REQUIRED: Import from `next/link` and `next/navigation`
✅ REQUIRED: Use `usePathname()` hook for current route in Client Components
❌ FORBIDDEN: Use `<a>` tags for internal navigation
❌ FORBIDDEN: Use `usePathname()` in Server Components

### Image Handling
✅ REQUIRED: Use Next.js `<Image>` component from `next/image`
✅ REQUIRED: Configure remote image domains in `next.config.js`
✅ REQUIRED: Provide `width` and `height` or `fill` prop
❌ FORBIDDEN: Use `<img>` tags for images
❌ FORBIDDEN: Load remote images without domain configuration

---

## 2. COMPONENT ARCHITECTURE RULES

### shadcn/ui Components
✅ REQUIRED: Use shadcn/ui components from `@/components/ui/*`
✅ REQUIRED: Install new components via `npx shadcn@latest add [component]`
✅ REQUIRED: Customize components by editing files in `components/ui/`
✅ REQUIRED: Use `cn()` utility from `@/lib/utils` for conditional classes
❌ FORBIDDEN: Create custom base components that duplicate shadcn functionality
❌ FORBIDDEN: Install shadcn components manually without CLI

### Component Structure
✅ REQUIRED: Use functional components with TypeScript
✅ REQUIRED: Define explicit prop interfaces with TypeScript
✅ REQUIRED: Place reusable components in `components/ui/`
✅ REQUIRED: Place feature-specific components in logical folders
❌ FORBIDDEN: Use default exports for non-page components
❌ FORBIDDEN: Create components without TypeScript types

### Client Component Patterns
✅ REQUIRED: Use React hooks (useState, useEffect, useCallback, useRef, etc.)
✅ REQUIRED: Clean up side effects in useEffect return functions
✅ REQUIRED: Memoize callbacks with useCallback when passed to child components
✅ REQUIRED: Use useRef for canvas contexts, animation frames, and DOM references
❌ FORBIDDEN: Forget to cancel animation frames or intervals
❌ FORBIDDEN: Create new function references on every render for expensive operations

---

## 3. STYLING RULES

### Tailwind CSS
✅ REQUIRED: Use Tailwind utility classes directly in JSX
✅ REQUIRED: Use `cn()` utility for conditional/merged classes
✅ REQUIRED: Define custom colors in `tailwind.config.ts` with CSS variables
✅ REQUIRED: Use design tokens from `globals.css` (--background, --foreground, etc.)
❌ FORBIDDEN: Write inline styles unless absolutely necessary
❌ FORBIDDEN: Create separate CSS modules for components
❌ FORBIDDEN: Use arbitrary values excessively (e.g., `w-[347px]`)

### Responsive Design
✅ REQUIRED: Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
✅ REQUIRED: Design mobile-first (base styles, then add breakpoints)
✅ REQUIRED: Test responsive behavior at all breakpoints
❌ FORBIDDEN: Use fixed pixel widths without responsive alternatives
❌ FORBIDDEN: Ignore mobile viewport considerations

### Animations
✅ REQUIRED: Use Framer Motion (motion) for complex animations
✅ REQUIRED: Define custom animations in `globals.css` or `tailwind.config.ts`
✅ REQUIRED: Respect `prefers-reduced-motion` for accessibility
✅ REQUIRED: Use `layoutId` for shared element transitions
❌ FORBIDDEN: Use CSS animations for complex interactive states
❌ FORBIDDEN: Ignore accessibility motion preferences

---

## 4. TYPESCRIPT RULES

### Type Safety
✅ REQUIRED: Use explicit types for all function parameters and returns
✅ REQUIRED: Define interfaces for all component props
✅ REQUIRED: Use TypeScript strict mode
✅ REQUIRED: Type all API responses and request payloads
❌ FORBIDDEN: Use `any` type (use `unknown` if type is truly unknown)
❌ FORBIDDEN: Use `@ts-ignore` or `@ts-expect-error` without explanation
❌ FORBIDDEN: Disable TypeScript strict checks

### Import Patterns
✅ REQUIRED: Use `@/` path alias for all internal imports
✅ REQUIRED: Import types with `import type` when importing only types
✅ REQUIRED: Group imports: external packages, then internal modules
❌ FORBIDDEN: Use relative paths like `../../components/Button`
❌ FORBIDDEN: Mix default and named exports inconsistently

---

## 5. CANVAS & WEBGL RULES

### Canvas Setup
✅ REQUIRED: Wrap canvas logic in `useCallback` to prevent recreation
✅ REQUIRED: Store canvas context in `useRef`
✅ REQUIRED: Use `requestAnimationFrame` for animations
✅ REQUIRED: Clean up animation frames in useEffect return
✅ REQUIRED: Handle window resize events with debouncing if needed
❌ FORBIDDEN: Create new canvas contexts on every render
❌ FORBIDDEN: Forget to cancel animation frames on unmount

### Animation Loop
✅ REQUIRED: Store animation frame ID in useRef
✅ REQUIRED: Cancel previous frame before requesting new one
✅ REQUIRED: Check if component is still mounted before updating
✅ REQUIRED: Use performance.now() or timestamps for frame-independent animation
❌ FORBIDDEN: Run animation loops without cleanup
❌ FORBIDDEN: Create memory leaks with infinite loops

---

## 6. API INTEGRATION RULES

### Backend Communication
✅ REQUIRED: Use Fetch API for HTTP requests
✅ REQUIRED: Define API endpoints in environment variables
✅ REQUIRED: Handle loading, success, and error states
✅ REQUIRED: Use FormData for file uploads (audio recordings)
❌ FORBIDDEN: Hardcode API URLs in components
❌ FORBIDDEN: Ignore error handling for API calls

### Audio Processing
✅ REQUIRED: Use MediaRecorder API for audio capture
✅ REQUIRED: Validate audio format (WAV/MP3, 16kHz sample rate)
✅ REQUIRED: Check browser compatibility for Web Audio API
✅ REQUIRED: Handle permissions requests gracefully
❌ FORBIDDEN: Assume audio APIs are available without checking
❌ FORBIDDEN: Upload audio without format validation

---

## 7. FILE ORGANIZATION RULES

### Directory Structure
✅ REQUIRED: Follow this structure for frontend:
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── [route]/page.tsx   # Dynamic routes
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/ui components + custom
├── lib/
│   └── utils.ts           # Utility functions (cn, etc.)
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript config
└── next.config.js         # Next.js config
```

### Naming Conventions
✅ REQUIRED: Use kebab-case for file names: `music-reactive-hero-section.tsx`
✅ REQUIRED: Use PascalCase for component names: `MusicReactiveHeroSection`
✅ REQUIRED: Use camelCase for functions and variables
✅ REQUIRED: Prefix Client Components with descriptive names
❌ FORBIDDEN: Mix naming conventions within same directory
❌ FORBIDDEN: Use generic names like `Component1.tsx`

### File Exports
✅ REQUIRED: Export singleton from services: `export const entityService = new EntityService()`
✅ REQUIRED: Export model instance type: `export type IEntityModel = Instance<typeof EntityModel>`
✅ REQUIRED: Export store instance type: `export type IEntityStore = Instance<typeof EntityStore>`
✅ REQUIRED: Use camelCase for functions and variables
✅ REQUIRED: Prefix Client Components with descriptive names
❌ FORBIDDEN: Mix naming conventions within same directory
❌ FORBIDDEN: Use generic names like `Component1.tsx`

---

## 8. AI SERVICES INTEGRATION RULES

### Audio Processing Pipeline
✅ REQUIRED: Upload audio to Supabase Storage first, then process
✅ REQUIRED: Call Whisper and Azure Speech APIs in parallel
✅ REQUIRED: Pass audio URL to backend, not raw audio data
✅ REQUIRED: Handle API rate limits and timeouts gracefully
❌ FORBIDDEN: Send large audio files directly in request body
❌ FORBIDDEN: Process audio client-side before upload

### Error Analysis
✅ REQUIRED: Store phoneme-level errors in PostgreSQL
✅ REQUIRED: Track user progress over time with historical data
✅ REQUIRED: Generate personalized feedback using Claude API
✅ REQUIRED: Return structured JSON with scores, errors, and practice sentences
❌ FORBIDDEN: Return unstructured error messages
❌ FORBIDDEN: Ignore historical performance data

---

## 9. DATABASE RULES (Supabase/PostgreSQL)

### Schema Design
✅ REQUIRED: Use snake_case for database column names
✅ REQUIRED: Define foreign keys for relational data
✅ REQUIRED: Add indexes for frequently queried columns
✅ REQUIRED: Use timestamps (created_at, updated_at) for all tables
❌ FORBIDDEN: Use camelCase in database schema
❌ FORBIDDEN: Create tables without primary keys

### Supabase Integration
✅ REQUIRED: Use Supabase client for authentication and storage
✅ REQUIRED: Store API keys in environment variables
✅ REQUIRED: Use Row Level Security (RLS) policies
✅ REQUIRED: Handle authentication state in Client Components
❌ FORBIDDEN: Expose Supabase service role keys client-side
❌ FORBIDDEN: Query database directly from frontend

---

## 10. ACCESSIBILITY RULES

### Semantic HTML
✅ REQUIRED: Use semantic HTML elements (header, nav, main, footer, section)
✅ REQUIRED: Provide alt text for all images
✅ REQUIRED: Use proper heading hierarchy (h1 → h2 → h3)
✅ REQUIRED: Add ARIA labels for interactive elements without text
❌ FORBIDDEN: Use div/span for everything
❌ FORBIDDEN: Skip heading levels

### Keyboard Navigation
✅ REQUIRED: Ensure all interactive elements are keyboard accessible
✅ REQUIRED: Provide visible focus indicators
✅ REQUIRED: Use tabIndex appropriately for custom components
❌ FORBIDDEN: Disable focus outlines without alternative
❌ FORBIDDEN: Create keyboard traps

### Screen Readers
✅ REQUIRED: Use aria-live for dynamic content updates
✅ REQUIRED: Provide text alternatives for icon-only buttons
✅ REQUIRED: Hide decorative elements with aria-hidden
❌ FORBIDDEN: Use placeholder text as labels
❌ FORBIDDEN: Rely solely on color to convey information

---

## 11. PERFORMANCE RULES

### Code Splitting
✅ REQUIRED: Use dynamic imports for large components: `dynamic(() => import())`
✅ REQUIRED: Lazy load heavy libraries (react-countup, etc.)
✅ REQUIRED: Use `{ ssr: false }` for client-only components
❌ FORBIDDEN: Import large libraries in Server Components unnecessarily
❌ FORBIDDEN: Load all features on initial page load

### Image Optimization
✅ REQUIRED: Use Next.js Image component with proper sizing
✅ REQUIRED: Provide multiple image sizes for responsive layouts
✅ REQUIRED: Use modern image formats (WebP, AVIF)
❌ FORBIDDEN: Load full-resolution images for thumbnails
❌ FORBIDDEN: Ignore image optimization warnings

### Bundle Size
✅ REQUIRED: Monitor bundle size with Next.js build analyzer
✅ REQUIRED: Tree-shake unused code by using named imports
✅ REQUIRED: Minimize client-side JavaScript
❌ FORBIDDEN: Import entire libraries when only using one function
❌ FORBIDDEN: Ignore "First Load JS" warnings in build output

---

## 12. SECURITY RULES

### Environment Variables
✅ REQUIRED: Store sensitive data in `.env.local` (gitignored)
✅ REQUIRED: Use `NEXT_PUBLIC_` prefix for client-accessible variables
✅ REQUIRED: Never commit API keys or secrets to version control
❌ FORBIDDEN: Expose backend API keys client-side
❌ FORBIDDEN: Use the same environment file for dev and production

### Data Validation
✅ REQUIRED: Validate all user inputs on backend
✅ REQUIRED: Sanitize file uploads (check size, type, content)
✅ REQUIRED: Use HTTPS for all API communications
❌ FORBIDDEN: Trust client-side validation alone
❌ FORBIDDEN: Accept arbitrary file uploads without validation

---

## 13. VOCOLABAI-SPECIFIC PATTERNS

### Audio Recording Flow
✅ REQUIRED: Request microphone permissions before recording
✅ REQUIRED: Show recording indicator during capture
✅ REQUIRED: Allow playback before upload
✅ REQUIRED: Display transcription and pronunciation scores
❌ FORBIDDEN: Start recording without user permission
❌ FORBIDDEN: Upload without user confirmation

### Feedback Display
✅ REQUIRED: Show phoneme-level errors with visual highlighting
✅ REQUIRED: Provide practice sentences based on errors
✅ REQUIRED: Display progress metrics with animations
✅ REQUIRED: Use color coding for accuracy scores (green/yellow/red)
❌ FORBIDDEN: Show raw API responses to users
❌ FORBIDDEN: Display technical error messages

### Progress Tracking
✅ REQUIRED: Store session data in PostgreSQL
✅ REQUIRED: Show historical improvement charts
✅ REQUIRED: Highlight most problematic phonemes
✅ REQUIRED: Calculate and display overall progress percentage
❌ FORBIDDEN: Lose user progress data
❌ FORBIDDEN: Show inaccurate or misleading metrics

---

## USAGE EXAMPLES

### Example 1: Creating a New Component
```
"Load and obey .prompt-charter/RULES.md.
Create a new Client Component for audio waveform visualization 
at components/ui/audio-waveform.tsx using Canvas API and Framer Motion."
```

### Example 2: Refactoring Code
```
"Follow .prompt-charter/RULES.md rules.
Refactor the FAQ section to use proper TypeScript interfaces 
and ensure keyboard accessibility."
```

### Example 3: Adding a Feature
```
"Load .prompt-charter/RULES.md.
Add a new page at app/dashboard/page.tsx that shows user's 
practice history with animated progress charts using react-countup."
```

### Example 4: Code Review
```
"Load .prompt-charter/RULES.md.
Review components/ui/music-reactive-hero-section.tsx 
for compliance with Canvas rules and animation cleanup."
```

---

**VocoLabAI Architecture Rules**  
**Version**: 1.0  
**Last Updated**: December 26, 2025  
**Project**: AI-Powered Speech Training Platform
