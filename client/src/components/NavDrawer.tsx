import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { X, Facebook, Twitter, Instagram, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useShowLiveNav } from '@/hooks/useShowLiveNav';
import { trpc } from '@/lib/trpc';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BASE_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'News', href: '/news' },
  { label: 'Live', href: '/live' },
  { label: 'Map', href: '/map' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
];

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false });
  const [location] = useLocation();
  const showLive = useShowLiveNav();
  const isLight = theme === "light";
  const NAV_LINKS = useMemo(() => {
    const links = showLive
      ? BASE_NAV_LINKS
      : BASE_NAV_LINKS.filter((l) => l.href !== '/live');
    if (meQuery.data?.role === 'admin') {
      return [...links, { label: 'Admin', href: '/admin' }];
    }
    return links;
  }, [showLive, meQuery.data?.role]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  async function handleSignOut() {
    await signOut();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.nav
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[380px] flex flex-col"
            style={{
              background: 'var(--drawer-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: '1px solid var(--chrome-border)',
              color: 'var(--chrome-fg)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between gap-3 px-6 sm:px-8 py-6"
              style={{ borderBottom: '1px solid var(--chrome-border)' }}
            >
              <Link href="/" onClick={onClose}>
                <span
                  className="text-lg sm:text-xl font-serif tracking-[0.2em] cursor-pointer transition-colors"
                  style={{ color: 'var(--chrome-fg)' }}
                >
                  NAMIBIA SPORTS
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ color: 'var(--chrome-muted)', background: 'var(--chrome-btn-bg)' }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, index) => {
                  const isActive = location === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.06, duration: 0.3 }}
                    >
                      <Link href={link.href}>
                        <span
                          onClick={onClose}
                          className="block py-4 text-3xl font-serif tracking-wide cursor-pointer transition-all duration-200 hover:pl-3"
                          style={{
                            color: isActive ? '#EF4444' : 'var(--chrome-fg)',
                            borderBottom: `1px solid ${isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.04)'}`,
                          }}
                        >
                          {link.label}
                          {isActive && (
                            <span className="ml-3 inline-block w-1.5 h-1.5 rounded-full bg-red-500 align-middle" />
                          )}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* User + Social Footer */}
            <div
              className="px-8 py-6 space-y-6"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              {/* Auth section */}
              {user ? (
                <div className="space-y-3">
                  <p className="text-xs tracking-[0.15em] text-gray-500 uppercase">Signed in as</p>
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <span
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
                      boxShadow: '0 8px 32px -8px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                </Link>
              )}

              {/* Social links */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
