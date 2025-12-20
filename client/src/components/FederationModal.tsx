import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Calendar, Users, Trophy, Globe, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Federation } from "../data/federations";

interface FederationModalProps {
  federation: Federation | null;
  onClose: () => void;
}

export default function FederationModal({ federation, onClose }: FederationModalProps) {
  if (!federation) return null;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ministry':
        return 'GOVERNMENT MINISTRY';
      case 'commission':
        return 'NATIONAL COMMISSION';
      case 'umbrella':
        return 'UMBRELLA BODY';
      case 'federation':
        return 'SPORTS FEDERATION';
      default:
        return category.toUpperCase();
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-lg bg-white shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black transition-colors text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${federation.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4 bg-red-600 text-white hover:bg-red-700">
                  {getCategoryLabel(federation.category)}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif tracking-wide mb-4 text-gray-900">
                  {federation.name}
                </h1>
                {federation.description && (
                  <p className="text-lg text-gray-600 max-w-3xl">
                    {federation.description}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-serif text-gray-900">1990</p>
                  <p className="text-sm text-gray-600 tracking-wider">ESTABLISHED</p>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-serif text-gray-900">500+</p>
                  <p className="text-sm text-gray-600 tracking-wider">MEMBERS</p>
                </div>
                <div className="text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-serif text-gray-900">12</p>
                  <p className="text-sm text-gray-600 tracking-wider">CLUBS</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-serif text-gray-900">5</p>
                  <p className="text-sm text-gray-600 tracking-wider">REGIONS</p>
                </div>
              </div>

              {/* Social Media */}
              {(federation.website || federation.facebook || federation.instagram || federation.twitter || federation.youtube) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-serif tracking-wide mb-6 text-gray-900">CONNECT WITH US</h2>
                  <div className="flex flex-wrap gap-4">
                    {federation.website && (
                      <a
                        href={federation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Globe className="h-5 w-5" />
                        Website
                      </a>
                    )}
                    {federation.facebook && (
                      <a
                        href={federation.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                        Facebook
                      </a>
                    )}
                    {federation.instagram && (
                      <a
                        href={federation.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                        Instagram
                      </a>
                    )}
                    {federation.twitter && (
                      <a
                        href={federation.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                        Twitter
                      </a>
                    )}
                    {federation.youtube && (
                      <a
                        href={federation.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-serif tracking-wide mb-6 text-gray-900">CONTACT</h2>
                  <div className="space-y-4">
                    {federation.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-red-600" />
                        <a
                          href={`mailto:${federation.email}`}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                        >
                          {federation.email}
                        </a>
                      </div>
                    )}
                    {federation.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-600" />
                        <a
                          href={`tel:${federation.phone}`}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                        >
                          {federation.phone}
                        </a>
                      </div>
                    )}
                    {federation.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-1" />
                        <p className="text-gray-600">{federation.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-serif tracking-wide mb-6 text-gray-900">LEADERSHIP</h2>
                  <div className="space-y-4">
                    {federation.president && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1 tracking-wider">PRESIDENT</p>
                        <p className="text-lg text-gray-900">{federation.president}</p>
                      </div>
                    )}
                    {federation.secretary && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1 tracking-wider">SECRETARY GENERAL</p>
                        <p className="text-lg text-gray-900">{federation.secretary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="px-8 bg-red-600 hover:bg-red-700">
                  View Full Profile
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-red-600 text-red-600 hover:bg-red-50">
                  View Clubs
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-red-600 text-red-600 hover:bg-red-50">
                  Upcoming Events
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
