# Prompt To JSON

A premium dark-themed AI Studio web app that converts rough image-generation prompts into detailed structured JSON, and generates images based on the enhanced prompt. Built with Next.js App Router, Tailwind CSS, Framer Motion, and the Google Gemini API.

## Key Improvements Over Reference App
- **Animations:** Integrated Framer Motion for smooth transitions, list animations, and a polished modal experience.
- **UI Experience:** Added a grid/scanline background, sticky bottom composer with auto-scaling textbox, and refined typographic hierarchy based on Inter, JetBrains Mono, Anton, and Playfair Display fonts.
- **Robust Field Selection:** Ensures `master_prompt` is unconditionally preserved while intelligently pruning irrelevant JSON nodes to reduce noise.
- **Persistence:** Local history is saved securely via IndexedDB `idb-keyval`, keeping drafts and past generations alive across refreshes.
- **API Security:** All Gemini calls are executed server-side via Next.js API Routes ensuring no secret exposure.

## Setup Instructions

1. Clone the repository and navigate into the app directory:
   ```bash
   cd "Prompt to Json/app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   Copy `.env.example` to `.env.local` and add your valid Google Gemini API Key.
   ```bash
   # .env.local
   GEMINI_API_KEY=AIzaSy...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is ready for Vercel, Google Cloud Run, or any Node-capable host. Ensure `GEMINI_API_KEY` is added to your environment variables on your platform of choice.

## Technologies
- Next.js 15
- React 19
- Tailwind CSS v4
- Google Gen AI SDK (`@google/genai`)
- Framer Motion
- Zod
- lucide-react
