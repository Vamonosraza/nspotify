'use client';
import Card from "@/components/Card/card";
import { useState, useEffect} from "react";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

console.log('clientId:', clientId);
console.log('clientSecret:', clientSecret);


export default function Home() {
    const [searchInput, setSearchInput] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        if (!clientId || !clientSecret) {
            console.error('Client ID or Client Secret is missing');
            return;
        }

        const authParams = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        };
        fetch('https://accounts.spotify.com/api/token', authParams)
            .then(response => response.json())
            .then(data => {
                 if (data.access_token) {
                    setAccessToken(data.access_token);
                } else {
                    console.error('Failed to fetch access token:', data);
                }
            })
            .catch(error => console.error('Failed to fetch access token:', error));
    }, []);

    async function search(){
        if (!accessToken) {
            console.error('No access token available');
            return;
        }

        const artistParams = {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
        try {
            const artistID = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, artistParams)
                .then(result => result.json())
                .then(data => {
                    if (data.artists && data.artists.items.length > 0) {
                        return data.artists.items[0].id;
                    } else {
                        console.error('No artist found:', data);
                        return null;
                    }
                });

            if (!artistID) return;

            await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, artistParams)
                .then(result => result.json())
                .then(data => {
                    setAlbums(data.items);
                });
        } catch (error) {
            console.error('Error fetching artist or albums:', error);
        }
    }



  return (
      <>
          <h1>Homepage</h1>
          <div className="mb-4">
              <input
                  type="text"
                  placeholder="Search For Artist"
                  className="input input-bordered w-full max-w-xs"
                  onKeyDown={async event => {
                      if (event.key === "Enter") {
                         await search();
                      }
                  }}
                  onChange={event => setSearchInput(event.target.value)}
              />
              <button className="btn btn-primary ml-2" onClick={async () => await search() }>
                  Search
              </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
              {albums.map((album) => (
                  <Card key={album.id} album={album}/>
              ))}
          </div>
          {/*<div className="grid grid-cols-3 gap-4">*/}
          {/*    <Card/>*/}
          {/*    <Card/>*/}
          {/*    <Card/>*/}
          {/*    <Card/>*/}
          {/*</div>*/}
      </>
  );
}
