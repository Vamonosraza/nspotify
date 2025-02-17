import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import cors from 'cors';
import { redirect } from 'next/navigation.js';
const app = express();

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_IDSPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

app.use(cors());

app.get('/login', (req, res) => {
    const scope = 'user-library-read playlist-read-private'
    const auth_query_params = querystring.stringify(
        {
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirect_uri
        }
    )

    res.redirect('https://accounts.spotify.com/authorize?' + auth_query_params)
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
      const response = await axios({
          method: "post",
          url: 'https://accounts.spotify.com/api/token',
          form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
          },
          headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
          },
          json: true
      })

      const {access_token, refresh_token} = response.data;
      res.redirect('http://localhost:3000/home?access_token=' + access_token + '&refresh_token=' + refresh_token);
  } catch (err){
        console.log(err)
      res.send('Error getting Tokens')
  }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server is running on port 8888');
});