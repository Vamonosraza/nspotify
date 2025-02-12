import React from 'react';
import Link from 'next/link';

const Page = () => {
    return (
        <div>
            <h1>About Page</h1>
            <Link href="/public">
                <button className="btn btn-primary">Home</button>
            </Link>
        </div>
    )
}