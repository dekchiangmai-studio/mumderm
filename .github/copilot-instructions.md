# MUMDERM — Copilot Instructions

## Project Summary

MUMDERM เป็นเว็บแอปสำหรับถ่ายภาพสถานที่จริงตามมุม/กรอบที่กำหนด เพื่อสร้าง Daily Image และ Time-lapse ของสถานที่นั้น

## Critical Files to Read First

1. `doc/plan.md` — Version roadmap, spec, database model
2. `doc/PROJECT_PROMPT.md` — Product concept, tech stack, coding rules
3. `ARCHITECTURE.md` — System architecture, schema, security
4. `CHANGELOG.md` — What has been built per version

## Current State

- **Current version**: v0.4.0 (Capture / Upload MVP)
- **Next version**: v0.5.0 (Daily Image System)
- Versions v0.1.0 – v0.4.0 are implemented

## Tech Stack (Do Not Change Without Reason)

- **Frontend**: Vite + Vue 3 + TypeScript + Vue Router
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Image Storage**: Google Drive + GAS (MVP), abstracted via `ImageStorageService`

## Development Rules

### Before Writing Code

1. Read `doc/plan.md` and identify current version scope
2. Check existing architecture in `ARCHITECTURE.md`
3. Stay within current version scope — do not implement features from future versions
4. Review existing code before modifying files

### While Writing Code

- TypeScript strict, Composition API with `<script setup>`
- Separate UI, domain logic, services, and data access
- Components should not contain heavy business logic
- Reuse existing modules in `src/lib/` and `src/types/`
- Do not hardcode secrets — use environment variables
- Validate input on both client and server
- Mobile-first responsive design

### After Writing Code

1. Run `npm run typecheck` and `npm run lint` in `Frontend/`
2. Verify main routes work
3. Test mobile responsive
4. Test error, empty, and loading states
5. Summarize what was done and what was deferred

## Architecture Constraints

- **RLS on every table** — do not rely solely on frontend for access control
- **ImageStorageService abstraction** — do not couple domain logic to Google Drive directly
- **No secrets in frontend** — no service role keys, no Drive credentials
- **Database constraints > frontend assumptions** — e.g., daily image uniqueness

## What NOT to Add (Until Explicitly Asked)

Gacha, card system, marketplace, coins/wallet, ranking, social feed, chat, follow system, face recognition, AI auto-approval, native mobile app, advanced video editor

## Detailed Instructions

See `.github/instructions/` for context-specific rules:
- `frontend.instructions.md` — Frontend coding standards
- `backend.instructions.md` — Backend and database standards

