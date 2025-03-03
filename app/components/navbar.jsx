'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Music, Smile, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    router.push('/api/spotify/login');
  };

  const handleLogout = () => {
    logout();
    router.push('/'); // Optionally redirect after logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Nav links appear only if a user is logged in.
  const navLinks = user
    ? [
        {
          name: 'Listening History',
          path: '/listening-history',
          icon: <Music className="w-5 h-5" />,
        },
        {
          name: 'Sentiment Analysis',
          path: '/sentiment-analysis',
          icon: <Smile className="w-5 h-5" />,
        },
        {
          name: user?.display_name,
          path: '/profile',
          icon: user.images && user.images.length > 0 ? (
            <img
              src={user.images[0].url}
              alt="User Avatar"
              className="size-6 rounded-full"
            />
          ) : (
            <User className="w-5 h-5" />
          ),
        },
      ]
    : [];

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile: toggle sidebar button */}
          {user && (
            <button onClick={toggleSidebar} className="md:hidden" aria-label="Toggle Sidebar">
              {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
          {/* Logo with Music Icon */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Music className="w-6 h-6" />
            <h1 className="text-2xl font-bold">NSpotify</h1>
          </div>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {user && navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="flex items-center gap-1 hover:text-gray-300 transition"
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition"
            >
              Login with Spotify
            </button>
          )}
        </div>
        {/* Mobile Login/Logout Button on the right */}
        <div className="md:hidden">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition"
            >
              Login with Spotify
            </button>
          )}
        </div>
      </nav>

      {/* Sidebar for Mobile Navigation (only if user is logged in) */}
      {isSidebarOpen && user && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleSidebar} aria-label="Close Sidebar">
              <X size={24} />
            </button>
          </div>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-4">
                <button
                  onClick={() => {
                    router.push(link.path);
                    toggleSidebar();
                  }}
                  className="flex items-center gap-2 hover:text-gray-300 transition w-full text-left"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
};

export default Navbar;
