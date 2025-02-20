'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            // Call your token exchange endpoint
            fetch(`/api/spotify/callback?code=${code}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data);
                        localStorage.setItem('access_token', data.access_token)
                        localStorage.setItem('refresh_token', data.refresh_token)
                        // Handle successful login
                        router.push('/'); // or wherever you want to redirect
                    } else {
                        console.error('Login failed:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error during token exchange:', error);
                });
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Logging you in...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}