# .agents

โฟลเดอร์นี้เก็บคำแนะนำสำหรับ AI coding agents (Antigravity, Copilot ฯลฯ) ที่ทำงานกับโปรเจกต์ MUMDERM

## Structure

```
.agents/
├── README.md              # ไฟล์นี้
├── rules/                 # กฎที่ agent ต้องปฏิบัติตาม
│   ├── project.md         # Workflow, naming, documentation
│   ├── frontend.md        # Vue 3, TypeScript, UI standards
│   └── backend.md         # Supabase, RLS, GAS, security
└── skills/                # Reusable multi-step workflows
    ├── bug-fix/           # ขั้นตอนแก้ bug อย่างเป็นระบบ
    ├── code-review/       # ขั้นตอน review code
    ├── database-change/   # สร้าง migration + RLS
    ├── release-checklist/ # Checklist ก่อน release version
    ├── safe-feature/      # เพิ่มฟีเจอร์โดยไม่ทำของเดิมพัง
    └── ui-design/         # สร้าง UI component ตาม convention
```

## Related Files

- `AGENTS.md` (root) — สรุปสั้นที่ agent อ่านก่อนเริ่มทำงาน
- `.github/copilot-instructions.md` — Instructions สำหรับ GitHub Copilot
- `doc/plan.md` — Version roadmap (source of truth)

