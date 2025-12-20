# Namibia Sports Platform - Netlify Deployment Guide

## Prerequisites

1. **Supabase Account** - Database already set up at `db.rbibqjgsnrueubrvyqps.supabase.co`
2. **Netlify Account** - For hosting the application
3. **GitHub Repository** - Code is at `https://github.com/nrupeshsoni/namibia-sports-platform`

## Step 1: Run SQL Migration Scripts in Supabase

1. Log into your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `rbibqjgsnrueubrvyqps`
3. Go to **SQL Editor**
4. Run the following scripts in order:

### A. Create Tables (supabase-migration.sql)
```sql
-- Copy and paste the entire content of supabase-migration.sql
-- This creates all 10 tables with namibia_na_26_ prefix
```

### B. Populate Data (supabase-data-population.sql)
```sql
-- Copy and paste the entire content of supabase-data-population.sql
-- This inserts all 67 federations with complete data
```

### C. Verify Data
```sql
SELECT category, COUNT(*) as count 
FROM namibia_na_26_federations 
GROUP BY category;

-- Expected result:
-- government: 2
-- umbrella: 8
-- federation: 57
```

## Step 2: Deploy to Netlify

### A. Import GitHub Repository

1. Log into Netlify: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as the provider
4. Choose repository: `nrupeshsoni/namibia-sports-platform`
5. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### B. Set Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**, add:

```
DATABASE_URL=postgresql://postgres:N@mibia!23Sports@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres
NODE_VERSION=22
```

### C. Deploy

Click **"Deploy site"** and wait for build to complete.

## Step 3: Configure Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `sports.namibia.com`)
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic with Netlify)

## Step 4: Test the Deployment

1. Visit your Netlify URL (e.g., `https://namibia-sports-platform.netlify.app`)
2. Verify:
   - ✅ Homepage loads with hero carousel
   - ✅ All 67 federation cards display
   - ✅ Click on a federation opens modal with details
   - ✅ Events calendar page works
   - ✅ Admin dashboard accessible at `/admin`
   - ✅ Admin events management at `/admin/events`

## Step 5: Enable Supabase Row Level Security (RLS)

For production security, enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE namibia_na_26_federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE namibia_na_26_schools ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON namibia_na_26_federations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_clubs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_athletes FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_coaches FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_venues FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON namibia_na_26_schools FOR SELECT USING (true);

-- Restrict write access (add authentication later)
-- For now, you can manage data directly in Supabase dashboard
```

## Troubleshooting

### Build Fails
- Check Netlify build logs for errors
- Verify `NODE_VERSION=22` is set in environment variables
- Ensure `DATABASE_URL` is correctly set

### Database Connection Errors
- Verify Supabase connection string is correct
- Check that tables are created with `namibia_na_26_` prefix
- Ensure SSL is enabled in connection string

### Functions Not Working
- Verify `netlify/functions` directory exists
- Check that `serverless-http` is installed in `package.json`
- Review function logs in Netlify dashboard

## Next Steps

1. **Add Federation Logos** - Upload official logos to Supabase Storage and update image URLs
2. **Enable Authentication** - Add admin login for federation managers
3. **Build Federation Portals** - Create dedicated landing pages for each federation
4. **Add SEO Optimization** - Meta tags, sitemaps, structured data
5. **Analytics** - Add Google Analytics tracking

## Support

For issues or questions:
- Check Netlify build logs
- Review Supabase dashboard for database errors
- Verify environment variables are set correctly
