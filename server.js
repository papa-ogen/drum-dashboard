import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const adapter = new JSONFile("db.json");
const db = new Low(adapter, {
  sessions: [],
  exercises: [],
  segments: [],
  userAchievements: [],
});

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get("/api/segments", async (req, res) => {
  await db.read();
  res.json(db.data.segments || []);
});

app.get("/api/exercises", async (req, res) => {
  await db.read();
  res.json(db.data.exercises);
});

app.get("/api/sessions", async (req, res) => {
  await db.read();
  res.json(db.data.sessions);
});

app.post("/api/sessions", async (req, res) => {
  const newSession = req.body;

  if (
    !newSession.date ||
    !newSession.exercise ||
    !newSession.bpm ||
    !newSession.time
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Add a server-generated ID and sort
  newSession.id = uuidv4();
  db.data.sessions.push(newSession);
  db.data.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  await db.write();

  res.status(201).json(newSession);
});

// --- Achievement Routes ---
app.get("/api/achievements", async (req, res) => {
  await db.read();
  res.json(db.data.userAchievements || []);
});

app.post("/api/achievements", async (req, res) => {
  await db.read();
  const { achievementId, unlockedAt } = req.body;

  if (!achievementId || !unlockedAt) {
    return res
      .status(400)
      .json({ error: "achievementId and unlockedAt are required." });
  }

  // Check if achievement already exists
  const existing = db.data.userAchievements.find(
    (a) => a.achievementId === achievementId
  );

  if (existing) {
    return res.status(409).json({ error: "Achievement already unlocked." });
  }

  const newAchievement = {
    id: uuidv4(),
    achievementId,
    unlockedAt,
  };

  db.data.userAchievements.push(newAchievement);
  await db.write();

  res.status(201).json(newAchievement);
});

app.get("/api/albums", async (req, res) => {
  await db.read();
  res.json(db.data.albums);
});

app.post("/api/albums", async (req, res) => {
  await db.read();
  const { id, artist, name, year, artwork } = req.body;

  if (!id || !artist || !name || !year) {
    return res.status(400).json({ error: "Missing required album fields." });
  }

  const existingAlbum = db.data.albums.find((album) => album.id === id);
  if (existingAlbum) {
    return res.status(409).json({ error: "Album already exists." });
  }

  const newAlbum = { id, artist, name, year, artwork };
  db.data.albums.push(newAlbum);
  await db.write();

  res.status(201).json(newAlbum);
});

// --- Song Suggestions Routes ---
app.get("/api/songs", async (req, res) => {
  const { bpm, limit = 10 } = req.query;

  if (!bpm) {
    return res.status(400).json({ error: "BPM parameter is required." });
  }

  const targetBpm = parseInt(bpm);
  const songLimit = parseInt(limit);

  // Mock song data - in a real implementation, this would come from a music API
  const mockSongs = [
    {
      id: "song-1",
      title: "Song Title 1",
      artist: "Artist Name 1",
      bpm: targetBpm,
      genre: "Rock",
      duration: "3:45",
      previewUrl: "https://example.com/preview1.mp3",
      spotifyUrl: "https://open.spotify.com/track/1",
    },
    {
      id: "song-2",
      title: "Song Title 2",
      artist: "Artist Name 2",
      bpm: targetBpm,
      genre: "Pop",
      duration: "4:12",
      previewUrl: "https://example.com/preview2.mp3",
      spotifyUrl: "https://open.spotify.com/track/2",
    },
    {
      id: "song-3",
      title: "Song Title 3",
      artist: "Artist Name 3",
      bpm: targetBpm,
      genre: "Electronic",
      duration: "3:28",
      previewUrl: "https://example.com/preview3.mp3",
      spotifyUrl: "https://open.spotify.com/track/3",
    },
    {
      id: "song-4",
      title: "Song Title 4",
      artist: "Artist Name 4",
      bpm: targetBpm,
      genre: "Jazz",
      duration: "5:33",
      previewUrl: "https://example.com/preview4.mp3",
      spotifyUrl: "https://open.spotify.com/track/4",
    },
    {
      id: "song-5",
      title: "Song Title 5",
      artist: "Artist Name 5",
      bpm: targetBpm,
      genre: "Funk",
      duration: "4:01",
      previewUrl: "https://example.com/preview5.mp3",
      spotifyUrl: "https://open.spotify.com/track/5",
    },
    {
      id: "song-6",
      title: "Song Title 6",
      artist: "Artist Name 6",
      bpm: targetBpm,
      genre: "Blues",
      duration: "3:52",
      previewUrl: "https://example.com/preview6.mp3",
      spotifyUrl: "https://open.spotify.com/track/6",
    },
    {
      id: "song-7",
      title: "Song Title 7",
      artist: "Artist Name 7",
      bpm: targetBpm,
      genre: "Metal",
      duration: "4:18",
      previewUrl: "https://example.com/preview7.mp3",
      spotifyUrl: "https://open.spotify.com/track/7",
    },
    {
      id: "song-8",
      title: "Song Title 8",
      artist: "Artist Name 8",
      bpm: targetBpm,
      genre: "Indie",
      duration: "3:37",
      previewUrl: "https://example.com/preview8.mp3",
      spotifyUrl: "https://open.spotify.com/track/8",
    },
    {
      id: "song-9",
      title: "Song Title 9",
      artist: "Artist Name 9",
      bpm: targetBpm,
      genre: "Alternative",
      duration: "4:25",
      previewUrl: "https://example.com/preview9.mp3",
      spotifyUrl: "https://open.spotify.com/track/9",
    },
    {
      id: "song-10",
      title: "Song Title 10",
      artist: "Artist Name 10",
      bpm: targetBpm,
      genre: "Country",
      duration: "3:41",
      previewUrl: "https://example.com/preview10.mp3",
      spotifyUrl: "https://open.spotify.com/track/10",
    },
  ];

  // Return limited number of songs
  const songs = mockSongs.slice(0, songLimit);

  res.json(songs);
});

app.listen(PORT, async () => {
  await db.read();
  let dataModified = false;

  // 1. Check if segments exist. If not, create them.
  if (!db.data.segments || db.data.segments.length === 0) {
    console.log("Segments are empty. Creating 3 segments...");
    // Start from the first exercise date (approximately 4 months per segment)
    db.data.segments = [
      {
        id: "segment-1",
        name: "Segment 1",
        order: 1,
        startDate: "2025-08-18",
        endDate: "2025-12-17",
      },
      {
        id: "segment-2",
        name: "Segment 2",
        order: 2,
        startDate: "2025-12-18",
        endDate: "2026-04-17",
      },
      {
        id: "segment-3",
        name: "Segment 3",
        order: 3,
        startDate: "2026-04-18",
        endDate: "2026-08-17",
      },
    ];
    dataModified = true;
  }

  // 2. Check if exercises exist. If not, create them with UUIDs.
  if (db.data.exercises.length === 0) {
    console.log("Exercises are empty. Populating with initial sample data...");
    const defaultSegmentId = db.data.segments[0]?.id || "segment-1";
    db.data.exercises.push(
      { id: uuidv4(), name: "Technique 1", segmentId: defaultSegmentId },
      { id: uuidv4(), name: "Subdivision Ladder", segmentId: defaultSegmentId },
      { id: uuidv4(), name: "Weak Leg Builder", segmentId: defaultSegmentId },
      { id: uuidv4(), name: "Endurance", segmentId: defaultSegmentId }
    );
    dataModified = true;
  }

  // 3. Check if sessions exist. If not, create them using the new exercise IDs.
  if (db.data.sessions.length === 0) {
    console.log("Database is empty. Populating with initial session data...");
    const exercises = db.data.exercises;
    db.data.sessions.push(
      // Technique 1
      {
        id: uuidv4(),
        date: "2025-08-18",
        exercise: exercises[0].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-19",
        exercise: exercises[0].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-20",
        exercise: exercises[0].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-21",
        exercise: exercises[0].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-22",
        exercise: exercises[0].id,
        bpm: 111,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-23",
        exercise: exercises[0].id,
        bpm: 112,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-24",
        exercise: exercises[0].id,
        bpm: 115,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-25",
        exercise: exercises[0].id,
        bpm: 115,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-26",
        exercise: exercises[0].id,
        bpm: 115,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-27",
        exercise: exercises[0].id,
        bpm: 115,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-30",
        exercise: exercises[0].id,
        bpm: 116,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-31",
        exercise: exercises[0].id,
        bpm: 120,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-01",
        exercise: exercises[0].id,
        bpm: 120,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-02",
        exercise: exercises[0].id,
        bpm: 120,
        time: 360,
      },
      {
        id: uuidv4(),
        date: "2025-09-03",
        exercise: exercises[0].id,
        bpm: 121,
        time: 360,
      },
      // Subdivision Ladder
      {
        id: uuidv4(),
        date: "2025-08-18",
        exercise: exercises[1].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-19",
        exercise: exercises[1].id,
        bpm: 120,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-20",
        exercise: exercises[1].id,
        bpm: 120,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-21",
        exercise: exercises[1].id,
        bpm: 125,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-22",
        exercise: exercises[1].id,
        bpm: 126,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-23",
        exercise: exercises[1].id,
        bpm: 127,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-24",
        exercise: exercises[1].id,
        bpm: 128,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-25",
        exercise: exercises[1].id,
        bpm: 130,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-26",
        exercise: exercises[1].id,
        bpm: 130,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-27",
        exercise: exercises[1].id,
        bpm: 130,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-30",
        exercise: exercises[1].id,
        bpm: 135,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-31",
        exercise: exercises[1].id,
        bpm: 135,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-01",
        exercise: exercises[1].id,
        bpm: 135,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-02",
        exercise: exercises[1].id,
        bpm: 130,
        time: 360,
      },
      {
        id: uuidv4(),
        date: "2025-09-03",
        exercise: exercises[1].id,
        bpm: 135,
        time: 360,
      },
      // Weak Leg Builder
      {
        id: uuidv4(),
        date: "2025-08-18",
        exercise: exercises[2].id,
        bpm: 90,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-19",
        exercise: exercises[2].id,
        bpm: 90,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-20",
        exercise: exercises[2].id,
        bpm: 90,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-21",
        exercise: exercises[2].id,
        bpm: 90,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-22",
        exercise: exercises[2].id,
        bpm: 91,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-23",
        exercise: exercises[2].id,
        bpm: 91,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-24",
        exercise: exercises[2].id,
        bpm: 91,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-25",
        exercise: exercises[2].id,
        bpm: 91,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-26",
        exercise: exercises[2].id,
        bpm: 91,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-27",
        exercise: exercises[2].id,
        bpm: 91,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-30",
        exercise: exercises[2].id,
        bpm: 92,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-31",
        exercise: exercises[2].id,
        bpm: 92,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-01",
        exercise: exercises[2].id,
        bpm: 92,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-02",
        exercise: exercises[2].id,
        bpm: 92,
        time: 360,
      },
      {
        id: uuidv4(),
        date: "2025-09-03",
        exercise: exercises[2].id,
        bpm: 93,
        time: 360,
      },
      // Endurance
      {
        id: uuidv4(),
        date: "2025-08-21",
        exercise: exercises[3].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-22",
        exercise: exercises[3].id,
        bpm: 110,
        time: 120,
      },
      {
        id: uuidv4(),
        date: "2025-08-23",
        exercise: exercises[3].id,
        bpm: 110,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-24",
        exercise: exercises[3].id,
        bpm: 110,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-25",
        exercise: exercises[3].id,
        bpm: 110,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-26",
        exercise: exercises[3].id,
        bpm: 110,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-27",
        exercise: exercises[3].id,
        bpm: 112,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-30",
        exercise: exercises[3].id,
        bpm: 113,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-08-31",
        exercise: exercises[3].id,
        bpm: 113,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-01",
        exercise: exercises[3].id,
        bpm: 113,
        time: 240,
      },
      {
        id: uuidv4(),
        date: "2025-09-02",
        exercise: exercises[3].id,
        bpm: 113,
        time: 360,
      },
      {
        id: uuidv4(),
        date: "2025-09-03",
        exercise: exercises[3].id,
        bpm: 115,
        time: 360,
      }
    );
    dataModified = true;
  }

  // 4. Initialize userAchievements if it doesn't exist
  if (!db.data.userAchievements) {
    db.data.userAchievements = [];
    dataModified = true;
  }

  // 5. Write to the file only if data was changed.
  if (dataModified) {
    await db.write();
    console.log("Sample data has been written to db.json.");
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
