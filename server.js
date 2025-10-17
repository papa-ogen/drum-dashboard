import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Import route handlers
import { initializeSegments, getSegments } from "./routes/segments.js";
import { initializeExercises, getExercises } from "./routes/exercises.js";
import {
  initializeSessions,
  getSessions,
  createSession,
} from "./routes/sessions.js";
import {
  initializeAchievements,
  getUserAchievements,
  unlockUserAchievement,
} from "./routes/achievements.js";
import { initializeAlbums, getAlbums, createAlbum } from "./routes/albums.js";
import { getSongs } from "./routes/songs.js";

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
app.get("/api/segments", (req, res) => getSegments(req, res, db));
app.get("/api/exercises", (req, res) => getExercises(req, res, db));
app.get("/api/sessions", (req, res) => getSessions(req, res, db));
app.post("/api/sessions", (req, res) => createSession(req, res, db));
app.get("/api/achievements", (req, res) => getUserAchievements(req, res, db));
app.post("/api/achievements", (req, res) =>
  unlockUserAchievement(req, res, db)
);
app.get("/api/albums", (req, res) => getAlbums(req, res, db));
app.post("/api/albums", (req, res) => createAlbum(req, res, db));
app.get("/api/songs", (req, res) => getSongs(req, res, db));

app.listen(PORT, async () => {
  await db.read();
  let dataModified = false;

  // Initialize all data in the correct order
  try {
    await initializeSegments(db);
    await initializeExercises(db);
    await initializeSessions(db);
    await initializeAchievements(db);
    await initializeAlbums(db);

    console.log("All data initialization completed successfully.");
  } catch (error) {
    console.error("Error during data initialization:", error);
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
