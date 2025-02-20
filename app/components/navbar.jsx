// app/components/Navbar.js
'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { user, login, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const handleLogin = () => {
        router.push('/api/spotify/login');
    };

    const handleLogout = () => {
        logout();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
                    NSpotify
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-4 items-center">
                    {user ? (
                        <>
                            <span className="text-lg">{user.display_name}</span>
                            <button 
                                onClick={handleLogout} 
                                className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleLogin} 
                            className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition"
                        >
                            Login with Spotify
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden" 
                    onClick={toggleMobileMenu} 
                    aria-label="Toggle Mobile Menu"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 mt-4">
                    {user ? (
                        <>
                            <span className="text-lg">{user.display_name}</span>
                            <button 
                                onClick={handleLogout} 
                                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition w-full text-center"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleLogin} 
                            className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition w-full text-center"
                        >
                            Login with Spotify
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
