import './globals.css';
import Navbar from './components/navbar';
import { AuthProvider } from './context/authContext';
import SpotifyPlayer from './components/player';

export const metadata = {
    title: 'Music Explorer',
    description: 'Search for your favorite music with Spotify',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-900 min-h-screen overflow-auto">
                <AuthProvider>
                    <main className="mx-auto pb-24">
                        <Navbar />
                        {children}
                        <SpotifyPlayer />
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
