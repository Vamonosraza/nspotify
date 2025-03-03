'use client'
import { useAuth } from "../context/authContext";

const SpotifyPlayer = () => {
    const { user } = useAuth();

    if (!user) return null; 

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
            <iframe
                src={`https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp`}
                width="100%"
                height="80"
                allow="encrypted-media"
                className="rounded bg-gray-700"
            ></iframe>
        </div>
    );
};

export default SpotifyPlayer;