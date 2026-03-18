import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Users, Globe, Facebook, Instagram, Twitter, Youtube, ExternalLink, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import type { Federation } from "../data/federations";

interface FederationModalProps {
  federation: Federation | null;
  onClose: () => void;
}

export default function FederationModal({ federation, onClose }: FederationModalProps) {
  const [, navigate] = useLocation();
  if (!federation) return null;

  const federationSlug = federation.slug || `fed-${federation.id}`;

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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'ministry':
        return 'from-amber-500/20 to-orange-600/20';
      case 'commission':
        return 'from-blue-500/20 to-indigo-600/20';
      case 'umbrella':
        return 'from-purple-500/20 to-pink-600/20';
      case 'federation':
        return 'from-red-500/20 to-rose-600/20';
      default:
        return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop with enhanced blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        />

        {/* Modal with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-4 md:inset-8 lg:inset-12 z-50 overflow-hidden rounded-3xl"
          style={{
            background: 'rgba(17, 17, 17, 0.75)',
            backdropFilter: 'blur(40px) saturate(150%)',
            WebkitBackdropFilter: 'blur(40px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Close Button - Glass */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Hero Image with gradient overlay */}
            <div className="relative h-72 md:h-96 w-full overflow-hidden">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${federation.image})`,
                }}
              />
              {/* Gradient overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(federation.category)} mix-blend-overlay`} />
              
              {/* Floating badge */}
              <div className="absolute top-6 left-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-2 rounded-full text-xs font-medium tracking-wider text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {getCategoryLabel(federation.category)}
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 -mt-20 relative z-10">
              {/* Header Card - Glass */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl p-8 mb-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide mb-4 text-white">
                  {federation.name}
                </h1>
                {federation.description && (
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {federation.description}
                  </p>
                )}
              </motion.div>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-widest text-white"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <MapPin className="h-3 w-3" />
                  NAMIBIA · {federation.category.toUpperCase()}
                </span>
              </motion.div>

              {/* Social Media - Glass Pills */}
              {(federation.website || federation.facebook || federation.instagram || federation.twitter || federation.youtube) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-serif tracking-wider mb-4 text-white/80">CONNECT</h2>
                  <div className="flex flex-wrap gap-3">
                    {federation.website && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={federation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: 'white',
                        }}
                      >
                        <Globe className="h-4 w-4" />
                        Website
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </motion.a>
                    )}
                    {federation.facebook && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={federation.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'white',
                        }}
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </motion.a>
                    )}
                    {federation.instagram && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={federation.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(219, 39, 119, 0.3))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          color: 'white',
                        }}
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </motion.a>
                    )}
                    {federation.twitter && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={federation.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(2, 132, 199, 0.3))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(14, 165, 233, 0.3)',
                          color: 'white',
                        }}
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </motion.a>
                    )}
                    {federation.youtube && (
                      <motion.a
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={federation.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(185, 28, 28, 0.3))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: 'white',
                        }}
                      >
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Contact & Leadership - Side by Side Glass Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <h2 className="text-xl font-serif tracking-wider mb-5 text-white/80">CONTACT</h2>
                  <div className="space-y-4">
                    {federation.email && (
                      <motion.a
                        whileHover={{ x: 4 }}
                        href={`mailto:${federation.email}`}
                        className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                      >
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                          <Mail className="h-5 w-5 text-red-400" />
                        </div>
                        <span className="text-sm">{federation.email}</span>
                      </motion.a>
                    )}
                    {federation.phone && (
                      <motion.a
                        whileHover={{ x: 4 }}
                        href={`tel:${federation.phone}`}
                        className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                      >
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                          <Phone className="h-5 w-5 text-green-400" />
                        </div>
                        <span className="text-sm">{federation.phone}</span>
                      </motion.a>
                    )}
                    {federation.address && (
                      <div className="flex items-start gap-4 text-gray-300">
                        <div className="p-2 rounded-xl bg-white/5">
                          <MapPin className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm">{federation.address}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Leadership Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <h2 className="text-xl font-serif tracking-wider mb-5 text-white/80">LEADERSHIP</h2>
                  <div className="space-y-5">
                    {federation.president && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center border border-white/10">
                          <Users className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 tracking-wider mb-1">PRESIDENT</p>
                          <p className="text-white font-medium">{federation.president}</p>
                        </div>
                      </div>
                    )}
                    {federation.secretary && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-white/10">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 tracking-wider mb-1">SECRETARY GENERAL</p>
                          <p className="text-white font-medium">{federation.secretary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons - Navigate to full sub-site */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); navigate(`/federation/${federationSlug}`); }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))',
                    boxShadow: '0 10px 30px -10px rgba(239, 68, 68, 0.5)',
                  }}
                >
                  View Full Profile <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); navigate(`/federation/${federationSlug}/clubs`); }}
                  className="px-8 py-4 rounded-xl font-medium text-white transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  View Clubs
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); navigate(`/federation/${federationSlug}/events`); }}
                  className="px-8 py-4 rounded-xl font-medium text-white transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Upcoming Events
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
