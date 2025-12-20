# Namibia Sports Platform

Comprehensive sports management platform for Namibia with 65 sporting federations, clubs, events, athletes, and high-performance systems.

## Features

- **65 Sporting Bodies**: 57 federations + 8 umbrella organizations
- **Full Management System**: Federations, clubs, events, athletes, coaches, venues
- **Beautiful UI**: Responsive design matching tourism portal aesthetic
- **Admin Dashboard**: Complete backend management interface
- **Supabase Backend**: PostgreSQL database with comprehensive schema

## Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS 4 + Framer Motion
- **Backend**: tRPC + Express + Drizzle ORM
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify (Serverless Functions)

## Deployment to Netlify

### 1. Database Setup

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the migration script from `supabase-migration.sql`
4. Verify all tables are created with `namibia_na_26_` prefix

### 2. Netlify Setup

1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `namibia-sports-platform`

2. **Build Settings** (should auto-detect from netlify.toml)
   - Build command: `pnpm install && pnpm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the following:
   
   ```
   DATABASE_URL=postgresql://postgres:N@mibia!23Sports@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres
   NODE_VERSION=22
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live!

### 3. Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS settings as instructed

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create .env file with DATABASE_URL

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

## Project Structure

```
namibia_sports_platform/
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── pages/          # Page components
│   │   └── components/     # Reusable components
│   └── public/             # Static assets
├── server/                  # Backend API
│   ├── routers.ts          # tRPC endpoints
│   └── db.ts               # Database helpers
├── netlify/
│   └── functions/          # Serverless functions
│       └── api.ts          # Main API handler
├── drizzle/
│   └── schema.ts           # Database schema
├── supabase-migration.sql  # Database migration
└── netlify.toml            # Netlify configuration
```

## API Endpoints

All API endpoints are available through tRPC at `/api/trpc/*`:

- `federations.*` - Federation management
- `clubs.*` - Club management
- `events.*` - Event/calendar management
- `athletes.*` - Athlete profiles
- `coaches.*` - Coach management
- `venues.*` - Venue/facility management

## Database Schema

All tables use the `namibia_na_26_` prefix:

- `namibia_na_26_federations` - 65 sporting bodies
- `namibia_na_26_clubs` - Clubs linked to federations
- `namibia_na_26_events` - Competitions and events
- `namibia_na_26_athletes` - Athlete profiles
- `namibia_na_26_coaches` - Coach profiles
- `namibia_na_26_venues` - Sports facilities
- `namibia_na_26_schools` - Schools offering sports
- `namibia_na_26_media` - Photos and videos
- `namibia_na_26_hp_programs` - High-performance programs

## Support

For deployment issues or questions, refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io/docs)

## License

MIT
