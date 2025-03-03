'use client';

import { useState, useEffect } from 'react';
import { searchSpotify } from '../utils/spotify';
import TrackCard from './components/trackcard';
import { Search, Loader, ChevronDown } from 'lucide-react';
import { useAuth } from './context/authContext';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, login } = useAuth();
    const [searchType, setSearchType] = useState('track');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3x3 grid in desktop view

    useEffect(() => {
        // If there's no user, fetch the user profile
        if (!user) {
            login();
        }
    }, [user, login]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.search-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setError(null);
        setCurrentPage(1); 
        

        try {
            const data = await searchSpotify(searchTerm, searchType);
            setResults(data);
        } catch (err) {
            setError('Failed to fetch search results. Please try again.');
        } finally {
            
            setSearchTerm('');
            setIsLoading(false);
        }
    };

    const handleTypeChange = (type) => {
        setSearchType(type);
        setIsDropdownOpen(false);
    };

    // Pagination calculations
    const totalItems = results?.[`${searchType}s`]?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const displayedItems = results?.[`${searchType}s`]?.items || [];
    const paginatedItems = displayedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        // If we're at the end of current results and there are more results
        if (pageNumber > Math.ceil(displayedItems.length / itemsPerPage) && 
            results?.[`${searchType}s`]?.next) {
            // Load more results from API
            setCurrentPage(pageNumber);
        } else if (pageNumber >= 1 && pageNumber <= Math.ceil(displayedItems.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };
    console.log(paginatedItems);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 text-white min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
                Spotify Music Explorer
            </h1>

            <form onSubmit={handleSearch} className="mb-8" suppressHydrationWarning>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder={`Search for ${searchType}s...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            suppressHydrationWarning
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-500 disabled:opacity-50"
                            suppressHydrationWarning
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <Search size={20} />
                            )}
                        </button>
                    </div>
                    
                    <div className="relative w-full md:w-52 search-dropdown">
                        <button 
                            type="button"
                            className="w-full px-4 py-3 rounded-lg border border-gray-700 flex justify-between items-center bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="capitalize">{searchType === 'track' ? 'Tracks' : 
                                  searchType === 'artist' ? 'Artists' : 
                                  searchType === 'album' ? 'Albums' : 
                                  searchType === 'playlist' ? 'Playlists' : 'Tracks'}</span>
                            <ChevronDown size={16} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                <ul>
                                    <li 
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${searchType === 'track' ? 'bg-gray-700 text-green-400' : ''}`}
                                        onClick={() => handleTypeChange('track')}
                                    >
                                        Tracks
                                    </li>
                                    <li 
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${searchType === 'artist' ? 'bg-gray-700 text-green-400' : ''}`}
                                        onClick={() => handleTypeChange('artist')}
                                    >
                                        Artists
                                    </li>
                                    <li 
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${searchType === 'album' ? 'bg-gray-700 text-green-400' : ''}`}
                                        onClick={() => handleTypeChange('album')}
                                    >
                                        Albums
                                    </li>
                                    <li 
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${searchType === 'playlist' ? 'bg-gray-700 text-green-400' : ''}`}
                                        onClick={() => handleTypeChange('playlist')}
                                    >
                                        Playlists
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {error && (
                <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {results && results[`${searchType}s`] && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                        Found {results[`${searchType}s`].total} {searchType}s
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {paginatedItems.map((item) => (
                            item && (
                            <TrackCard key={item?.id} track={item} type={searchType} />
                            )
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700"
                            >
                                Previous
                            </button>
                            
                            {/* Show page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-3 py-2 rounded-md ${
                                            currentPage === pageNumber
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {results?.[`${searchType}s`]?.items?.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                    No results found for "{searchTerm}"
                </div>
            )}
        </div>
    );
}