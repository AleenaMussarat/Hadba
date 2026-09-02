# Deploying the Strapi CMS to Railway

The frontend deploys to Vercel from this repo. The Strapi CMS in `./cms` deploys
to Railway as a separate service, backed by Railway Postgres and a Railway volume
for uploaded media.

Two things differ from local development:

- **Database:** local uses SQLite (`cms/.tmp/data.db`); Railway uses Postgres.
  [cms/config/database.js](cms/config/database.js) already switches on
  `DATABASE_CLIENT`, so this is just env vars.
- **Uploads:** Railway's container filesystem is wiped on every redeploy, so
  `cms/public/uploads` must live on a mounted **volume**.

---

## 1. Create the Railway project

1. https://railway.app → **New Project → Deploy from GitHub repo** → pick this repo.
2. Railway creates one service from the repo. Open it → **Settings**:
   - **Root Directory:** `cms`
   - **Build / Start commands:** leave blank — [cms/railway.json](cms/railway.json)
     sets them (`npm ci && npm run build`, then `npm run start`).
3. In the project, **New → Database → Add PostgreSQL**.

## 2. Add a volume for uploads

On the Strapi service → **Settings → Volumes → New Volume**:

- **Mount path:** `/app/public/uploads`

(Root directory is `cms`, so the container's working dir is `/app` and Strapi
writes uploads to `/app/public/uploads`. `npm run start` runs
`mkdirSync('public/uploads')` first, so the folder is always present.)

## 3. Environment variables

Strapi service → **Variables**. Paste these (the `${{Postgres.*}}` refs are
Railway's — they auto-resolve to the Postgres service):

```
NODE_ENV=production

DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false

PUBLIC_URL=${{RAILWAY_PUBLIC_DOMAIN}}
IS_PROXIED=true

APP_KEYS=<generate>
API_TOKEN_SALT=<generate>
ADMIN_JWT_SECRET=<generate>
JWT_SECRET=<generate>
TRANSFER_TOKEN_SALT=<generate>
ENCRYPTION_KEY=<generate>
```

> `PUBLIC_URL=${{RAILWAY_PUBLIC_DOMAIN}}` resolves to a bare host with no
> scheme. If Strapi complains, set it explicitly to
> `https://<your-service>.up.railway.app` instead.

**Generating the secrets** — run locally, once, and paste the output:

```powershell
node -e "for (const k of ['APP_KEYS','API_TOKEN_SALT','ADMIN_JWT_SECRET','JWT_SECRET','TRANSFER_TOKEN_SALT','ENCRYPTION_KEY']) console.log(k+'='+(k==='APP_KEYS' ? [0,0].map(()=>require('crypto').randomBytes(16).toString('base64')).join(',') : require('crypto').randomBytes(16).toString('base64')))"
```

You can reuse the values already in `cms/.env` if you prefer — they are valid
secrets — but generating fresh ones for production is cleaner. If you change
`ADMIN_JWT_SECRET` later, all admins are logged out; if you change
`ENCRYPTION_KEY` after data exists, encrypted fields become unreadable.

**Email** (reservation notifications) — add whenever you wire up SMTP:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=aleenamussarat@gmail.com
SMTP_PASSWORD=<gmail app password>
SMTP_FROM=aleenamussarat@gmail.com
```

(These names match [cms/config/plugins.js](cms/config/plugins.js). For Gmail,
`SMTP_PASSWORD` must be an App Password, not the account password.)

## 4. Generate the public domain

Strapi service → **Settings → Networking → Generate Domain** (port `1337`).
That gives you `https://<something>.up.railway.app`. This is your CMS URL.

## 5. Deploy and initialise

Railway builds on push. Watch **Deployments** for the first build (Strapi builds
the admin panel — a few minutes).

When it's live:

1. Open `https://<your-service>.up.railway.app/admin` and create the admin user.
2. Recreate content types if this is a fresh database — or import from local
   (see "Moving existing data" below).
3. **Settings → Users & Permissions → Roles → Public** — enable `find` / `findOne`
   on the collection types the site reads (menu-category, menu-item,
   carousel-slide, branch, gallery-image, page-hero, and the settings single
   types), and `create` on `inquiry` for the reservation form.

## 6. Point Vercel at Railway

Vercel project → **Settings → Environment Variables**:

```
VITE_STRAPI_URL = https://<your-service>.up.railway.app
```

**Redeploy** — Vite inlines this at build time, so an env change alone does
nothing until the next build.

CORS: [cms/config/middlewares.js](cms/config/middlewares.js) already allows
`https://samdan.vercel.app` and `http://localhost:5173`. Add any other frontend
origin (preview URLs, a custom domain) there and redeploy the CMS.

---

## Moving existing data from local SQLite

If you have content in the local Strapi you want on Railway, easiest path is
Strapi's transfer:

```powershell
# with the local Strapi able to reach Railway
cd cms
npx strapi transfer --to https://<your-service>.up.railway.app/admin --to-token <TRANSFER_TOKEN>
```

Create the transfer token in the local admin under **Settings → Transfer Tokens**,
and make sure `TRANSFER_TOKEN_SALT` matches between the two. Alternatively use
`npx strapi export` locally then `npx strapi import` against Railway.

## Cost

Railway is usage-based on top of the **$5/month Hobby** plan (which includes $5
of usage credit). A low-traffic Strapi + small Postgres + tiny volume typically
runs **$8–15/month** total. Watch the project's **Usage** tab the first week.

## Redeploys

Every push to the repo's default branch redeploys **both**: Vercel rebuilds the
site, Railway rebuilds the CMS. The Postgres data and the uploads volume persist
across CMS redeploys — only the container filesystem is replaced.
