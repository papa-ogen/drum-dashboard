// routes/favorites.js

/**
 * Get all favorite songs
 */
export async function getFavorites(req, res, db) {
  try {
    await db.read();
    const favorites = db.data.favorites || [];
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Add a song to favorites
 */
export async function addFavorite(req, res, db) {
  try {
    const song = req.body;
    if (!song || !song.title || !song.artist) {
      return res.status(400).json({ error: "Invalid song payload" });
    }

    await db.read();
    if (!db.data.favorites) db.data.favorites = [];

    const exists = db.data.favorites.some((s) => {
      if (song.spotifyId && s.spotifyId) return s.spotifyId === song.spotifyId;
      return s.title === song.title && s.artist === song.artist;
    });
    if (exists) {
      return res.status(200).json({ message: "Already in favorites" });
    }

    const toStore = {
      title: song.title,
      artist: song.artist,
      bpm: song.bpm ?? null,
      spotifyId: song.spotifyId ?? song.id ?? null,
      preview_url: song.preview_url ?? song.previewUrl ?? null,
      spotifyUrl: song.spotifyUrl ?? null,
      albumArt: song.albumArt ?? null,
      album: song.album ?? null,
      popularity: song.popularity ?? null,
    };

    db.data.favorites.push(toStore);
    await db.write();
    res.status(201).json(toStore);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(400).json({ error: error.message });
  }
}
