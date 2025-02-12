import React from 'react';
import Link from 'next/link';

export default function About (){
    return (
        <div>
            <h1>About Page</h1>
            <Link href="/">
                <button className="btn btn-primary">Home</button>
            </Link>
        </div>
    )
}
