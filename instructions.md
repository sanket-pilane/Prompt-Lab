# Agentic AI Build Prompt: Prompt To JSON App

Copy this full prompt into your AI coding agent. It is based on the analyzed `prompt-to-json.zip` application and asks the agent to rebuild the same core product with a cooler, production-grade UI, animations, deployment setup, and standard GitHub workflow.

---

## Prompt

You are a senior full-stack product engineer, UI designer, and DevOps-aware coding agent. Build a production-grade web application named **Prompt To JSON**.

The application must recreate the same core functionality as the reference app:

- A dark, premium AI Studio style web app that converts rough image-generation prompts into detailed structured JSON.
- A chat-like interface where the user can enter a prompt, upload one or more reference images, choose an aspect ratio, and submit.
- The app first analyzes the user request and decides which JSON fields are relevant.
- The app then generates a rich structured JSON prompt payload for an image model.
- The app then generates an image from the final `master_prompt`.
- The assistant response shows generation progress, the generated image, and an expandable formatted JSON block.
- Clicking the generated image opens a fullscreen modal with zoom behavior.
- The app must keep the same general font personality as the original: clean sans text, mono technical UI text, bold compressed display headings, and an elegant serif accent.

Use the following font direction:

- `Inter` for body and general UI.
- `JetBrains Mono` for prompts, JSON, labels, and technical UI.
- `Anton` or a similar bold compressed display face for the large "TO JSON" title.
- `Playfair Display` or a similar elegant serif italic for the "PROMPT" title.

## Recommended Tech Stack

Use this stack unless there is a strong project reason not to:

- Next.js App Router with TypeScript.
- React.
- Tailwind CSS.
- Framer Motion or `motion` for animations.
- `lucide-react` for icons.
- `react-syntax-highlighter`, Monaco, or a lightweight JSON viewer for formatted JSON.
- Zod for input and API response validation.
- Google Gemini API using `@google/genai`.
- Server-side API routes for all Gemini calls. Do not expose API keys to the browser.
- Optional persistence with PostgreSQL/Supabase/Neon or local IndexedDB for a lightweight version.
- Jest/Vitest plus React Testing Library for unit tests.
- Playwright for critical end-to-end tests.

## Core Product Requirements

Build the app as an actual usable product, not a landing page.

### Main Screen

The first screen should be the application workspace.

Include:

- Full-height dark interface.
- Subtle dotted/grid background similar to the reference app.
- Large animated hero title when there are no messages:
  - `PROMPT` in serif italic, yellow.
  - `TO JSON` in bold compressed display font, yellow.
- Subtitle: `Enhance your image prompts with Gemini`.
- Bottom prompt composer fixed/sticky near the bottom.

### Prompt Composer

The composer must include:

- Multi-line auto-growing textarea.
- Image upload button with preview thumbnails.
- Remove button for each uploaded image.
- Aspect ratio selector with:
  - `1:1`
  - `3:4`
  - `4:3`
  - `9:16`
  - `16:9`
- Submit button with send icon.
- Enter submits, Shift+Enter inserts a new line.
- Disable submit while generating.
- Clear loading and error states.

### Generation Flow

When the user submits:

1. Add the user message to the chat.
2. Add an assistant generation message with state `Writing JSON...`.
3. Call a server API route to select relevant JSON fields.
4. Call a server API route to generate structured JSON.
5. Update the assistant message with expandable JSON and state `Rendering Image...`.
6. Call a server API route to generate the image.
7. Display the final image and keep the JSON attached.

### JSON Field Selection

Implement a field selector step that chooses relevant fields from:

```txt
image_type
overall_style
composition
subjects
appearance
wardrobe
environment
lighting
color_palette
background
technical_traits
artistic_elements
typography
master_prompt
```

`master_prompt` must always be included.

### JSON Schema

Generate a structured payload with these possible fields:

- `image_type`
- `overall_style`
- `composition`
  - `framing`
  - `orientation`
  - `camera_angle`
  - `perspective`
  - `rule_of_thirds`
  - `depth`
- `subjects`
  - `count`
  - `description`
  - `pose`
  - `expression`
  - `gaze`
  - `emotion`
- `appearance`
  - `hair`
    - `color`
    - `length`
    - `texture`
  - `makeup`
    - `style`
    - `details`
- `wardrobe`
  - `top`
    - `type`
    - `color`
    - `fit`
    - `texture`
  - `bottom`
    - `type`
    - `color`
    - `fit`
    - `texture`
- `environment`
  - `setting`
  - `landscape`
  - `vegetation`
  - `season`
  - `sky`
- `lighting`
  - `type`
  - `direction`
  - `quality`
  - `highlights`
  - `shadows`
- `color_palette`
  - `dominant_colors`
  - `accent_colors`
  - `overall_tone`
  - `saturation`
- `background`
  - `depth_of_field`
  - `focus`
  - `atmosphere`
- `technical_traits`
  - `lens_look`
  - `sharpness`
  - `noise`
  - `post_processing`
- `artistic_elements`
  - `mood`
  - `aesthetic`
  - `storytelling`
  - `visual_style`
- `typography`
  - `present`
  - `text_content`
- `master_prompt`

Only require the fields selected by the field selector, but allow the response to include useful optional fields.

## AI Prompting Logic

Use this system behavior for JSON generation:

```txt
You are an expert AI Prompt Engineer and Technical Art Director. Your objective is to take messy, colloquial user requests and a desired style, and transform them into a highly detailed, professional JSON prompt payload for an advanced image generation model.

The target image model excels at:
1. Clear typography and readable text rendering.
2. Physics-accurate lighting, volumetric rays, and lifelike shadows.
3. Realistic PBR materials and high-fidelity textures.
4. Advanced camera compositions such as isometric views, macro photography, cinematic wide shots, editorial portraits, and product renders.

Your task:
1. Analyze the user's request and any uploaded reference images.
2. Extrapolate missing visual details that improve quality while respecting the user's intent.
3. If text is requested in the image, preserve the exact text inside the typography field.
4. Synthesize all details into a final master_prompt string.
5. Return strict JSON only. No markdown, no commentary.
```

Use this behavior for field selection:

```txt
You are an expert in AI photography and structured image prompting.

Given the user's request and optional reference images, choose only the most relevant fields from this list:

image_type, overall_style, composition, subjects, appearance, wardrobe, environment, lighting, color_palette, background, technical_traits, artistic_elements, typography, master_prompt

Rules:
- master_prompt must always be included.
- Include subjects when people, animals, characters, or objects are central.
- Include wardrobe when clothing, fashion, uniforms, costumes, or styling are relevant.
- Include typography only when the user asks for visible text, logos, labels, posters, UI text, signs, packaging text, or lettering.
- Include technical_traits when camera, lens, render engine, photo quality, style, or post-processing is mentioned or strongly implied.
- Omit fields that do not affect the request.
- Return strict JSON with a required_fields array.
```

## Production Architecture

Do not put Gemini calls directly in client components.

Implement:

- `app/api/ai/select-fields/route.ts`
- `app/api/ai/generate-json/route.ts`
- `app/api/ai/generate-image/route.ts`

Each route must:

- Validate request body with Zod.
- Read `GEMINI_API_KEY` from server environment variables.
- Return typed JSON responses.
- Handle provider errors gracefully.
- Avoid leaking secrets, raw stack traces, or full provider error dumps to the client.
- Use reasonable request size limits for uploaded images.

Add:

- `.env.example`
- `README.md`
- `CONTRIBUTING.md`
- `LICENSE` if appropriate.
- Production-safe error boundaries.
- Loading skeletons or progressive generation states.
- ESLint and TypeScript strict settings.
- A health check route if deploying to a platform that benefits from one.

## Enhanced Features

Add these features beyond the original app:

- Copy JSON button.
- Copy `master_prompt` button.
- Download JSON as `.json`.
- Download generated image as `.png`.
- Regenerate image from the same JSON.
- Edit JSON before regenerating.
- Prompt history sidebar with recent generations.
- Local draft persistence so refresh does not wipe the current prompt.
- Toast notifications for copy, download, errors, and successful generation.
- Keyboard shortcuts:
  - `Enter` to submit.
  - `Shift+Enter` for newline.
  - `Esc` to close fullscreen modal.
- Drag-and-drop image upload.
- Image upload validation with friendly errors.
- Empty, loading, error, and success states.
- Optional dark/light theme toggle, but keep dark mode as the primary brand.

## UI And Animation Direction

Keep the original visual DNA:

- Black background: near `#050505`.
- Primary accent: vivid yellow similar to `#FFCC00`.
- Text: near white, muted gray for secondary text.
- Sharp, editorial AI-lab feeling.
- Border-heavy panels with minimal radius.
- Technical mono labels.
- Large typographic hero.

Make it cooler and more polished:

- Add animated scanline or subtle grid movement.
- Add soft yellow glow on active controls.
- Add spring entrance animations for messages.
- Add animated progress stages:
  - `Analyzing request`
  - `Writing JSON`
  - `Rendering image`
  - `Finalizing`
- Add smooth fullscreen image modal transitions.
- Add tasteful hover states for buttons and thumbnails.
- Add animated JSON reveal.
- Add skeleton shimmer for image rendering.

Important UI constraints:

- Do not create a marketing landing page.
- The first viewport must be the working app.
- Keep controls compact, useful, and clear.
- Avoid decorative clutter.
- Do not let text overflow on mobile.
- Use icons for upload, send, copy, download, close, regenerate, history, and settings.
- Use accessible contrast and visible focus states.

## Security Requirements

- Never expose `GEMINI_API_KEY` to client-side code.
- Do not use `NEXT_PUBLIC_GEMINI_API_KEY` for provider calls.
- Validate MIME types and file sizes.
- Limit uploaded images.
- Sanitize user-visible errors.
- Add rate limiting or document how to enable it in production.
- Keep generated data private to the browser unless the user explicitly enables persistence.

## Testing Requirements

Add tests for:

- JSON schema builder.
- Field selector normalization that always includes `master_prompt`.
- API route validation.
- Prompt composer behavior.
- Image upload validation.
- Copy/download actions.
- Fullscreen modal open/close.

Add Playwright tests for:

- User can type a prompt and submit.
- Uploaded image preview appears.
- Generation progress states render.
- JSON panel can expand.
- Fullscreen image modal can open and close.

Mock Gemini API in automated tests. Do not call real provider APIs in CI.

## Deployment Requirements

Prepare the app for deployment to Vercel, Google Cloud Run, or another Node-capable host.

Include:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`

Create `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

Document deployment steps:

1. Install dependencies.
2. Create `.env.local`.
3. Add `GEMINI_API_KEY`.
4. Run local dev server.
5. Run lint, typecheck, tests, and production build.
6. Deploy.
7. Configure production environment variables.
8. Verify the deployed app.

## Standard GitHub Workflow

Follow this Git workflow from project initialization to release.

### Repository Setup

```bash
git init
git branch -M main
git add .
git commit -m "chore: initial production app scaffold"
git checkout -b develop
git push -u origin main
git push -u origin develop
```

### Branch Strategy

Use:

- `main` for production-ready releases.
- `develop` for integration work.
- `feature/<short-name>` for new features.
- `fix/<short-name>` for bug fixes.
- `chore/<short-name>` for tooling, docs, and maintenance.
- `release/<version>` for release preparation if needed.
- `hotfix/<short-name>` for urgent production fixes.

### Feature Workflow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/prompt-workspace

# make changes
npm run lint
npm run typecheck
npm run test
npm run build

git add .
git commit -m "feat: build prompt workspace"
git push -u origin feature/prompt-workspace
```

Open a pull request from `feature/prompt-workspace` into `develop`.

Before merging:

- CI must pass.
- At least one review should approve.
- No unresolved review comments.
- No secrets committed.

### Release Workflow

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
npm run lint
npm run typecheck
npm run test
npm run build
git commit --allow-empty -m "chore: prepare release v1.0.0"
git push -u origin release/v1.0.0
```

Open a pull request from `release/v1.0.0` into `main`.

After merge:

```bash
git checkout main
git pull origin main
git tag v1.0.0
git push origin v1.0.0
git checkout develop
git merge main
git push origin develop
```

## CI/CD Requirements

Create GitHub Actions workflow:

- Run on pull requests to `develop` and `main`.
- Run on pushes to `develop` and `main`.
- Install dependencies with `npm ci`.
- Run lint.
- Run typecheck.
- Run unit tests.
- Run build.
- Optionally run Playwright e2e tests with mocked APIs.

Protect branches:

- Require pull requests before merging into `main`.
- Require CI checks to pass.
- Require branch to be up to date.
- Disallow force pushes to `main`.
- Prefer squash merges for feature branches.

## Acceptance Criteria

The final app is complete when:

- The UI matches the original app's core identity but feels more polished and animated.
- Prompt input, image upload, aspect ratio selection, JSON generation, image generation, expandable JSON, and fullscreen modal all work.
- API keys are server-only.
- Copy/download/regenerate/history features work.
- The app is responsive on mobile, tablet, and desktop.
- Lint, typecheck, tests, and build pass.
- README includes clear local setup and deployment instructions.
- GitHub workflow and CI are documented and configured.

## Final Deliverables

Provide:

- Complete source code.
- `.env.example`.
- `README.md`.
- `CONTRIBUTING.md`.
- GitHub Actions CI workflow.
- Tests.
- Deployment instructions.
- A short summary of key improvements over the original reference app.

