'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

const ListeningHistoryPage = () => {
    const { user, accessToken } = useAuth();
    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (user && accessToken) {
            fetch('/api/spotify/listening-history', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setHistory(data))
                .catch((err) => console.error('Error fetching listening history:', err));
        }
    }, [user, accessToken]);

    if (!user) {
        return <p className="text-white">Please log in to view your listening history.</p>;
    }

    return (
        <div className="text-white max-w-5xl mx-auto p-4">
            <h1 className="text-3xl mb-4">Listening History</h1>
            {history ? (
                <ul>
                    {history.map((track, index) => (
                        <li key={index} className="p-2 bg-gray-800 mb-2 rounded flex items-center gap-4">
                            {track.albumArt && (
                                <img src={track.albumArt} alt={track.title} className="w-12 h-12 rounded" />
                            )}
                            <div>
                                <p className="font-bold">{track.artist} - {track.title}</p>
                                <p className="text-sm text-gray-400">{track.album}</p>
                                <p className="text-xs text-gray-500">{new Date(track.playedAt).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading listening history...</p>
            )}
        </div>
    );
};

export default ListeningHistoryPage;


