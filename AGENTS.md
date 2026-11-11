# The I Company · Workspace Agent Directives & Context Preservation

> **MANDATORY INSTRUCTIONS FOR ANY AI AGENT WORKING ON THIS REPOSITORY**  
> *Do NOT ignore these rules under any circumstances.*

---

## 1. Context Preservation & Auto-Sync Rule
Whenever opening this project or returning after any time:
1. **Never guess the system state from memory or outdated assumptions.** Always read:
   - [`SYSTEM_STATE.json`](file:///./SYSTEM_STATE.json) (Current live machine-readable snapshot)
   - [`PROJECT_BLUEPRINT.md`](file:///./PROJECT_BLUEPRINT.md) (Master architectural documentation)
2. **Automated Documentation Updates**: Whenever you modify or add any components (views, modals, database columns, services):
   - You MUST run `npm run verify` (or `npm run build`).
   - This automatically runs `scripts/sync-architecture.js`, which refreshes `SYSTEM_STATE.json` and updates the verification stamp in `PROJECT_BLUEPRINT.md` with the latest git commit, portals, modals, and integrity status.
   - Do NOT edit the auto-generated section between `<!-- AUTO-SYNC-START -->` and `<!-- AUTO-SYNC-END -->` manually.

---

## 2. Core Architectural Invariants (Never Break These)

### A. Strict Three-Tier Role Isolation
- **Super Admin (`agency`)**: Full master access to Roster, Brands, Campaigns, Financial Ledger, and Credentials Directory.
- **Brand Client (`brand`)**: Strictly scoped to `currentUser.associatedId`. A brand client must NEVER see other brands or the agency's backend creator payout/margins.
- **Creator Studio (`influencer`)**: Strictly scoped to `currentUser.associatedId`. Creators only see their contracted tasks, deliverables, and wallet balance.

### B. Hybrid Cloud Database (`src/lib/databaseService.ts`)
- All database operations MUST go through `databaseService.ts`.
- Uses Supabase PostgreSQL in South Asia (Mumbai).
- Automatically converts between PostgreSQL `snake_case` table columns and TypeScript `camelCase` model properties via `toSnakeCase()` and `toCamelCase()`.
- Always preserves graceful offline fallback to `localStorage` so the application never crashes if offline.

### C. Minimal Vintage Aesthetics
- Maintain warm cream `#FBF9F5`, paper card borders `#E7E2DA`, editorial serif typography, and natural status badges (`#2E523E` forest green, `#C25E3E` terracotta).
- Avoid generic neon dark modes or standard flat corporate templates.

---

## 3. Pre-Flight Verification Command
Before declaring any task or feature completed, always run:
```powershell
npm run verify
```
This verifies:
1. Architecture manifest auto-synchronization
2. Zero TypeScript compile errors (`tsc --noEmit`)
3. Supabase configuration integrity
4. Android Capacitor & CI/CD workflow health

