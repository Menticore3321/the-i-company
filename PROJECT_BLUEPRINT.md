<!-- AUTO-SYNC-START -->
## 🔄 Automated Verification & State Manifest (Auto-Updated)
> **Last Synchronized**: `2026-11-11T19:25:28.428Z`  
> **Active Git Commit**: `bf6d50a` (`main`) — *fix: set direct netlify functions endpoint as primary for live instagram extraction*  
> **Database Status**: `CONNECTED (Supabase PostgreSQL)`  
> **Android Native**: `SYNCHRONIZED (Capacitor Android)`  
> **Discovered Portals (3)**: `AdminMasterView.tsx`, `BrandPortalView.tsx`, `CreatorPortalView.tsx`  
> **Discovered Modals (5)**: `AddBrandModal.tsx`, `AddInfluencerModal.tsx`, `DealContractModal.tsx`, `InstagramInsightsModal.tsx`, `SmartCampaignGeneratorModal.tsx`  
<!-- AUTO-SYNC-END -->

# The I Company · Complete System Blueprint & Master Documentation

> **Official Agency Platform & Mobile Architecture**  
> *Last Updated: November 2026*  
> *Production Status: Live & Fully Synchronized*

---

## 1. Executive Summary & Live Endpoints

**The I Company** is a full-stack, enterprise-grade influencer marketing operating system designed for high-scale agency management. It unifies **Instagram telemetry intelligence**, **campaign escrow management**, **video draft approvals**, and **creator payouts** across three strictly isolated stakeholder portals.

| Asset | Endpoint / Location | Details |
| :--- | :--- | :--- |
| **Live Web App** | [`https://theicompany.netlify.app`](https://theicompany.netlify.app) | Production web deployment on Netlify |
| **GitHub Repo** | [`https://github.com/Menticore3321/the-i-company`](https://github.com/Menticore3321/the-i-company) | Source code & automated CI/CD pipelines |
| **Cloud Database** | [`https://kjbxdvuimukxvxrhhego.supabase.co`](https://kjbxdvuimukxvxrhhego.supabase.co) | Supabase PostgreSQL in South Asia (Mumbai) |
| **Android APK** | [GitHub Actions Workflow Runs](https://github.com/Menticore3321/the-i-company/actions) | `The-I-Company-Debug-APK` generated via Cloud CI |

---

## 2. Design System: Minimal Vintage Aesthetic

The application strictly uses a tactile **Minimal Vintage** visual philosophy inspired by classical ateliers, financial ledgers, and editorial magazines:

* **Background Canvas**: Warm Alabaster Cream (`#FBF9F5`, secondary `#F7F4EE`)
* **Typography**:
  * Serif Headlines: *Newsreader* & *Instrument Serif* (`font-serif`)
  * Data & UI Labels: Clean sans-serif with subtle tracking (`font-sans`)
* **Card & Borders**: Tactile paper cards with micro-borders (`#E7E2DA`, border hover `#D6CFBF`)
* **Accents & Status Badges**:
  * Forest Green (`#2E523E` / bg `#E8EFEA`): Active status, approved deliverables, live campaigns
  * Terracotta / Rust (`#C25E3E` / bg `#FDF3EF`): Escrow holds, pending reviews, warnings
  * Antique Brass (`#8A6B32` / bg `#FAF4E8`): VIP creators, high tier brands
  * Deep Ink Charcoal (`#1C1917`): High-contrast buttons, footer, dark accents

---

## 3. Three-Tier Role Isolation & Authentication Architecture

No two stakeholders see each other's data. Everything is strictly partitioned by `currentUser.role`:

```
                           [ Login Gateway (LoginView.tsx) ]
                                          |
                +-------------------------+-------------------------+
                |                         |                         |
       [ Role: 'agency' ]         [ Role: 'brand' ]       [ Role: 'influencer' ]
                |                         |                         |
        Admin Master Deck         Brand Client Portal        Creator Studio
     (AdminMasterView.tsx)      (BrandPortalView.tsx)    (CreatorPortalView.tsx)
```

### A. Super Admin Portal (`agency`)
* **Roster Management**: Deep Instagram telemetry on creators (followers, reel views, authenticity score, dynamic rate cards).
* **Brand Directory**: Brand onboarding, total spend tracking, and escrow ledger.
* **Campaign & Escrow Desk**: Real-time campaign tracking, GMV ledger, and milestone releases.
* **Credentials Directory**: Master table of all generated logins, passwords, and status controls.
* **Regional Intelligence**: Geographic heat-map of audience distribution across India & globally.
* **Financial Ledger**: GMV, retained agency margin (20%), creator disbursements, escrow holdings.

### B. Brand Client Portal (`brand`)
* **Strictly Scoped**: The client only sees campaigns associated with their own `brandId` (e.g. Nothing India only sees Nothing campaigns).
* **Deliverable Review Desk**: View submitted creator video/reel URLs with 1-click **Approve Content**.
* **Zero Margin Exposure**: Client cannot see the agency's backend creator payout or profit margin.

### C. Creator Studio (`influencer`)
* **Strictly Scoped**: The creator only sees tasks assigned to their handle (e.g. `@techburner`).
* **Contracted Tasks**: View deliverable requirements (Reel, Story, Carousel) and due dates.
* **Submission Desk**: Submit live Instagram Reel / draft Google Drive URLs.
* **Escrow Wallet**: View locked escrow vs released balance, with a 1-click **Request Instant Payout** button.

---

## 4. Codebase Directory Map & File Navigation

```
the-i-company/
├── .github/
│   └── workflows/
│       └── android-build.yml       # Automated GitHub Actions workflow for cloud APK compilation
├── android/                        # Capacitor Android native project (Gradle, Manifest, Java)
├── supabase/
│   └── schema.sql                  # PostgreSQL migration (tables, RLS policies, indexes)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginView.tsx       # Vintage authentication screen with 1-click demo access pills
│   │   ├── modals/
│   │   │   ├── AddInfluencerModal.tsx        # Creator onboarding + auto credential generator
│   │   │   ├── AddBrandModal.tsx             # Brand onboarding + copyable credentials packet
│   │   │   ├── InstagramInsightsModal.tsx    # Deep profile telemetry & audience charts
│   │   │   └── SmartCampaignGeneratorModal.tsx # AI proposal builder based on budget & niche
│   │   ├── views/
│   │   │   ├── AdminMasterView.tsx           # 6-tab Master Admin Deck
│   │   │   ├── BrandPortalView.tsx           # Client Brand Portal
│   │   │   └── CreatorPortalView.tsx         # Creator Studio & Escrow Wallet
│   │   └── vintage/
│   │       └── VintageHeader.tsx             # Editorial header with role badge & status indicator
│   ├── lib/
│   │   ├── databaseService.ts      # Hybrid cloud/local persistence with snake<->camel serialization
│   │   ├── mockData.ts             # Initial rich seed data (8 creators, 4 brands, 4 campaigns)
│   │   └── supabase.ts             # Supabase JS client initializer with offline fallback
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (Influencer, Brand, Campaign, UserAccount)
│   ├── App.tsx                     # Root orchestrator: state, routing, persistence hooks, modal triggers
│   └── main.tsx                    # React DOM entry point
├── capacitor.config.ts             # Capacitor config bound to https://theicompany.netlify.app
├── package.json                    # Dependencies & scripts
└── .env                            # Supabase cloud credentials
```

---

## 5. Central Cloud Database (Supabase PostgreSQL)

### Database Connection
* **Project URL**: `https://kjbxdvuimukxvxrhhego.supabase.co`
* **Region**: South Asia (Mumbai) - `ap-south-1`
* **Key Configuration**:
  ```env
  VITE_SUPABASE_URL=https://kjbxdvuimukxvxrhhego.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_2eGGW_HL2ghKD7QLH5gNiQ_Ja1QAAfY
  ```

### Tables & Schema
1. **`accounts`**: User login credentials (`id`, `email`, `password`, `role`, `name`, `associated_id`, `status`).
2. **`influencers`**: Creator telemetry (`handle`, `followers`, `rates`, `audience` JSONB, `trajectory` JSONB).
3. **`brands`**: Brand clients (`name`, `logo`, `industry`, `total_spent`, `escrow_balance`).
4. **`campaigns`**: Campaign briefs (`name`, `brand_id`, `budget`, `deliverables` JSONB, `status`).
5. **`financials`**: Master agency escrow and revenue ledger (`total_gmv`, `escrow_held`, `recent_transactions`).

### Hybrid Persistence Engine (`databaseService.ts`)
* If Supabase credentials are present, all reads/writes talk to **PostgreSQL**.
* If offline or keys missing, it falls back to **LocalStorage** without crashing.
* Includes bidirectional case conversion (`toSnakeCase` for PostgreSQL columns, `toCamelCase` for React components).
* Automatically **auto-seeds** tables with initial mock data on first run if empty.

---

## 6. Android Mobile Application (.APK) & OTA Live Updates

### Capacitor Native Binding
In [`capacitor.config.ts`](file:///c:/Users/deepa/Downloads/Influencer%20Dashboard/capacitor.config.ts):
```typescript
const config: CapacitorConfig = {
  appId: 'com.theicompany.app',
  appName: 'The I Company',
  webDir: 'dist',
  server: {
    url: 'https://theicompany.netlify.app',
    cleartext: true
  }
};
```

### Over-The-Air (OTA) Instant Synchronization
Because `server.url` points to `https://theicompany.netlify.app`, whenever you update the web app on Netlify, **all installed mobile apps instantly reflect the latest updates** without requiring users to download a new `.apk`!

### Cloud APK Compilation (GitHub Actions)
Located in [`.github/workflows/android-build.yml`](file:///c:/Users/deepa/Downloads/Influencer%20Dashboard/.github/workflows/android-build.yml):
* **Trigger**: Any push to `main` or manual trigger via `workflow_dispatch`.
* **Environment**: Ubuntu Linux with **Node.js 22 LTS**, **JDK 21**, and **Gradle 8.14**.
* **Output**: Downloadable `The-I-Company-Debug-APK` zip containing `app-debug.apk`.

---

## 7. Developer Quickstart: How to Make Changes

### Running Locally
```powershell
npm install
npm run dev
# Server starts at http://localhost:3000
```

### Deploying Updates to Web (Netlify)
1. Run local build:
   ```powershell
   npm run build
   ```
2. Upload the updated `dist/` folder to the Netlify dashboard under the **Deploys** tab.
3. Live changes reflect immediately on both web (`https://theicompany.netlify.app`) and mobile phones!

### Triggering a New Android APK Build
1. Make your changes and commit:
   ```powershell
   git add .
   git commit -m "feat: your new feature"
   git push origin main
   ```
2. Open [`https://github.com/Menticore3321/the-i-company/actions`](https://github.com/Menticore3321/the-i-company/actions).
3. The **"Build Android APK"** job will run (~2.5 mins) and generate the fresh `app-debug.apk` in **Artifacts**.

---

## 8. Demo Credentials Quick Reference

| Role | Name / Brand | Email | Password | Scoped Access |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | The I Company Master | `agency@theicompany.com` | `admin` | Full Master Deck (All tabs, Escrow, Credentials) |
| **Brand Client** | Nothing India Team | `nothing@india.com` | `brand` | Nothing Phone (3) launch campaigns only |
| **Brand Client** | Boat Lifestyle | `boat@lifestyle.com` | `brand` | Boat audio campaigns & deliverables only |
| **Creator** | Shlok Srivastava | `shlok@techburner.in` | `creator` | @techburner contracted tasks & wallet payouts |
| **Creator** | Komal Pandey | `komal@pandey.in` | `creator` | @komalpandeyofficial fashion briefs & wallet |

