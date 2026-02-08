import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { User as UserIcon } from 'lucide-react';
import { getProfileScreen } from '@/lib/api';
import type { ProfileScreenResponse } from '@/types/api';
import { useAuthStore } from '@/lib/auth-store';

export function AppNavigation() {
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileScreenResponse | null>(null);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside BOTH dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node);

      // Only close if click is outside BOTH dropdowns
      if (isOutsideDesktop && isOutsideMobile) {
        setIsAvatarDropdownOpen(false);
      }
    };

    if (isAvatarDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAvatarDropdownOpen]);

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/library', label: 'Library' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  // Fetch profile data on mount for credits display
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileScreen();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleAccountClick = () => {
    setIsAvatarDropdownOpen(false);
    navigate({ to: '/profile' });
  };

  const handleLogout = async () => {
    setIsAvatarDropdownOpen(false);
    await signOut();
    navigate({ to: '/login' });
  };

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/home" className="text-xl font-bold hover:opacity-80 transition-opacity">
              Primed
            </Link>

            {/* Desktop: Nav Links (center) + Avatar (right) */}
            <div className="hidden md:flex items-center gap-8">
              {/* Nav Links */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation flex items-center"
                  activeProps={{
                    className: 'text-white border-b-2 border-white',
                  }}
                  inactiveProps={{
                    className: 'text-gray-400 hover:text-white',
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {/* Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  aria-label="User menu"
                  aria-expanded={isAvatarDropdownOpen}
                  type="button"
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {isAvatarDropdownOpen && (
                  <div ref={desktopDropdownRef} className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/20 shadow-xl z-[60]">
                    <div className="w-full px-4 py-3 text-left text-sm text-white/80 border-b border-white/10">
                      Credits: {profileData?.num_drills_left ?? 0}
                    </div>
                    <button
                      onClick={handleAccountClick}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors min-h-[44px]"
                      type="button"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors border-t border-white/10 min-h-[44px]"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Avatar (always visible) */}
            <div className="flex md:hidden items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  aria-label="User menu"
                  aria-expanded={isAvatarDropdownOpen}
                  type="button"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
                {/* Mobile dropdown */}
                {isAvatarDropdownOpen && (
                  <div ref={mobileDropdownRef} className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-2rem)] bg-black border border-white/20 shadow-xl z-[60]">
                    <div className="w-full px-4 py-3 text-left text-sm text-white/80 border-b border-white/10">
                      Credits: {profileData?.num_drills_left ?? 0}
                    </div>
                    <button
                      onClick={handleAccountClick}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors min-h-[44px]"
                      type="button"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors border-t border-white/10 min-h-[44px]"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 min-h-[44px] min-w-[64px] touch-manipulation"
              activeProps={{
                className: 'text-white',
              }}
              inactiveProps={{
                className: 'text-gray-500 hover:text-gray-300',
              }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
