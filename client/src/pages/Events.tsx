import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Search, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';

interface DbEvent {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  federation_id: number | null;
  venue_id: number | null;
  type: 'competition' | 'tournament' | 'training' | 'workshop' | 'meeting' | 'other';
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  location: string | null;
  region: string | null;
  max_participants: number | null;
  current_participants: number | null;
  is_published: boolean;
}

interface Federation {
  id: number;
  name: string;
}

// Sport-specific images for events
const sportImages: Record<string, string> = {
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  rugby: 'https://images.unsplash.com/photo-1544298621-77b0abb8a8b1?w=800&q=80',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  athletics: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  swimming: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
  netball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  cycling: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1461896836934-4f16cf7d507c?w=800&q=80',
};

function getEventImage(eventName: string): string {
  const name = eventName.toLowerCase();
  if (name.includes('football') || name.includes('soccer')) return sportImages.football;
  if (name.includes('rugby')) return sportImages.rugby;
  if (name.includes('cricket')) return sportImages.cricket;
  if (name.includes('basketball') || name.includes('bal')) return sportImages.basketball;
  if (name.includes('athletics') || name.includes('marathon') || name.includes('run')) return sportImages.athletics;
  if (name.includes('swimming')) return sportImages.swimming;
  if (name.includes('netball')) return sportImages.netball;
  if (name.includes('tennis')) return sportImages.tennis;
  if (name.includes('cycling') || name.includes('tour')) return sportImages.cycling;
  return sportImages.default;
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [federations, setFederations] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Fetch events and federations
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Fetch events
        const { data: eventsData } = await supabase
          .from('namibia_na_26_events')
          .select('*')
          .eq('is_published', true)
          .order('start_date', { ascending: true });
        
        if (eventsData) {
          setEvents(eventsData);
        }
        
        // Fetch federations for names
        const { data: fedData } = await supabase
          .from('namibia_na_26_federations')
          .select('id, name');
        
        if (fedData) {
          const fedMap: Record<number, string> = {};
          fedData.forEach((f: Federation) => {
            fedMap[f.id] = f.name;
          });
          setFederations(fedMap);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (federations[event.federation_id || 0]?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'competition':
        return 'bg-red-600';
      case 'tournament':
        return 'bg-blue-600';
      case 'training':
        return 'bg-green-600';
      case 'workshop':
        return 'bg-yellow-600';
      case 'meeting':
        return 'bg-purple-600';
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-900/50" />);
    }
    
    // Add cells for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`h-24 p-2 border border-gray-800 ${isToday ? 'bg-red-900/30' : 'bg-gray-900/50'} hover:bg-gray-800/50 transition-colors`}
        >
          <span className={`text-sm ${isToday ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{day}</span>
          <div className="mt-1 space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs px-1 py-0.5 rounded truncate ${getCategoryColor(event.type)}`}
                title={event.name}
              >
                {event.name.substring(0, 20)}...
              </div>
            ))}
            {dayEvents.length > 2 && (
              <span className="text-xs text-gray-500">+{dayEvents.length - 2} more</span>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-xl font-serif text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-800 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-900 p-2 text-center text-sm text-gray-400 font-medium">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
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
          <div className="w-20" />
        </div>
      </header>

      <div className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 w-full overflow-hidden mb-12">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1461896836934-4f16cf7d507c?w=1920&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-blue-600/80" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <CalendarIcon className="w-16 h-16 mb-4" />
            <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-wider">
              EVENTS CALENDAR
            </h1>
            <p className="text-lg md:text-xl font-light">
              {events.length} upcoming events across Namibia
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* View Toggle & Filters */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, federations, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {/* View Toggle */}
              <div className="flex border border-gray-700 rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode('calendar')}
                  className={`rounded-none ${viewMode === 'calendar' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Calendar
                </Button>
              </div>
              
              {/* Category Filters */}
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-white hover:bg-gray-800'}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'competition' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('competition')}
                className={selectedCategory === 'competition' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-white hover:bg-gray-800'}
              >
                Competitions
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Calendar View */}
          {!isLoading && viewMode === 'calendar' && renderCalendar()}

          {/* Events Grid */}
          {!isLoading && viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${event.poster_url || getEventImage(event.name)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getCategoryColor(event.type)} text-white`}>
                        {event.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-serif mb-2 text-white">
                      {event.name}
                    </h3>
                    {event.federation_id && (
                      <p className="text-sm text-gray-400 mb-4">
                        {federations[event.federation_id] || 'Namibia Sports'}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-red-500" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{formatTime(event.start_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-red-500" />
                          <span>{event.max_participants} participants</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No Events Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            © {new Date().getFullYear()} Namibia Sports Platform
          </p>
          <p className="text-xs text-gray-600">
            Website Designed and Developed by{' '}
            <a href="https://thedome.com.na" className="text-red-500 hover:text-red-400">The Dome Technologies</a>
            {' '}&{' '}
            <a href="https://facilit8.com.na" className="text-red-500 hover:text-red-400">Facilit8 Namibia</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
