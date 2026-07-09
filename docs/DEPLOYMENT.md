# Deploying WEBRO AI to production

This guide takes your app from "runs on my laptop" to "live on the internet."
It assumes you've never deployed before. Follow it top to bottom.

There are only three moving parts:

1. **GitHub** — stores your code. (Already set up: `github.com/vishnu-keer/WEBRO_AI`.)
2. **Supabase (hosted)** — your production database. (Already set up — the schema
   is loaded and secured. Details below.)
3. **Vercel** — runs the web app and gives you a public URL.

The flow is: **push code to GitHub → Vercel builds it → paste in your keys → live.**

---

## 1. What's already done for you

- ✅ Your code is on GitHub (branch `main`).
- ✅ A hosted Supabase project exists — *"vishnu-keer's Project"*, region **Mumbai
  (ap-south-1)**.
- ✅ All database tables (17 of them) are created, with Row-Level Security on every
  one, plus the security hardening migrations.
- ✅ `vercel.json` (a secured daily background-worker job) and a GitHub Actions CI
  check (type-check + lint + build) are in the repo.
- ✅ Every AI page is set to allow up to 60 seconds so agent calls aren't cut off.

You mainly need to do **Vercel** now.

---

## 2. Create a Vercel account (one-time)

1. Go to https://vercel.com and click **Sign Up**.
2. Choose **Continue with GitHub** and authorize Vercel. (This lets Vercel see the
   repo it needs to deploy.)
3. Pick the **Hobby** plan (free). It's enough for WEBRO.

---

## 3. Push your latest code to GitHub

I just made changes (production config, security migrations, model fix). Save them
to GitHub so Vercel deploys the newest version. In your project terminal:

```bash
git add -A
git commit -m "Phase 10: production config, hosted DB migrations, security hardening"
git push
```

> If `git push` asks you to log in, use your GitHub username and a **Personal Access
> Token** (GitHub no longer accepts your password here). You can create one at
> GitHub → Settings → Developer settings → Personal access tokens.

---

## 4. Configure Supabase Auth for production

Your hosted database needs to know your app's web address, and (for a private
internal tool) it's simplest to let sign-ups log in immediately.

1. Open https://supabase.com/dashboard → your project **"vishnu-keer's Project"**.
2. Go to **Authentication → Sign In / Providers → Email** and, for now, turn
   **"Confirm email" OFF**. (This lets you and your team sign up and use the app
   right away, without clicking a confirmation email. You can turn it back on later.)
3. Go to **Authentication → URL Configuration**. You'll set the **Site URL** here in
   Step 8, once you know your Vercel address. (Leave it for now.)

---

## 5. Import the project into Vercel

1. On the Vercel dashboard, click **Add New… → Project**.
2. Find **WEBRO_AI** in the list of your GitHub repos and click **Import**.
3. Vercel auto-detects **Next.js** — leave the build settings as their defaults.
4. **Do not click Deploy yet.** First open the **Environment Variables** section
   (Step 6).

---

## 6. Add environment variables in Vercel (the important part)

In the **Environment Variables** panel, add each row below. For each: type the
**Name**, paste the **Value**, leave the environment as **All**, click **Add**.

| Name | Value | Where it comes from |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kqwlexoadswicyjckcgx.supabase.co` | Your hosted project (given here). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_QnZtqyQN9ku7VZVeBz_x6A_CTxJwizy` | Your hosted publishable key (given here — safe to expose). |
| `SUPABASE_SERVICE_ROLE_KEY` | *(copy from dashboard)* | Supabase → **Project Settings → API Keys → `service_role` / secret key** (`sb_secret_…`). **Secret — never put it in code.** |
| `FIRECRAWL_API_KEY` | *(your Firecrawl key)* | The same `fc-…` value from your local `.env.local`. |
| `LLM_PROVIDER` | `gemini` | Use the free Gemini provider. |
| `GEMINI_API_KEY` | *(your Gemini key)* | The same value from your local `.env.local`. |
| `CRON_SECRET` | *(generate one — see below)* | Protects the background-worker URL. |
| `NEXT_PUBLIC_APP_URL` | `https://localhost` for now | You'll replace this with your real URL in Step 8. |

Leave these **blank / skip** unless you use them: `GEMINI_MODEL` (defaults to
`gemini-2.0-flash`), `VOYAGE_API_KEY` (only for the RAG/knowledge features).

**Generate a `CRON_SECRET`** — run this in your terminal and paste the output as the
value (paste it into Vercel only, never into the repo):

```bash
openssl rand -hex 16
```

---

## 7. Deploy

Click **Deploy**. Vercel installs dependencies, builds, and publishes. This takes
1–3 minutes. When it's done you'll see **Congratulations** and a live URL like
`https://webro-ai-xxxx.vercel.app`.

---

## 8. After the first deploy: set your real URL

Now that you know your Vercel address, point the app and Supabase at it:

1. **Vercel → your project → Settings → Environment Variables:** edit
   `NEXT_PUBLIC_APP_URL` to your real URL (e.g. `https://webro-ai-xxxx.vercel.app`).
2. **Supabase → Authentication → URL Configuration:** set **Site URL** to that same
   URL, and add it under **Redirect URLs** too. Save.
3. **Redeploy** so the new value takes effect: Vercel → **Deployments** → the latest
   one → **⋯ → Redeploy**.

---

## 9. Smoke-test your live app

Open your Vercel URL and confirm the whole chain works in production:

1. You're sent to the sign-in page → click **Sign up** → create an account.
   (Because you turned off email confirmation, you're logged straight in and your
   workspace is auto-created.)
2. Go to **Audits** → paste a URL (e.g. `https://stripe.com`) → **Run audit**. Wait
   ~15–30s → the report appears.
3. Open the **Overview** dashboard → your audit shows in the activity feed, cost ~$0.
4. (Optional) Try a **Full workup** from **Workflows** on a real prospect.

---

## 10. Security check (confirm your data is walled off)

Your app uses Row-Level Security so each user only sees their own workspace. Quick
confirmation:

1. Sign up a **second** test account (use an incognito window).
2. From that second account, you should see an **empty** dashboard — none of the
   first account's audits/leads. That proves RLS is protecting your data.
3. In Supabase → **Advisors → Security**, you should see only two expected notices
   (the `vector` extension living in `public`, and `ensure_workspace` being callable
   by signed-in users — both are intentional and safe).

---

## 11. Changing things after launch (you can always change things)

Deployment is not the end — it's "version 1 published." To change anything:

- **Code / design / prompts / new agents:** edit the files → `git push`. Vercel
  automatically rebuilds and updates the live site in ~1–2 minutes.
- **Keys & settings** (e.g. swap Gemini → Claude): change the value in **Vercel →
  Settings → Environment Variables**, then redeploy. No code edit needed. (To use
  Claude: set `LLM_PROVIDER=anthropic` and add `ANTHROPIC_API_KEY`.)
- **Database changes** (a new table/column): add a migration file, and apply it to
  the hosted database. (I can apply migrations for you, or you can run
  `supabase db push` after linking the project.)
- **Safe experiments:** every branch/PR gets its own **preview URL**, so you can try
  changes before they touch the live site. If a change breaks something, Vercel →
  **Deployments** → pick a previous one → **Promote/Rollback** to restore it instantly.

---

## 12. Troubleshooting

- **Build fails on Vercel about a missing env var.** You skipped one in Step 6 (most
  often `SUPABASE_SERVICE_ROLE_KEY`). Add it, then redeploy.
- **"Missing required environment variables" when you run something.** Same cause —
  a server key isn't set in Vercel. Check the list in Step 6.
- **Sign-up seems to hang / asks to confirm email.** Turn off "Confirm email" in
  Supabase (Step 4), or check your inbox for the confirmation link.
- **A Full workup times out.** On the free plan a page can run for up to 60s. A
  6-step workup on a big site can exceed that — run the agents individually (each is
  well under the limit), or upgrade Vercel for a longer limit.
- **AI error "quota exceeded / 429".** You hit Gemini's free daily limit. Wait for
  the reset (midnight US Pacific) or add billing to your Google AI Studio key.

---

## 13. Costs

On these defaults, production is **$0/month**:

- **Vercel Hobby** — free.
- **Supabase Free** — free (one project; pauses after ~1 week of zero activity —
  just open the dashboard to wake it).
- **Gemini free tier** — free (~1,500 requests/day).
- **Firecrawl** — free tier.

You only start paying if you outgrow the free limits or switch to paid Claude.
