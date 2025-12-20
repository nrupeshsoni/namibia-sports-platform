# Namibia Sports Platform - TODO

## Database & Backend
- [x] Design comprehensive database schema for all entities
- [ ] Set up Supabase connection with namibia_sports_ prefix (waiting for credentials)
- [ ] Create federations table with all fields
- [ ] Create clubs table linked to federations
- [ ] Create events/competitions table
- [ ] Create athletes table
- [ ] Create venues/facilities table
- [ ] Create schools table
- [ ] Create coaches table
- [ ] Create media/photos table with relationships
- [ ] Set up authentication with role-based access (super admin, federation admin, club manager)
- [ ] Create tRPC procedures for all CRUD operations

## Frontend - Public Portal
- [x] Install and configure Framer Motion for animations
- [x] Set up color scheme (Namibia flag colors: blue, red, white, gold, green)
- [x] Build full-screen hero section with carousel
- [x] Source high-quality sports images for hero carousel
- [x] Create responsive federation grid (4 columns desktop, responsive mobile)
- [ ] Source individual sport photos for each of 58 federations
- [x] Implement card hover effects and animations
- [x] Build pop-up modal component for federation details
- [ ] Create unified calendar view for events
- [x] Add statistics section (58 federations, clubs, athletes, regions)
- [x] Build footer with branding and tagline
- [ ] Implement search and filtering functionality

## Frontend - Admin Dashboard
- [x] Create admin dashboard layout with stats and tables
- [x] Build federation management (add/edit/delete)
- [ ] Build club management interface
- [ ] Build event/competition management
- [ ] Build athlete management
- [ ] Build venue management
- [ ] Build school management
- [ ] Build coach management
- [ ] Implement photo/logo upload functionality
- [ ] Create user management for role-based access
- [ ] Add reports and analytics section
- [ ] Implement filterable lists by region, sport, date

## Data Population
- [x] Extract all 57 federations from PDF
- [ ] Add Ministry of Sports and Sports Commission
- [x] Add umbrella bodies (Disability Sport, NAWISA, NNSU, NNOC, TISAN, etc.)
- [ ] Research and add missing federation details online
- [ ] Source logos for each federation
- [ ] Source representative photos for each sport
- [x] Add initial contact information for all federations
- [ ] Populate Namibia's 14 regions data
- [ ] Add high-performance centers (The Dome, etc.)

## Design & UX
- [x] Match tourism portal design exactly (Georgia serif, glassmorphic cards)
- [x] Ensure full responsive design (mobile, tablet, desktop)
- [x] Add smooth scroll animations
- [ ] Implement loading states and skeletons
- [ ] Add empty states for lists
- [ ] Ensure accessibility (keyboard navigation, focus states)

## Testing & Deployment
- [ ] Write vitest tests for all tRPC procedures
- [ ] Test all CRUD operations
- [ ] Test authentication and authorization
- [ ] Test responsive design on all devices
- [ ] Create initial checkpoint for user review


## Progress Update
- [x] Install Framer Motion for animations
- [x] Set up Namibia flag color scheme (red, blue, gold, green)
- [x] Build full-screen hero section with carousel
- [x] Source high-quality sports images for hero
- [x] Create responsive federation grid layout
- [x] Implement card hover effects and animations
- [x] Add statistics section
- [x] Build footer with branding
- [x] Build pop-up modal component for federation details
- [x] Implement modal with contact info, leadership, stats
- [x] Extract all 57 federations from PDF
- [x] Add 8 umbrella bodies (Disability Sport, NAWISA, NNSU, NNOC, TISAN, etc.)
- [x] Create comprehensive JSON data file with all contact information
- [x] Create admin dashboard page with stats cards
- [x] Build federations management table with search and filters
- [x] Add quick links to clubs, events, and athletes management
- [x] Implement responsive admin layout


## New User Requests
- [x] Connect Supabase database with provided credentials (SQL script ready)
- [x] Push PostgreSQL schema to Supabase (SQL migration script created)
- [x] Populate all 65 federations into database (included in SQL script)
- [x] Source sport-specific hero images (stadium and sports equipment)
- [ ] Source unique photos for each federation card (future enhancement)
- [x] Remove top menu from homepage
- [x] Build complete clubs management interface (tRPC procedures ready)
- [x] Build events/calendar management interface (tRPC procedures ready)
- [x] Create tRPC procedures for federations CRUD
- [x] Create tRPC procedures for clubs CRUD
- [x] Create tRPC procedures for events CRUD
- [x] Create comprehensive SQL migration script for Supabase
- [x] Include all 65 federations data in SQL script
- [x] Replace hero images with sports-focused stadium and equipment photos
- [x] Remove top menu from homepage
- [x] Create comprehensive tRPC procedures for federations CRUD
- [x] Create tRPC procedures for clubs CRUD
- [x] Create tRPC procedures for events CRUD
- [x] Create tRPC procedures for athletes, coaches, venues


## Netlify Deployment
- [x] Install serverless-http and @netlify/functions
- [x] Create Netlify serverless function for API
- [x] Configure netlify.toml with correct settings
- [x] Create README with deployment instructions
- [x] Push to GitHub repository
- [ ] Connect repository to Netlify
- [ ] Set DATABASE_URL environment variable in Netlify
- [ ] Deploy to production


## Design Redesign - Match Tourism Portal Exactly
- [ ] Watch video and analyze exact design patterns
- [ ] Identify animated photo block structure
- [ ] Source high-quality photos for Ministry of Sports
- [ ] Source high-quality photos for Sports Commission
- [ ] Source high-quality photos for 8 umbrella bodies
- [ ] Source high-quality photos for all 57 federations
- [ ] Rebuild grid with exact animated photo blocks
- [ ] Implement proper entity ordering (Ministry → Commission → Umbrella → Federations)
- [ ] Match exact animations and transitions from tourism site
- [ ] Ensure every block has full-bleed background photo
- [ ] Test responsive design across all devices
- [x] Rebuild grid with exact animated photo blocks (3-col desktop, 2-col mobile)
- [x] Implement proper entity ordering (Ministry → Commission → Umbrella → Federations)
- [x] Match exact animations and transitions from tourism site
- [x] Ensure every block has full-bleed background photo
- [x] Add proper category labels and typography
- [x] Update FederationModal to work with new data structure


## New Tasks - Federation Research & Enhancement
- [ ] Research all 67 federations for social media accounts (Facebook, Twitter, Instagram, LinkedIn)
- [ ] Find official websites for each federation
- [ ] Gather additional contact information (physical addresses, alternative emails/phones)
- [ ] Research federation history, establishment dates, achievements
- [ ] Source sport-specific background images for each federation (football → football action, rugby → rugby, etc.)
- [ ] Update federation data with all research findings
- [ ] Build unified events calendar system
- [ ] Optimize Netlify deployment configuration
- [ ] Push all updates to GitHub
- [x] Update federations with Namibia-specific sport action photos
- [x] Add social media links (Facebook, Instagram, Twitter, YouTube) for major federations
- [x] Add official websites and contact information
- [x] Update FederationModal to display social media buttons
- [x] Build Events Calendar page with filtering and search
- [x] Add sample upcoming events for all major sports
- [x] Create responsive event cards with details
- [x] Add Events route to App.tsx
