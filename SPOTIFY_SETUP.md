# Spotify API Setup

To enable real song suggestions, you need to configure Spotify API credentials:

## 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Click "Create App"
3. Fill in the app details:
   - App name: "Drum Dashboard" (or any name you prefer)
   - App description: "Drum practice song suggestions"
   - Website: `http://localhost:3001` (or your domain)
   - Redirect URI: `http://localhost:3001/callback` (not used for this implementation)
4. Click "Save"

## 2. Get Your Credentials

1. Click on your app in the dashboard
2. Copy the **Client ID** and **Client Secret**

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# API Configuration
VITE_API_URL=http://localhost:3001/api
```

## 4. Install dotenv (if not already installed)

```bash
npm install dotenv
```

## 5. Update server.js

Add this at the top of `server.js`:

```javascript
import dotenv from "dotenv";
dotenv.config();
```

## How It Works

- **With Spotify credentials**: The app will fetch real songs from Spotify's Recommendations API based on BPM
- **Without credentials**: The app will fall back to mock data automatically
- **Error handling**: If Spotify API fails, it gracefully falls back to mock data

## API Features

- Uses Spotify's Recommendations API with `target_tempo` parameter
- Falls back to search + audio features filtering if recommendations don't return enough results
- Includes real song data: title, artist, BPM, duration, preview URLs, album art
- Handles rate limiting and token refresh automatically
