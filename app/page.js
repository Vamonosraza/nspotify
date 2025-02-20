'use client';

import { useState, useEffect } from 'react';
import { searchSpotify } from '../utils/spotify';
import TrackCard from './components/trackcard';
import { Search, Loader } from 'lucide-react';
import { useAuth } from './context/authContext';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, login } = useAuth();

    useEffect(() => {
        // If there's no user, fetch the user profile
        if (!user) {
            login();
        }
    }, [user, login]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await searchSpotify(searchTerm);
            setResults(data);
        } catch (err) {
            setError('Failed to fetch search results. Please try again.');
        } finally {
            setIsLoading(false);
            setSearchTerm('');
        }
    };

    return (
        <div className="max-w-full mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                Spotify Music Explorer
            </h1>

            <form onSubmit={handleSearch} className="mb-8" suppressHydrationWarning>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for songs, artists, or albums..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        suppressHydrationWarning
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-green-500 disabled:opacity-50"
                        suppressHydrationWarning
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            <Search size={20} />
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {results && results.tracks && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Found {results.tracks.total} tracks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {results.tracks.items.map((track) => (
                            <TrackCard key={track.id} track={track} />
                        ))}
                    </div>
                </div>
            )}

            {results?.tracks?.items?.length === 0 && (
                <div className="text-center text-gray-600 py-8">
                    No results found for "{searchTerm}"
                </div>
            )}
        </div>
    );
}
