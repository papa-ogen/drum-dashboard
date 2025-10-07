import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const adapter = new JSONFile("db.json");
const db = new Low(adapter, { sessions: [], exercises: [] });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---
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

app.listen(PORT, async () => {
  await db.read();
  let dataModified = false;

  // 1. Check if exercises exist. If not, create them with UUIDs.
  if (db.data.exercises.length === 0) {
    console.log("Exercises are empty. Populating with initial sample data...");
    db.data.exercises.push(
      { id: uuidv4(), name: "Technique 1" },
      { id: uuidv4(), name: "Subdivision Ladder" },
      { id: uuidv4(), name: "Weak Leg Builder" },
      { id: uuidv4(), name: "Endurance" }
    );
    dataModified = true;
  }

  // 2. Check if sessions exist. If not, create them using the new exercise IDs.
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

  // 3. Write to the file only if data was changed.
  if (dataModified) {
    await db.write();
    console.log("Sample data has been written to db.json.");
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
