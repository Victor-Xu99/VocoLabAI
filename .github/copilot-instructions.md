# VocoLabAI - AI-Powered Speech Training Platform
# "Load and obey .prompt-charter/RULES.md. [Your task here]"

## Project Overview

VocoLabAI is a full-stack speech training application that combines AI-powered pronunciation assessment with personalized feedback. The system uses multiple AI services (Whisper, Azure Speech, Claude) to analyze user speech patterns and provide adaptive practice exercises.

**Architecture**: Monorepo with separate frontend (Next.js/Vercel) and backend (FastAPI/Railway) services.

## Technology Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 15 with App Router and React Server Components
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Deployment**: Vercel

### Backend (`/api`)
- **Framework**: FastAPI (Python 3.11+)
- **Deployment**: Railway/Render
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage for audio files
- **Authentication**: Supabase Auth with JWT tokens

### AI Services Pipeline
1. **Whisper API** (OpenAI) - Speech-to-text transcription with timestamps
2. **Azure Speech Services** - Phoneme-level pronunciation assessment
3. **Claude API** (Anthropic) - Personalized feedback generation
4. **ElevenLabs** - Text-to-speech for correct pronunciation examples (optional)

## Key Workflows

### Audio Processing Pipeline
```
User Recording → Frontend Upload → Backend FastAPI → Parallel API Calls:
  ├─ Whisper (transcription)
  └─ Azure (phoneme scoring)
    → Error Analysis → Database Storage → Claude (feedback) → Frontend Display
```

### Development Commands

#### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start dev server (http://localhost:3000)
npm run build       # Production build
npm run lint        # Run ESLint
```

#### Backend
```bash
cd api
# Backend setup commands not yet implemented - check api/README.md
```

## Project Structure

```
VocoLabAI/
├── frontend/               # Next.js application
│   ├── app/               # App Router pages and layouts
│   │   ├── layout.tsx     # Root layout with metadata
│   │   ├── page.tsx       # Home page with hero section
│   │   └── globals.css    # Tailwind directives + custom styles
│   ├── components/
│   │   └── ui/            # shadcn/ui components + custom components
│   ├── lib/
│   │   └── utils.ts       # cn() utility for class merging
│   ├── tailwind.config.ts # Tailwind configuration with design tokens
│   ├── components.json    # shadcn/ui configuration
│   └── tsconfig.json      # TypeScript config with path aliases (@/*)
├── api/                   # FastAPI backend (structure TBD)
└── datasets/              # Training data and test files
```

## Code Conventions

### Path Aliases
- Use `@/` prefix for all imports: `@/components/ui/button`
- Never use relative paths (`../../../`)

### Component Structure
- **Client Components**: Mark with `"use client"` directive at top of file
- **Server Components**: Default for App Router - no directive needed
- Use TypeScript for all new components with explicit prop types

### Styling Patterns
- Use Tailwind utility classes directly in JSX
- Use `cn()` utility (from `@/lib/utils`) to merge conditional classes
- Custom animations defined in `globals.css` and `tailwind.config.ts`
- Design tokens use CSS variables (`--background`, `--foreground`, etc.)

### Canvas/WebGL Components
- Always wrap canvas logic in `useCallback` to prevent recreation
- Store refs with `useRef` for animation frames, contexts, and state
- Clean up animation frames in `useEffect` return function
- Handle window resize events properly

## Important Implementation Details

### Audio Visualization (Hero Section)
- Uses HTML5 Canvas API with film grain effects
- Animation loop runs at 60fps via `requestAnimationFrame`
- Color system uses HSL for smooth transitions
- Post-processing includes: film grain, scanlines, chromatic aberration, vignette

### Data Flow Patterns
1. **User uploads audio** → FormData with file + reference_text
2. **Backend validates** → Uploads to Supabase Storage → Returns URL
3. **Parallel processing** → Whisper + Azure APIs called simultaneously
4. **Error analysis** → Python logic identifies phoneme substitutions
5. **Historical context** → Query PostgreSQL for user's past performance
6. **AI feedback** → Claude generates personalized sentences + tips
7. **Response assembly** → JSON with scores, errors, feedback, practice sentences

### Database Schema (Supabase)
- `users` - User accounts and profiles
- `sessions` - Practice session records
- `phoneme_performance` - Phoneme-level accuracy tracking
- `practice_sentences` - Adaptive sentence generation history
- `user_progress` - Overall progress metrics
- `impediment_profiles` - Detected speech pattern classifications

## Common Tasks

### Adding a new shadcn/ui component
```bash
cd frontend
npx shadcn@latest add [component-name]
```

### Creating a new page
1. Create `app/[route]/page.tsx` with default export
2. Add metadata export for SEO
3. Use Server Components by default, mark Client Components explicitly

### Environment Variables
- Frontend: Use `NEXT_PUBLIC_` prefix for client-side access
- Backend: Standard Python environment variables
- Store in `.env.local` (gitignored)

## External Dependencies

### Audio Requirements
- Browser must support Web Audio API and MediaRecorder API
- Audio format: WAV/MP3, 16kHz sample rate
- Max file size limits enforced at backend

### API Rate Limits
- Whisper: Per OpenAI account limits
- Azure Speech: Free tier 5M characters/month
- Claude: Per Anthropic account limits

## Testing & Debugging

- **No test framework currently configured** - tests should be added
- Use Next.js built-in dev tools for React debugging
- Canvas debugging: Check browser console for WebGL/Canvas errors
- Audio debugging: Verify MediaRecorder API compatibility

## Known Issues & Limitations

1. Backend (`/api`) structure is minimal - needs full FastAPI implementation
2. No authentication flow implemented yet in frontend
3. Database migrations not set up
4. No error boundary components for graceful error handling
5. Mobile responsiveness needs testing for canvas animations

## Getting Started for AI Agents

1. **Understand the data flow** from README.md diagrams (lines 1-432)
2. **Frontend work**: Start in `frontend/app/` or `frontend/components/`
3. **Backend work**: Check `api/` (currently minimal structure)
4. **Component additions**: Use shadcn/ui CLI or create in `components/ui/`
5. **Styling changes**: Modify `app/globals.css` or `tailwind.config.ts`

When implementing features, always consider the full pipeline from user interaction through AI processing to database storage and frontend display.
