import Image from 'next/image';
import { formatDuration } from '../../utils/spotify';
import { Play, ExternalLink } from 'lucide-react';

export default function TrackCard({ track }) {
    const imageUrl = track.album.images[0]?.url;

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all ease-in-out duration-300 transform hover:scale-105">
            <div className="flex gap-4 md:gap-6">
                {imageUrl ? (
                    <div className="relative w-16 md:w-20 h-16 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-purple-600">
                        <Image
                            src={imageUrl}
                            alt={track.album.name}
                            className="object-cover rounded-lg"
                            fill
                            sizes="(max-width: 768px) 64px, 80px"
                            priority={false}
                        />
                    </div>
                ) : (
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-gray-600 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-grow min-w-0"> {/* min-w-0 helps with text truncation */}
                    <h3 className="font-semibold text-xl md:text-2xl text-white truncate">
                        {track.name}
                    </h3>
                    <p className="text-purple-300 text-sm truncate mb-2">
                        {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
                        <span className="text-sm text-gray-400">
                            {formatDuration(track.duration_ms)}
                        </span>
                        <a
                            href={track.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600 transition-colors"
                            aria-label="Open in Spotify"
                        >
                            <ExternalLink size={18} />
                        </a>
                        <button 
                            className="text-purple-500 hover:text-purple-400 transition-colors"
                            aria-label="Play track"
                        >
                            <Play size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
