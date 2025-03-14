import './globals.css';
import Navbar from './components/navbar';
import { AuthProvider } from './context/authContext';
import ChatBox from "@/app/components/ChatBox";
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
                <Navbar />
                <main className="p-4 max-w-6xl mx-auto ">{children}</main>
                  <ChatBox />
                  <SpotifyPlayer />
                </AuthProvider>
            </body>
        </html>
    );
}
