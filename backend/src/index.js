require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
const {redirect} = require("next/navigation.js");
const app = express();

const clientId = process.env.SPOTIFY_CLIENT_IDSPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
