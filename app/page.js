'use client';
import Card from "@/components/Card/card";
import { useState, useEffect} from "react";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;


export default function Home() {
    const [searchInput, setSearchInput] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
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
                setAccessToken(data.access_token)
            });
    }, []);

    async function search(){
        const artistParams = {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
        const artistID = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, artistParams)
            .then(result => result.json())
            .then(data => {
              return data.artists.items[0].id;
            });

          // Get Artist Albums
        await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, artistParams)
            .then(result => result.json())
            .then(data => {
              setAlbums(data.items);
            });
    }



  return (
      <>
          <h1>Homepage</h1>
          <div className="mb-4">
              <input
                  type="text"
                  placeholder="Search For Artist"
                  className="input input-bordered w-full max-w-xs"
                  onKeyDown={event => {
                      if (event.key === "Enter") {
                          search();
                      }
                  }}
                  onChange={event => setSearchInput(event.target.value)}
              />
              <button className="btn btn-primary ml-2" onClick={search}>
                  Search
              </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
              {albums.map((album) => (
                  <Card key={album.id} album={album}/>
              ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
              <Card/>
              <Card/>
              <Card/>
              <Card/>
          </div>
      </>
  );
}
