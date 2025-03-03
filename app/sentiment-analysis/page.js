'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

const SentimentAnalysisPage = () => {
    const { user } = useAuth();
    const [sentimentData, setSentimentData] = useState(null);

    useEffect(() => {
        if (user) {
            fetch('/api/sentiment-analysis')
                .then((res) => res.json())
                .then((data) => setSentimentData(data))
                .catch((err) => console.error('Error fetching sentiment data:', err));
        }
    }, [user]);

    if (!user) {
        return <p className="text-white">Please log in to view sentiment analysis.</p>;
    }

    return (
        <div className="text-white p-4">
            <h1 className="text-3xl mb-4">Sentiment Analysis</h1>
            {sentimentData ? (
                <pre className="bg-gray-800 p-4 rounded">{JSON.stringify(sentimentData, null, 2)}</pre>
            ) : (
                <p>Loading sentiment data...</p>
            )}
        </div>
    );
};

export default SentimentAnalysisPage;
