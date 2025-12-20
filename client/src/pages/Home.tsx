import { useState, useEffect, useMemo } from 'react';
import { federations as staticFederations } from '../data/federations';
import FederationModal from '../components/FederationModal';
import type { Federation as StaticFederation } from '../data/federations';
import { ChevronDown, Search, Menu, Loader2, MapPin, Users, Calendar, Trophy, X, Filter } from 'lucide-react';
import { fetchFederations, supabase, type DbFederation } from '../lib/supabase';

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

// Convert DB federation to display format
function toDisplayFederation(fed: DbFederation): StaticFederation {
  // Generate short name from full name
  const shortName = fed.name
    .replace('Namibia ', '')
    .replace('Ministry of ', '')
    .replace('Association', '')
    .replace('Federation', '')
    .replace('Union', '')
    .trim()
    .toUpperCase();

  return {
    id: fed.id,
    name: fed.name,
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
  
  // Fetch federations and venues from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Fetch federations
        const dbFederations = await fetchFederations();
        if (dbFederations.length > 0) {
          setFederations(dbFederations.map(toDisplayFederation));
        }
        
        // Fetch venues
        const { data: venuesData } = await supabase
          .from('namibia_na_26_venues')
          .select('*')
          .order('capacity', { ascending: false });
        if (venuesData) {
          setVenues(venuesData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header - Glass */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            style={{
              backdropFilter: 'blur(10px)',
            }}
          >
            {showSearch ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </button>
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">NAMIBIA</h1>
          <button 
            className="p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            style={{
              backdropFilter: 'blur(10px)',
            }}
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
            <button 
              className="px-8 py-4 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Upcoming Events
            </button>
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

      {/* Federations Grid */}
      <section id="federations" className="py-20 px-4 bg-black">
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
          {!isLoading && filteredFederations.length > 0 && <div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
            {filteredFederations.map((federation) => (
              <button
                key={federation.id}
                onClick={() => setSelectedFederation(federation)}
                className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${federation.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/60 group-hover:via-black/50 group-hover:to-black/70 transition-all duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8 text-left">
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
                  <h3 className="text-xl md:text-3xl font-serif text-white tracking-wide leading-tight">
                    {federation.shortName}
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
            <p className="text-sm tracking-[0.3em] text-red-400 mb-4">ACROSS</p>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
              14 REGIONS
            </h2>
            <p className="text-gray-300">
              Sports development spanning all of Namibia's administrative regions
            </p>
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
