# Frontend Rules

## Tech Stack

- Vite + Vue 3 + TypeScript + Vue Router
- Composition API with `<script setup>` (ห้ามใช้ Options API)
- Pinia เมื่อ state ซับซ้อนจริง ๆ เท่านั้น
- Mobile-first responsive CSS

## Coding Standards

- TypeScript strict — ห้ามใช้ `any` โดยไม่จำเป็น
- แยก UI, domain logic, services อย่างชัดเจน
- Component ไม่ควรมี business logic หนัก — ย้ายไป `src/lib/` หรือ composables
- Reuse composables/services เมื่อมี pattern ซ้ำ
- อย่าสร้าง abstraction จำนวนมากโดยไม่มี use case

## File Organization

```
src/
├── assets/        # Static assets
├── components/    # Reusable components (PascalCase.vue)
├── data/          # Static/mock data
├── lib/           # Service layer (supabase, auth, image-storage, etc.)
├── router/        # Route definitions + auth guards
├── types/         # TypeScript interfaces/types
├── views/         # Page views (XxxView.vue, 1 per route)
├── App.vue
├── main.ts
└── style.css
```

## Supabase Client

- ใช้ singleton จาก `src/lib/supabase.ts`
- ตรวจ null ก่อนใช้ (client อาจเป็น null ถ้า env ไม่ได้ตั้ง)
- ห้าม import `createClient` ในที่อื่นนอกจาก `supabase.ts`

## Auth

- ใช้ `src/lib/auth.ts` — `initializeAuth()`, `useAuth()`, `signIn()`, `signUp()`, `signOut()`
- Router guard ตรวจ `meta.requiresAuth` อยู่แล้ว
- ห้ามเก็บ session/token ด้วยตัวเอง — ให้ Supabase SDK จัดการ

## Security

- ห้ามใส่ secret ใด ๆ ใน frontend code
- Environment variables ที่เปิดเผยได้ใช้ prefix `VITE_`
- ห้ามใช้ Supabase service role key ใน frontend

## Validation

ก่อน commit ต้อง:

```bash
cd Frontend
npm run typecheck
npm run lint
npm run build
```

## UI/UX

- Mobile-first เสมอ — ทดสอบ responsive
- จัดการ loading, error, empty states ทุก page
- ให้ "ภาพ" เป็นพระเอกของ UI — ออกแบบเรียบ สะอาด

