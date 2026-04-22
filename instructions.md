# PromptOasis (Prompt.Lab) - Development & Agent Instructions

## Overview
PromptOasis is a professional-grade prompt gallery for AI media generation (Image, Video, 3D, Audio). It uses a "Bold Typography" / "Brutalist" design aesthetic designed to feel like a high-performance technical archive.

## Core Features
- **Prompt Gallery**: A grid-based archive of curated prompts.
- **Categorization**: Multi-engine support (Stable Diffusion, Midjourney, Sora, Runway, etc.) across various media types.
- **Archive System**: Each prompt has a unique ID (e.g., `001`) and is treated as a record in a database.
- **Detail Extraction**: A side-drawer panel that reveals the "Raw Prompt", "Negative Constraints", and mechanical metadata (CFG, Seed, Motion, etc.).
- **User Vault**: A client-side favorites system (localStorage) to save high-utility prompts.
- **Search & Filtering**: Instant, client-side search across title, prompt text, and engine names.

## Technical Architecture
- **Framework**: React 18+ (TSX).
- **Styling**: Tailwind CSS 4 with a custom Brutalist theme (Zinc-950 palette).
- **Animation**: `motion/react` for drawer transitions and grid layouts.
- **State Management**: React `useState` and `useMemo` for real-time filtering.
- **Storage**: `localStorage` for user favorites.

## Instructions for AI Agents (The Agent Protocol)

### 1. Design Integrity (CRITICAL)
- **Aesthetic**: Maintain the "Brutalist / Technical Archive" look.
- **Typography**: Always use uppercase for metadata, mono fonts for technical strings, and bold italic headings for titles.
- **Colors**: Stick to the Zinc palette (`bg-zinc-950`, `surface-zinc-900`, `border-zinc-800`). Do NOT use soft shadows or rounded corners (this app uses sharp 90-degree edges).
- **Labels**: Use technical "Index" style labels (e.g., `DATE_CREATED`, `ENGINE_TYPE`).

### 2. Data Structure
- When adding new prompts, refer to `src/data.ts`.
- Every prompt must follow the `Prompt` interface in `src/types.ts`.
- Parameters should be stored as a key-value record to allow for engine-specific metadata.

### 3. Component Pattern
- **Drawer**: The Detail view is a side-drawer. Do NOT convert it to a modal or a separate page unless requested.
- **Grid**: The gallery is a responsive grid (`grid-cols-1` to `lg:grid-cols-3`). Preserve the `layout` prop on `motion.div` to ensure smooth filtering animations.

### 4. Code Standards
- Use **functional components** and **React.FC** with explicit types.
- Ensure all icons are from `lucide-react`.
- When adding interactive elements, always consider the "Invert" or "High-Contrast" hover state (e.g., black text on white background vs. white text on black).

## Planned Evolutions
- **Submission Flow**: Plans for a multi-step form to allow users to submit their own prompts.
- **Cloud Sync**: Integration with Firebase for cross-device synchronization and community voting.
- **AI Tagger**: Using Gemini API to automatically categorize or "beautify" raw user prompts.
