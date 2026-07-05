# Getting Started (for first-timers)

This guide assumes you have **never run a Next.js project before**. Follow it top
to bottom. Every command is explained, and every tool you need is listed.

---

## 1. The mental model — what are we even running?

Two programs run on your computer at the same time:

1. **The web app** (Next.js). This is the WEBRO dashboard you open in your browser
   at `http://localhost:3000`. ("localhost" just means "this computer".)
2. **The database** (Supabase). This stores users and audits. We run it *locally*
   inside **Docker** so you don't need a cloud account to start.

Your job is to install a few tools, paste in some keys, and start both programs.

---

## 2. Install these first (one-time)

### a) Node.js (required)
Node.js runs the web app. Next.js 16 needs **Node.js version 20.9 or newer**.

- Download the **LTS** version from https://nodejs.org and install it.
- `npm` (the tool that installs code libraries) comes bundled — nothing extra.
- **Check it worked** — open a terminal and run:
  ```bash
  node -v
  ```
  You should see `v20.9.0` or higher (e.g. `v22.x`). If it's lower, update Node.

> **What's a terminal?** A text window where you type commands.
> - **Windows:** open **PowerShell** (Start menu → type "PowerShell").
> - **Mac:** open **Terminal** (Cmd+Space → type "Terminal").

### b) Docker Desktop (required for the local database)
Supabase runs its database inside Docker.

- Download and install **Docker Desktop** from https://www.docker.com/products/docker-desktop
- **Open the Docker Desktop app and leave it running.** It must be running before
  you start the database. (You'll see a whale icon in your taskbar/menu bar.)

### c) API keys (required — two of them)
The audit agent calls two paid services. Create a key for each:

- **Anthropic (Claude)** — sign in at https://console.anthropic.com → **API Keys**
  → create a key. (Add billing/credits if prompted.) This lets the app "think".
- **Firecrawl** — sign up at https://www.firecrawl.dev → **Dashboard** → **API Keys**.
  This lets the app read/crawl the websites you audit.

> You do **not** need a Voyage key yet — that's only for later agents.

### d) A code editor (recommended)
**VS Code** (https://code.visualstudio.com) makes editing the config file easy.
Optional, but helpful.

### e) Supabase CLI — via Homebrew (needed from Step 3 onward)

The Supabase CLI runs the local database. On a Mac, install it with Homebrew:

```bash
brew install supabase/tap/supabase
```

You only need this once you set up the database. To just get the app to *start*,
you can skip it for now. (No Homebrew? Install it from https://brew.sh first.)

---

## 3. Open the project in a terminal

1. Open your terminal (PowerShell or Terminal).
2. Move into the project folder. Type `cd ` (with a space) then the folder path:
   ```bash
   cd path/to/WEBRO_AI
   ```
   (Tip: in VS Code, `File → Open Folder → WEBRO_AI`, then `Terminal → New Terminal`
   opens a terminal already in the right place.)

---

## 4. The README commands, one at a time

### Step 1 — `npm install`
```bash
npm install
```
Downloads every code library the project depends on (Next.js, Supabase, etc.) into
a `node_modules` folder. Takes a minute or two. **Run this once** (and again only if
the dependencies change).

### Step 2 — create your private config file
The project ships with `.env.example` (a template). Make your own copy called
`.env.local` (this is where your secret keys go; it's never shared):

- **Mac / Linux / PowerShell:**
  ```bash
  cp .env.example .env.local
  ```
- **Windows (Command Prompt):**
  ```bash
  copy .env.example .env.local
  ```
- Or just duplicate the file in VS Code and rename the copy to `.env.local`.

We'll fill it in during Step 4.

### Step 3 — start the local database
Make sure **Docker Desktop is running**, then:
```bash
npm run db:start
```
This boots Postgres + Auth locally (first run downloads Docker images — can take a
few minutes). When it finishes it **prints a list of values**. You need three:
```
API URL: http://127.0.0.1:54321      ->  NEXT_PUBLIC_SUPABASE_URL
anon key: eyJhbGciOi...              ->  NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role key: eyJhbGciOi...      ->  SUPABASE_SERVICE_ROLE_KEY
```
Copy each into `.env.local` (see Step 4). Keep this info; you can reprint it later
with `npx supabase status`.

### Step 4 — fill in `.env.local`
Open `.env.local` and set:

| Variable | What it is | Where it comes from |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your local DB address | `db:start` output (API URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public app key | `db:start` output (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (server only) | `db:start` output (service_role key) |
| `ANTHROPIC_API_KEY` | Lets the app call Claude | console.anthropic.com |
| `FIRECRAWL_API_KEY` | Lets the app crawl sites | firecrawl.dev |
| `NEXT_PUBLIC_APP_URL` | The app's own address | leave as `http://localhost:3000` |
| `VOYAGE_API_KEY` | Embeddings (later agents) | leave blank for now |
| `CRON_SECRET` | Protects the background worker | leave blank for now |

Save the file.

### Step 5 — create the database tables
```bash
npm run db:reset
```
Runs our "migrations" (the SQL files in `supabase/migrations/`) to create all the
tables — workspaces, leads, audits, and so on. Run this whenever migrations change.

### Step 6 — generate database types (recommended)
```bash
npm run db:types
```
Reads your database and writes exact TypeScript types into `src/types/database.ts`,
so the editor knows the shape of your data. Optional, but nice.

### Step 7 — start the web app
```bash
npm run dev
```
Starts the Next.js **development server**. Leave this running. When you see
"Ready", open **http://localhost:3000** in your browser.

> You can run `db:start` once (it stays running in the background) and then keep
> `npm run dev` in the foreground. To stop the app press `Ctrl + C`. To stop the
> database later: `npm run db:stop`.

---

## 5. Try it

1. Open **http://localhost:3000** → you'll be sent to the sign-in page.
2. Click **Sign up**, create an account (this auto-creates your workspace).
3. In the left menu click **Audits**.
4. Paste a website URL (e.g. `https://stripe.com`) → **Run audit**.
5. Wait ~15–30 seconds. The full audit report appears.
6. (Optional) See the saved data: open Supabase Studio at
   **http://localhost:54323** → table `audits` (and `agent_runs` for the cost log).

---

## 6. If something goes wrong

- **`node -v` shows below 20.9, or npm errors with "EBADENGINE".** Your Node is too
  old. Install the current LTS from nodejs.org and retry.
- **`db:start` fails / "cannot connect to Docker".** Docker Desktop isn't running.
  Open the Docker app, wait for it to say "running", then retry.
- **Port already in use (3000 or 54321).** Something else is using it. Close it, or
  run the app on another port: `npm run dev -- -p 3001`.
- **The audit errors mentioning the model.** Your Anthropic account may not accept
  the id `claude-sonnet-5`. Open `src/config/models.ts` and set `reasoning` to a
  model your account supports, then retry.
- **"Not authenticated" when running an audit.** Make sure you signed up/logged in
  first (Step 5).
- **First audit is slow.** Normal — it crawls the site and then Claude analyzes it.

---

## 7. Prefer not to install Docker? (alternative)

You can use a free **cloud** Supabase project instead of the local one:

1. Create a project at https://supabase.com (free tier).
2. In the dashboard → **Project Settings → API**, copy the **Project URL**, **anon**
   key, and **service_role** key into `.env.local`.
3. Apply the schema: either run each file in `supabase/migrations/` inside the
   dashboard's **SQL Editor**, or link the CLI (`npx supabase link`) and
   `npx supabase db push`.
4. Skip `db:start` — just run `npm run dev`.

(If you'd like, I can wire up a cloud Supabase project for you — I have the tools to
create it and apply the migrations.)
