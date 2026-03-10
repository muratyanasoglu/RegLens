## Database Setup Guide (MySQL + Prisma + Next.js)

This document explains **from zero to working** how to connect the RegLens app to a MySQL database using Prisma.

---

### 1. Install MySQL locally

You can use any MySQL 8.x distribution (MySQL Server, MariaDB-compatible, Docker, etc.).

**Option A – Local MySQL server**

1. Download and install MySQL Community Server (or use MySQL Workbench installer).
2. Create a user and database, for example:

```sql
CREATE DATABASE reglens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'reglens_user'@'127.0.0.1' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON reglens.* TO 'reglens_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

**Option B – Docker (example)**

```bash
docker run -d \
  --name reglens-mysql \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=reglens \
  -e MYSQL_USER=reglens_user \
  -e MYSQL_PASSWORD=strong_password_here \
  -p 3306:3306 \
  mysql:8 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci
```

---

### 2. Configure `DATABASE_URL` in `.env.local`

The Prisma datasource in `prisma/schema.prisma` is configured for **MySQL**:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Create or update your `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Then set a proper `DATABASE_URL`, for example:

```env
DATABASE_URL="mysql://reglens_user:strong_password_here@127.0.0.1:3306/reglens?charset=utf8mb4"
```

Key parts:

- `reglens_user` – the DB user you created
- `strong_password_here` – the user password
- `127.0.0.1` – host (local machine)
- `3306` – MySQL port
- `reglens` – database name
- `?charset=utf8mb4` – recommended for full Unicode support

> **Important:** Do **not** commit `.env.local`. It is already ignored by `.gitignore`.

---

### 3. Install dependencies (if not done yet)

In the project root:

```bash
npm install
# or
pnpm install
```

---

### 4. Apply the Prisma schema to the database

There are two common flows:

#### 4.1. Use migrations (recommended for dev)

This will apply the existing migrations under `prisma/migrations`:

```bash
npm run db:migrate
# or
pnpm db:migrate
```

Under the hood this runs:

```bash
npx prisma migrate dev
```

It will:

- Connect to `DATABASE_URL`
- Apply pending migrations
- Keep your schema and database in sync

#### 4.2. Push the schema directly (quick sandbox)

If you only want to quickly sync the schema (without migration files):

```bash
npm run db:push
# or
pnpm db:push
```

This runs:

```bash
npx prisma db push
```

Use this mainly in disposable / local environments.

---

### 5. Seed initial data (optional but useful)

The project ships with a Prisma seed script at `prisma/seed.ts`.

To run it:

```bash
npm run db:seed
# or
pnpm db:seed
```

This will:

- Insert example organizations, sources, frameworks, controls, updates, mappings, tasks, evidence, and audit packs
- Make the UI immediately interesting after the first login

---

### 6. Verify the connection

#### 6.1. Using Prisma Studio

Start Prisma Studio:

```bash
npm run db:studio
```

Then open the URL printed in the terminal (usually `http://localhost:5555`) and:

- Confirm that tables exist (User, Organization, Source, RegulatoryUpdate, etc.)
- Check that seed data appears if you ran the seed script

#### 6.2. Running the app

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` and:

- Register a new user (or use existing seeded data if applicable)
- Log in and navigate to `/dashboard`, `/sources`, `/updates`, etc.
- If anything is misconfigured, check the server logs in the terminal

---

### 7. Production database configuration

For production, you typically use a managed MySQL service (AWS RDS, Azure MySQL, GCP Cloud SQL, etc.).

1. Create a production database and user.
2. Set `DATABASE_URL` in your hosting provider’s environment configuration (e.g. Vercel project settings).
3. Run migrations on production:

```bash
npm run db:migrate:deploy
```

4. Deploy the app (`npm run build` then `npm run start`, or via your CI/CD pipeline).

> **Tip:** Use a separate database (and credentials) for dev, staging, and production. Never point your local `.env.local` to the production database.

---

### 8. Troubleshooting

- **`PrismaClientInitializationError`**  
  - Check that MySQL is running and accessible.
  - Verify `DATABASE_URL` (user, password, host, port, db name).

- **Connection refused / timeout**  
  - Ensure the port (3306) is correct and not firewalled.
  - If using Docker, confirm the container is up (`docker ps`).

- **Migration errors**  
  - Make sure the database is empty on the first run, or adjust the schema/migrations carefully.
  - For development-only resets you can drop and recreate the DB, then run migrations again.

