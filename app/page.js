import Image from "next/image";
import Link from "next/link";
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
    }

  return (
      <>
      <h1>Homepage</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      </>
  );
}
