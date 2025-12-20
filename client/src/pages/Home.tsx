import { useState, useEffect } from 'react';
import { federations as staticFederations } from '../data/federations';
import FederationModal from '../components/FederationModal';
import type { Federation as StaticFederation } from '../data/federations';
import { ChevronDown, Search, Menu, Loader2 } from 'lucide-react';
import { fetchFederations, type DbFederation } from '../lib/supabase';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch federations from Supabase
  useEffect(() => {
    async function loadFederations() {
      try {
        setIsLoading(true);
        const dbFederations = await fetchFederations();
        if (dbFederations.length > 0) {
          setFederations(dbFederations.map(toDisplayFederation));
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch federations:', err);
        setError(err as Error);
        // Keep using static data on error
      } finally {
        setIsLoading(false);
      }
    }
    loadFederations();
  }, []);

  const heroImages = [
    { url: '/hero/stadium.jpg', title: 'NAMIBIA', subtitle: 'SPORTS', tagline: 'Excellence in Athletics, Unity in Sport' },
    { url: '/hero/athletics.jpg', title: 'NAMIBIA', subtitle: 'SPORTS', tagline: 'Building Champions, Inspiring Nations' },
    { url: '/hero/sports-equipment.jpg', title: 'NAMIBIA', subtitle: 'SPORTS', tagline: 'Where Passion Meets Performance' },
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button className="text-white hover:text-gray-300 transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">NAMIBIA</h1>
          <button className="text-white hover:text-gray-300 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
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
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
            >
              Explore Federations
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-medium rounded transition-colors">
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
          <div className="text-center mb-16">
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Grid - 3 columns desktop, 2 columns mobile */}
          {!isLoading && <div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
            {federations.map((federation) => (
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl md:text-6xl font-serif text-white mb-2">67</p>
              <p className="text-sm tracking-[0.2em] text-gray-400">SPORTING BODIES</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-serif text-white mb-2">500+</p>
              <p className="text-sm tracking-[0.2em] text-gray-400">CLUBS</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-serif text-white mb-2">50K+</p>
              <p className="text-sm tracking-[0.2em] text-gray-400">ATHLETES</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-serif text-white mb-2">14</p>
              <p className="text-sm tracking-[0.2em] text-gray-400">REGIONS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif mb-4">NAMIBIA SPORTS</h3>
          <p className="text-gray-400 mb-8">Excellence in Athletics, Unity in Sport</p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Namibia Sports Platform. All rights reserved.
          </p>
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
