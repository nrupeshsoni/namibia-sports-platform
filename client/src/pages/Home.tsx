import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { federations as staticFederations } from '../data/federations';
import FederationModal from '../components/FederationModal';
import NavDrawer from '../components/NavDrawer';
import type { Federation as StaticFederation } from '../data/federations';
import { ChevronDown, Search, Menu, Loader2, MapPin, Users, Calendar, Trophy, X, Filter, Clock, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trpc } from '../lib/trpc';
import { fadeUp, staggerContainer, scaleIn } from '../lib/animations';

const EVENT_TYPE_IMAGES: Record<string, string> = {
  competition: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  tournament: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  training: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  meeting: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1461896836934-4f16cf7d507c?w=800&q=80',
};

const NEWS_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';

// Venue type
interface Venue {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  photo_url: string | null;
  city: string | null;
  region: string | null;
  capacity: number | null;
}

/** Federation row from tRPC (camelCase, matches getBySlug) */
type TrpcFederation = {
  id: number;
  name: string;
  abbreviation: string | null;
  type: 'ministry' | 'commission' | 'umbrella' | 'federation';
  description: string | null;
  logo: string | null;
  backgroundImage: string | null;
  slug: string | null;
  president?: string | null;
  secretaryGeneral?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
};

/** Convert tRPC federation to display format (matches getBySlug, so links resolve correctly) */
function toDisplayFederation(fed: TrpcFederation): StaticFederation {
  const shortName = (fed.abbreviation || fed.name
    .replace('Namibia ', '')
    .replace('Ministry of ', '')
    .replace('Association', '')
    .replace('Federation', '')
    .replace('Union', '')
    .trim()).toUpperCase();

  return {
    id: fed.id,
    name: fed.name,
    slug: fed.slug || fed.abbreviation?.toLowerCase().replace(/\s+/g, '-') || `fed-${fed.id}`,
    category: fed.type,
    shortName: shortName || fed.name.toUpperCase(),
    description: fed.description || undefined,
    image: fed.backgroundImage || fed.logo || '/hero/stadium.jpg',
    president: fed.president || undefined,
    secretary: fed.secretaryGeneral || undefined,
    email: fed.email || undefined,
    phone: fed.phone || undefined,
    website: fed.website || undefined,
    facebook: fed.facebook || undefined,
    instagram: fed.instagram || undefined,
    twitter: fed.twitter || undefined,
    youtube: fed.youtube || undefined,
  };
}

export default function Home() {
  const [selectedFederation, setSelectedFederation] = useState<StaticFederation | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [federations, setFederations] = useState<StaticFederation[]>(staticFederations);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  
  // Filter federations based on search and category
  const filteredFederations = useMemo(() => {
    return federations.filter((fed) => {
      const matchesSearch = searchQuery === '' || 
        fed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fed.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || fed.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [federations, searchQuery, selectedCategory]);
  
  // Federations via tRPC (same source as getBySlug — consistent slug resolution)
  const federationQuery = trpc.federations.list.useQuery();
  const fedList = federationQuery.data ?? [];
  const fedError = federationQuery.error;
  const fedLoading = federationQuery.isLoading;

  // Sync federations when tRPC succeeds; use fedLoading for grid
  useEffect(() => {
    if (fedList.length > 0) {
      setFederations(fedList.map(toDisplayFederation));
      setError(null);
    }
    if (fedError) setError(fedError instanceof Error ? fedError : new Error(String(fedError)));
    setIsLoading(fedLoading);
  }, [fedList, fedError, fedLoading]);

  // Fetch venues from Supabase
  useEffect(() => {
    async function loadVenues() {
      try {
        const { data: venuesData } = await supabase
          .from('sportsplatform_venues')
          .select('*')
          .order('capacity', { ascending: false });
        if (venuesData) setVenues(venuesData);
      } catch (err) {
        console.error('Failed to fetch venues:', err);
      }
    }
    loadVenues();
  }, []);

  const heroImages = [
    { 
      url: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1920&q=80', 
      title: 'THE DOME', 
      subtitle: 'SWAKOPMUND', 
      tagline: 'Namibia\'s Premier Multi-Sport Indoor Facility' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1920&q=80', 
      title: 'NAMIBIA', 
      subtitle: 'CRICKET GROUND', 
      tagline: 'Home of International Cricket in Namibia' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1461896836934- voices-that-matter?w=1920&q=80', 
      title: 'NAMIBIA', 
      subtitle: 'SPORTS', 
      tagline: 'Excellence in Athletics, Unity in Sport' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80', 
      title: 'NAMIBIA', 
      subtitle: 'ATHLETICS', 
      tagline: 'Building Champions, Inspiring Nations' 
    },
  ];

  // Auto-rotate hero images
  useState(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const scrollToFederations = () => {
    document.getElementById('federations')?.scrollIntoView({ behavior: 'smooth' });
  };

  // tRPC data for home sections
  const upcomingEventsQuery = trpc.events.list.useQuery({ upcoming: true, limit: 8 });
  const newsQuery = trpc.news.list.useQuery({ limit: 6 });
  const upcomingEvents = (upcomingEventsQuery.data ?? []) as Array<{
    id: number;
    name: string;
    slug: string;
    posterUrl: string | null;
    type: string;
    startDate: Date;
    endDate: Date | null;
    location: string | null;
    region: string | null;
  }>;
  const newsArticles = (newsQuery.data ?? []) as Array<{
    id: number;
    title: string;
    slug: string;
    summary: string | null;
    category: string | null;
    featuredImage: string | null;
    publishedAt: string | null;
  }>;

  const EVENT_TYPE_IMAGES: Record<string, string> = {
    competition: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80',
    tournament: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
    training: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    workshop: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
    meeting: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    other: 'https://images.unsplash.com/photo-1461896836934-4f16cf7d507c?w=400&q=80',
  };

  const formatEventDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-NA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formatNewsDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Header - Glass */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between min-h-[44px]">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-all duration-300 touch-target"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            {showSearch ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-6">
            <h1 className="text-white text-2xl font-serif tracking-[0.3em]">NAMIBIA</h1>
            {/* Desktop nav pills */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: 'Events', href: '/events' },
                { label: 'News', href: '/news' },
                { label: 'Live', href: '/live' },
                { label: 'Map', href: '/map' },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white cursor-pointer transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <button
            onClick={() => setNavDrawerOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-all duration-300 touch-target"
            style={{ backdropFilter: 'blur(10px)' }}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Search Bar - Glass Expandable */}
        {showSearch && (
          <div className="container mx-auto px-4 pb-4">
            <div 
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search federations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroImages.map((hero, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <p className="text-sm md:text-base tracking-[0.3em] mb-4 font-light">
            WELCOME TO
          </p>
          <h1 className="text-6xl md:text-8xl font-serif mb-2 tracking-wider">
            {heroImages[currentHeroIndex].title}
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 tracking-[0.2em]">
            {heroImages[currentHeroIndex].subtitle}
          </h2>
          <p className="text-lg md:text-xl font-light mb-12 max-w-2xl text-center">
            {heroImages[currentHeroIndex].tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToFederations}
              className="px-8 py-4 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.5)',
              }}
            >
              Explore Federations
            </button>
            <Link href="/events">
              <span
                className="inline-block px-8 py-4 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                Upcoming Events
              </span>
            </Link>
          </div>

          <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce">
            <p className="text-sm tracking-[0.3em]">SCROLL</p>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroIndex ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Schedules Section - Aggregate schedules across sports */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-sm tracking-[0.3em] text-red-400 mb-2">UPCOMING</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
              SCHEDULES
            </h2>
            <p className="text-gray-400">Matches and competitions across all sports</p>
          </motion.div>
          {upcomingEventsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            >
              {upcomingEvents.slice(0, 5).map((evt, i) => (
                <motion.div
                  key={evt.id}
                  variants={fadeUp}
                  className="flex-shrink-0 w-[280px] snap-center group"
                >
                  <Link href={`/events?slug=${evt.slug}`}>
                    <div
                      className="h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div
                        className="h-32 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${evt.posterUrl || EVENT_TYPE_IMAGES[evt.type] || EVENT_TYPE_IMAGES.other})` }}
                      />
                      <div className="p-4">
                        <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
                          {evt.type}
                        </span>
                        <h3 className="text-white font-serif mt-1 line-clamp-2">{evt.name}</h3>
                        <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          {formatEventDate(evt.startDate)}
                        </div>
                        {evt.location && (
                          <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {evt.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className="text-center py-12 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Clock className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500">No upcoming events scheduled</p>
              <Link href="/events">
                <span className="inline-block mt-3 text-sm text-red-400 hover:text-red-300 cursor-pointer">View events</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Calendar / Upcoming Events Section */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-sm tracking-[0.3em] text-blue-400 mb-2">EVENTS</p>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
                UPCOMING CALENDAR
              </h2>
              <p className="text-gray-400">Events across Namibia's federations</p>
            </div>
            <Link href="/events">
              <span
                className="inline-block px-6 py-3 rounded-xl text-white text-sm font-medium cursor-pointer transition-all hover:scale-105"
                style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
              >
                View all events
              </span>
            </Link>
          </motion.div>
          {upcomingEventsQuery.isLoading ? null : upcomingEvents.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {upcomingEvents.slice(0, 8).map((evt, i) => (
                <motion.div key={evt.id} variants={fadeUp}>
                  <Link href={`/events?slug=${evt.slug}`}>
                    <div
                      className="h-full rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="relative">
                        <div
                          className="aspect-[16/9] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${evt.posterUrl || EVENT_TYPE_IMAGES[evt.type] || EVENT_TYPE_IMAGES.other})` }}
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(239,68,68,0.7)', color: 'white' }}
                          >
                            {formatEventDate(evt.startDate)}
                          </span>
                          {evt.region && (
                            <span className="px-2 py-1 rounded-lg text-xs text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>
                              {evt.region}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-serif text-lg line-clamp-2">{evt.name}</h3>
                        {evt.location && (
                          <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {evt.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Calendar className="w-14 h-14 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 mb-2">No upcoming events</p>
              <Link href="/events">
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">Browse events</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sports News Section */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-green-500/5 rounded-full blur-[130px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-sm tracking-[0.3em] text-emerald-400 mb-2">LATEST</p>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
                SPORTS NEWS
              </h2>
              <p className="text-gray-400">Updates from across Namibian sport</p>
            </div>
            <Link href="/news">
              <span
                className="inline-block px-6 py-3 rounded-xl text-white text-sm font-medium cursor-pointer transition-all hover:scale-105"
                style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}
              >
                All news
              </span>
            </Link>
          </motion.div>
          {newsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          ) : newsArticles.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {newsArticles.map((article) => (
                <motion.div key={article.id} variants={fadeUp}>
                  <Link href="/news">
                    <div
                      className="h-full rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(${article.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {article.category && (
                          <span
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(16,185,129,0.8)', color: 'white' }}
                          >
                            {article.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-serif text-lg line-clamp-2 mb-2">{article.title}</h3>
                        {article.summary && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{article.summary}</p>
                        )}
                        {article.publishedAt && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatNewsDate(article.publishedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Newspaper className="w-14 h-14 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 mb-2">No news yet</p>
              <Link href="/news">
                <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer text-sm">Browse news</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Schedules — aggregate upcoming across sports */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-10"
          >
            <p className="text-sm tracking-[0.3em] text-red-400 mb-2">SCHEDULES</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">UPCOMING MATCHES & COMPETITIONS</h2>
            <p className="text-gray-400">Aggregated schedules across all Namibian sports</p>
          </motion.div>
          {upcomingEventsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {(upcomingEvents.slice(0, 5).length === 0 ? (
                <div
                  className="px-6 py-4 rounded-2xl text-gray-400 text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  No upcoming events — check back soon
                </div>
              ) : (
                upcomingEvents.slice(0, 5).map((evt, i) => (
                  <motion.div
                    key={evt.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/events`}>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl min-w-[240px] max-w-[280px]"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                          style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                          <span className="text-lg font-bold text-white leading-none">{new Date(evt.startDate).getDate()}</span>
                          <span className="text-[10px] text-red-300 uppercase">{new Date(evt.startDate).toLocaleString('en-US', { month: 'short' })}</span>
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-white font-medium truncate">{evt.name}</p>
                          <p className="text-xs text-gray-400 truncate">{evt.location || evt.region || 'TBA'}</p>
                        </div>
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Calendar / Upcoming Events — grid with dates and locations */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-10"
          >
            <p className="text-sm tracking-[0.3em] text-blue-400 mb-2">CALENDAR</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">UPCOMING EVENTS</h2>
            <p className="text-gray-400">Events across federations — dates, locations, and more</p>
          </motion.div>
          {upcomingEventsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {(upcomingEvents.length === 0 ? (
                <div
                  className="col-span-full py-12 rounded-2xl text-center text-gray-400"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  No upcoming events — visit the Events page for more
                </div>
              ) : (
                upcomingEvents.map((evt) => (
                  <motion.div key={evt.id} variants={fadeUp}>
                    <Link href="/events">
                      <motion.div
                        whileHover={{ scale: 1.02, rotateY: 2 }}
                        className="h-full rounded-2xl overflow-hidden group"
                        style={{
                          perspective: '1000px',
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
                        } as React.CSSProperties}
                      >
                        <div className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${evt.posterUrl || EVENT_TYPE_IMAGES[evt.type] || EVENT_TYPE_IMAGES.other})` }} />
                        <div className="p-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2" style={{ background: 'rgba(251,191,36,0.2)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.3)' }}>
                            {evt.type}
                          </span>
                          <h3 className="text-lg font-serif text-white mb-1 line-clamp-2">{evt.name}</h3>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            {formatEventDate(evt.startDate)}
                          </p>
                          {(evt.location || evt.region) && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {evt.location || evt.region}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Sports News — latest news feed */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-10"
          >
            <p className="text-sm tracking-[0.3em] text-green-400 mb-2">UPDATES</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">SPORTS NEWS</h2>
            <p className="text-gray-400">Latest news and updates from Namibian federations</p>
          </motion.div>
          {newsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(newsArticles.length === 0 ? (
                <div
                  className="col-span-full py-12 rounded-2xl text-center text-gray-400"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  No news yet — check back soon
                </div>
              ) : (
                newsArticles.map((article) => (
                  <motion.div key={article.id} variants={fadeUp}>
                    <Link href={`/news`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="h-full rounded-2xl overflow-hidden group"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <div className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${article.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80'})` }} />
                        <div className="p-5">
                          {article.category && (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2" style={{ background: 'rgba(16,185,129,0.2)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)' }}>
                              {article.category}
                            </span>
                          )}
                          <h3 className="text-lg font-serif text-white mb-2 line-clamp-2">{article.title}</h3>
                          {article.summary && <p className="text-sm text-gray-400 line-clamp-2 mb-2">{article.summary}</p>}
                          <p className="text-xs text-gray-500">{formatNewsDate(article.publishedAt)}</p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Schedules & Upcoming Events & News (Glassmorphism) ─── */}
      <div className="relative py-16 px-4 bg-black overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto relative z-10 space-y-20">
          {/* 1. Schedules Section — aggregate upcoming across sports */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="relative"
          >
            <div className="text-center mb-10">
              <p className="text-sm tracking-[0.3em] text-red-400 mb-2">SCHEDULES</p>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
                WHAT&apos;S COMING UP
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Matches, competitions, and events across all Namibian sports
              </p>
            </div>

            {upcomingEventsQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl text-gray-500"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Calendar className="w-12 h-12 mb-4 opacity-60" />
                <p className="text-lg font-medium text-gray-400">No upcoming events</p>
                <p className="text-sm">Check back soon for new schedules</p>
                <Link href="/events">
                  <span className="mt-4 px-6 py-2 rounded-full text-sm text-white cursor-pointer hover:bg-white/10 transition-colors" style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.4)' }}>
                    Browse All Events
                  </span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {upcomingEvents.slice(0, 4).map((evt, i) => (
                  <motion.div
                    key={evt.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/events?slug=${evt.slug}`}>
                      <div
                        className="relative overflow-hidden rounded-2xl h-full transition-all duration-300"
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 4px 24px -4px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div
                          className="aspect-[16/10] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${evt.posterUrl ?? EVENT_TYPE_IMAGES[evt.type] ?? EVENT_TYPE_IMAGES.other})` }}
                        />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-gray-400">{formatEventDate(evt.startDate)}</span>
                          </div>
                          <h3 className="font-serif text-white line-clamp-2 text-lg">{evt.name}</h3>
                          {(evt.location || evt.region) && (
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {evt.location || evt.region}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 2. Calendar / Upcoming Events — fuller grid */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="relative"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
              <div>
                <p className="text-sm tracking-[0.3em] text-blue-400 mb-2">CALENDAR</p>
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  UPCOMING EVENTS
                </h2>
                <p className="text-gray-400 mt-1">Events across the country</p>
              </div>
              <Link href="/events">
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: 'rgba(59,130,246,0.25)',
                    border: '1px solid rgba(59,130,246,0.4)',
                  }}
                >
                  View All <Calendar className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {upcomingEvents.length === 0 && !upcomingEventsQuery.isLoading ? null : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingEvents.slice(0, 6).map((evt, i) => (
                  <motion.div
                    key={evt.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Link href={`/events?slug=${evt.slug}`}>
                      <div
                        className="relative overflow-hidden rounded-2xl h-full transition-all duration-300"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div className="flex">
                          <div
                            className="flex-shrink-0 w-24 flex flex-col items-center justify-center p-3 text-center"
                            style={{ background: 'rgba(239,68,68,0.12)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <span className="text-2xl font-bold text-white leading-none">{new Date(evt.startDate).getDate()}</span>
                            <span className="text-xs text-gray-400 uppercase mt-1">{new Date(evt.startDate).toLocaleString('en-US', { month: 'short' })}</span>
                          </div>
                          <div className="flex-1 p-4 min-w-0">
                            <h3 className="font-serif text-white line-clamp-2">{evt.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                              {evt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {evt.location}</span>}
                              {evt.region && <span>{evt.region}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 3. Sports News Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="relative"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
              <div>
                <p className="text-sm tracking-[0.3em] text-emerald-400 mb-2">LATEST</p>
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  SPORTS NEWS
                </h2>
                <p className="text-gray-400 mt-1">Updates from Namibian federations</p>
              </div>
              <Link href="/news">
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: 'rgba(16,185,129,0.25)',
                    border: '1px solid rgba(16,185,129,0.4)',
                  }}
                >
                  All News <Newspaper className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {newsQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : newsArticles.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 rounded-3xl text-gray-500"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Newspaper className="w-12 h-12 mb-4 opacity-60" />
                <p className="text-lg font-medium text-gray-400">No news yet</p>
                <p className="text-sm">Latest stories will appear here</p>
                <Link href="/news">
                  <span className="mt-4 px-6 py-2 rounded-full text-sm text-white cursor-pointer hover:bg-white/10 transition-colors" style={{ background: 'rgba(16,185,129,0.3)', border: '1px solid rgba(16,185,129,0.4)' }}>
                    Browse News
                  </span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((art, i) => (
                  <motion.article
                    key={art.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Link href={`/news/${art.slug}`}>
                      <div
                        className="relative overflow-hidden rounded-2xl h-full transition-all duration-300"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.25)',
                        }}
                      >
                        <div
                          className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${art.featuredImage ?? 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'})`,
                          }}
                        />
                        <div className="p-5">
                          {art.category && (
                            <span
                              className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-2"
                              style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' }}
                            >
                              {art.category}
                            </span>
                          )}
                          <h3 className="font-serif text-white text-lg line-clamp-2 mb-2">{art.title}</h3>
                          {art.summary && <p className="text-sm text-gray-400 line-clamp-2">{art.summary}</p>}
                          {art.publishedAt && <p className="text-xs text-gray-500 mt-2">{formatNewsDate(art.publishedAt)}</p>}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>

      {/* Federations Grid */}
      <section id="federations" className="py-12 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] text-gray-400 mb-4">DISCOVER</p>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">
              SPORTING FEDERATIONS
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore Namibia's diverse sporting landscape across {federations.length} federations and bodies
            </p>
            {error && (
              <p className="text-sm text-yellow-500 mt-2">
                Using cached data (database unavailable)
              </p>
            )}
          </div>

          {/* Category Filters - Glass Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { key: 'all', label: `All (${federations.length})` },
              { key: 'ministry', label: 'Government' },
              { key: 'commission', label: 'Commission' },
              { key: 'umbrella', label: 'Umbrella Bodies' },
              { key: 'federation', label: 'Federations' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedCategory(filter.key)}
                className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: selectedCategory === filter.key 
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))'
                    : 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: selectedCategory === filter.key 
                    ? '1px solid rgba(239, 68, 68, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  boxShadow: selectedCategory === filter.key 
                    ? '0 8px 32px -8px rgba(239, 68, 68, 0.4)'
                    : 'none',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* Search Results Info */}
          {(searchQuery || selectedCategory !== 'all') && (
            <p className="text-center text-gray-400 mb-6">
              Showing {filteredFederations.length} of {federations.length} federations
              {searchQuery && <span> matching "<span className="text-white">{searchQuery}</span>"</span>}
            </p>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredFederations.length === 0 && (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No Federations Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid - 3 columns desktop, 2 columns mobile */}
          {!isLoading && filteredFederations.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filteredFederations.map((federation) => (
              <button
                key={federation.id}
                onClick={() => setSelectedFederation(federation)}
                className="relative aspect-[4/3] overflow-hidden group cursor-pointer rounded-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${federation.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/60 group-hover:via-black/50 group-hover:to-black/70 transition-all duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-start justify-end p-3 md:p-4 text-left">
                  {federation.category === 'ministry' && (
                    <p className="text-xs md:text-sm tracking-[0.2em] text-white/80 mb-2 font-light">
                      GOVERNMENT
                    </p>
                  )}
                  {federation.category === 'commission' && (
                    <p className="text-xs md:text-sm tracking-[0.2em] text-white/80 mb-2 font-light">
                      NATIONAL
                    </p>
                  )}
                  {federation.category === 'umbrella' && (
                    <p className="text-xs md:text-sm tracking-[0.2em] text-white/80 mb-2 font-light">
                      UMBRELLA BODY
                    </p>
                  )}
                  {federation.category === 'federation' && (
                    <p className="text-xs md:text-sm tracking-[0.2em] text-white/80 mb-2 font-light">
                      NAMIBIA
                    </p>
                  )}
                  <h3 className="text-base md:text-lg font-serif text-white tracking-wide leading-tight line-clamp-2">
                    {federation.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>}
        </div>
      </section>

      {/* Regions Preview - Glass Cards */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-t from-red-500/10 to-transparent rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm tracking-[0.3em] text-red-400 mb-4">ACROSS</p>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
                  14 REGIONS
                </h2>
                <p className="text-gray-300">
                  Sports development spanning all of Namibia's administrative regions
                </p>
              </div>
              <Link href="/map">
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: 'rgba(239,68,68,0.25)',
                    border: '1px solid rgba(239,68,68,0.4)',
                  }}
                >
                  <MapPin className="w-4 h-4" /> View on Map
                </span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {['Khomas', 'Erongo', 'Oshana', 'Omusati', 'Ohangwena', 'Oshikoto', 'Kavango East', 
              'Kavango West', 'Zambezi', 'Kunene', 'Otjozondjupa', 'Omaheke', 'Hardap', 'Karas'].map((region, index) => (
              <div 
                key={region} 
                className="p-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer rounded-2xl group"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div 
                  className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, rgba(${index % 2 === 0 ? '239, 68, 68' : '59, 130, 246'}, 0.3), rgba(${index % 2 === 0 ? '220, 38, 38' : '37, 99, 235'}, 0.3))`,
                  }}
                >
                  <MapPin className={`w-5 h-5 ${index % 2 === 0 ? 'text-red-400' : 'text-blue-400'}`} />
                </div>
                <p className="text-white text-sm font-medium">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Glass Cards */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '67', label: 'SPORTING BODIES', color: 'from-red-500/30 to-orange-500/30' },
              { value: '500+', label: 'CLUBS', color: 'from-blue-500/30 to-cyan-500/30' },
              { value: '50K+', label: 'ATHLETES', color: 'from-green-500/30 to-emerald-500/30' },
              { value: '14', label: 'REGIONS', color: 'from-purple-500/30 to-pink-500/30' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <span className="text-2xl font-bold text-white">{stat.value.charAt(0)}</span>
                </div>
                <p className="text-4xl md:text-5xl font-serif text-white mb-2">{stat.value}</p>
                <p className="text-xs tracking-[0.2em] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Venues Section - Glass Design */}
      <section id="venues" className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] text-red-400 mb-4">WORLD-CLASS</p>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">
              SPORTS VENUES
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Namibia's premier sporting facilities hosting national and international events
            </p>
          </div>

          {/* Featured Venues - Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* The Dome Swakopmund */}
            <div 
              className="relative aspect-[16/9] overflow-hidden rounded-3xl group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Glass info card at bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 m-4 rounded-2xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: 'rgba(239, 68, 68, 0.5)' }}
                  >
                    FEATURED
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-1">THE DOME</h3>
                <p className="text-gray-300 text-sm mb-3">Swakopmund, Erongo</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <Users className="w-4 h-4" /> 5,000
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <MapPin className="w-4 h-4" /> Swakopmund
                  </span>
                </div>
              </div>
            </div>

            {/* Namibia Cricket Ground */}
            <div 
              className="relative aspect-[16/9] overflow-hidden rounded-3xl group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Glass info card at bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 m-4 rounded-2xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: 'rgba(59, 130, 246, 0.5)' }}
                  >
                    FEATURED
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-1">CRICKET GROUND</h3>
                <p className="text-gray-300 text-sm mb-3">Windhoek, Khomas</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <Users className="w-4 h-4" /> 8,000
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <MapPin className="w-4 h-4" /> Olympia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Other Venues Grid - Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {venues.filter(v => !v.name.includes('Dome') && !v.name.includes('Cricket')).slice(0, 4).map((venue) => (
              <div 
                key={venue.id} 
                className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer transition-all duration-500 hover:scale-105"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div 
                  className="absolute bottom-0 left-0 right-0 p-4 m-2 rounded-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4 className="text-base font-serif text-white">{venue.name.replace('Namibia ', '').replace(' Stadium', '')}</h4>
                  <p className="text-xs text-gray-400">{venue.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Excellence Blocks - Glass Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Performance */}
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <Trophy className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">HIGH PERFORMANCE</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Elite athlete development programs nurturing Namibia's next generation of champions across all sporting disciplines.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white transition-all duration-300 hover:gap-4"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                LEARN MORE <span>→</span>
              </a>
            </div>

            {/* Events Calendar */}
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">EVENTS CALENDAR</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Stay updated with national championships, international competitions, and community sports events across Namibia.
              </p>
              <a 
                href="/events" 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white transition-all duration-300 hover:gap-4"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                VIEW EVENTS <span>→</span>
              </a>
            </div>

            {/* Athlete Registration */}
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                }}
              >
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">ATHLETE REGISTRATION</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Register as an athlete, coach, or official. Join Namibia's sporting community and access development programs.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white transition-all duration-300 hover:gap-4"
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                }}
              >
                REGISTER NOW <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Sponsors - Glass Section */}
      <section 
        className="py-16 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="container mx-auto px-4">
          <p className="text-center text-sm tracking-[0.3em] text-gray-500 mb-10">PARTNERS & SPONSORS</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['FNB', 'MTC', 'DEBMARINE', 'BANK WINDHOEK', 'NAMPOWER'].map((partner) => (
              <div 
                key={partner}
                className="px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span className="text-xl font-serif text-gray-400 hover:text-white transition-colors">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Glass Design */}
      <footer 
        className="text-white py-16 relative"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,1))',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-serif mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">NAMIBIA SPORTS</h3>
              <p className="text-gray-400 text-sm">Excellence in Athletics, Unity in Sport</p>
            </div>
            <div>
              <h4 className="text-sm tracking-wider text-gray-300 mb-4">QUICK LINKS</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Federations', href: '#federations' },
                  { label: 'Venues', href: '#venues' },
                  { label: 'Events', href: '/events' },
                  { label: 'Admin Portal', href: '/admin' },
                ].map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-500 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm tracking-wider text-gray-300 mb-4">CONTACT</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>Namibia Sports Commission</li>
                <li>Windhoek, Namibia</li>
                <li className="hover:text-red-400 transition-colors cursor-pointer">info@namibiasport.org</li>
                <li className="hover:text-red-400 transition-colors cursor-pointer">+264 61 246105</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm tracking-wider text-gray-300 mb-4">FOLLOW US</h4>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div 
            className="pt-8 text-center rounded-2xl p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-sm text-gray-500 mb-3">
              © {new Date().getFullYear()} Namibia Sports Platform. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Website Designed and Developed by{' '}
              <a href="https://thedome.com.na" className="text-red-500 hover:text-red-400 transition-colors">The Dome Technologies</a>
              {' '}&{' '}
              <a href="https://facilit8.com.na" className="text-red-500 hover:text-red-400 transition-colors">Facilit8 Namibia</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Navigation Drawer */}
      <NavDrawer isOpen={navDrawerOpen} onClose={() => setNavDrawerOpen(false)} />

      {/* Federation Modal */}
      {selectedFederation && (
        <FederationModal
          federation={selectedFederation}
          onClose={() => setSelectedFederation(null)}
        />
      )}
    </div>
  );
}
