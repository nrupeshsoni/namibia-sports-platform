import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Filter, Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

interface Event {
  id: number;
  title: string;
  federation: string;
  date: string;
  time: string;
  venue: string;
  category: 'tournament' | 'championship' | 'friendly' | 'training' | 'meeting';
  participants?: number;
  image: string;
}

// Sample events data
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'National Football Championship Final',
    federation: 'Football Association of Namibia',
    date: '2026-01-15',
    time: '18:00',
    venue: 'Independence Stadium, Windhoek',
    category: 'championship',
    participants: 5000,
    image: '/sports/namibia-football.jpg',
  },
  {
    id: 2,
    title: 'Namibia vs South Africa Rugby Test Match',
    federation: 'Rugby Namibia',
    date: '2026-01-20',
    time: '15:00',
    venue: 'Hage Geingob Stadium, Windhoek',
    category: 'tournament',
    participants: 8000,
    image: '/sports/namibia-rugby.jpg',
  },
  {
    id: 3,
    title: 'National Athletics Championships',
    federation: 'Athletics Namibia',
    date: '2026-01-25',
    time: '09:00',
    venue: 'Independence Stadium, Windhoek',
    category: 'championship',
    participants: 200,
    image: '/sports/bCLTLTx2ggc5.jpeg',
  },
  {
    id: 4,
    title: 'Cricket Namibia T20 League',
    federation: 'Cricket Namibia',
    date: '2026-02-01',
    time: '14:00',
    venue: 'Wanderers Cricket Ground, Windhoek',
    category: 'tournament',
    participants: 300,
    image: '/sports/namibia-cricket.jpg',
  },
  {
    id: 5,
    title: 'National Swimming Gala',
    federation: 'Swimming Namibia',
    date: '2026-02-05',
    time: '10:00',
    venue: 'Olympia Swimming Pool, Windhoek',
    category: 'championship',
    participants: 150,
    image: '/sports/namibia-swimming.jpg',
  },
  {
    id: 6,
    title: 'Boxing Championship - Heavyweight Division',
    federation: 'Boxing Namibia',
    date: '2026-02-10',
    time: '19:00',
    venue: 'Windhoek Country Club',
    category: 'championship',
    participants: 1000,
    image: '/sports/namibia-boxing.jpg',
  },
  {
    id: 7,
    title: 'National Hockey League Finals',
    federation: 'Hockey Namibia',
    date: '2026-02-15',
    time: '16:00',
    venue: 'Windhoek Hockey Club',
    category: 'championship',
    participants: 500,
    image: '/sports/namibia-hockey.jpg',
  },
  {
    id: 8,
    title: 'Basketball Regional Tournament',
    federation: 'Basketball Namibia',
    date: '2026-02-20',
    time: '17:00',
    venue: 'Dome Sports Complex, Swakopmund',
    category: 'tournament',
    participants: 400,
    image: '/sports/namibia-basketball.jpg',
  },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.federation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'championship':
        return 'bg-red-600';
      case 'tournament':
        return 'bg-blue-600';
      case 'friendly':
        return 'bg-green-600';
      case 'training':
        return 'bg-yellow-600';
      case 'meeting':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-lg">Back</span>
            </button>
          </Link>
          <h1 className="text-white text-2xl font-serif tracking-[0.3em]">EVENTS</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 w-full overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <CalendarIcon className="w-16 h-16 mb-4" />
            <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-wider">
              UPCOMING EVENTS
            </h1>
            <p className="text-lg md:text-xl font-light">
              Discover sporting events across Namibia
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, federations, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-white hover:bg-gray-800'}
              >
                All Events
              </Button>
              <Button
                variant={selectedCategory === 'championship' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('championship')}
                className={selectedCategory === 'championship' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-white hover:bg-gray-800'}
              >
                Championships
              </Button>
              <Button
                variant={selectedCategory === 'tournament' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('tournament')}
                className={selectedCategory === 'tournament' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-white hover:bg-gray-800'}
              >
                Tournaments
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getCategoryColor(event.category)} text-white`}>
                      {event.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2 text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{event.federation}</p>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-red-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>{event.venue}</span>
                    </div>
                    {event.participants && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-red-600" />
                        <span>{event.participants}+ Expected</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No Events Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
