'use client';

import { useAuth } from '../context/authContext';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <p className="text-white">Please log in to view your profile.</p>;
    }

    return (
        <div className="text-white p-4">
            <h1 className="text-3xl mb-4">Profile</h1>
            <div className="bg-gray-800 p-4 rounded">
                <p><strong>Name:</strong> {user.display_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <img 
                    src={user.images?.[0]?.url} 
                    alt={`${user.display_name}'s profile`} 
                    className="w-32 h-32 rounded-full mt-4"
                />
            </div>
        </div>
    );
};

export default ProfilePage;
