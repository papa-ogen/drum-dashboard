import React, { useState } from "react";

// A free test API key from TheAudioDB
const API_KEY = "123";

export default function AlbumSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setMessage("");
    setResults([]);

    try {
      const response = await fetch(
        `https://www.theaudiodb.com/api/v1/json/${API_KEY}/searchalbum.php?s=${query}`
      );
      const data = await response.json();

      if (data.album) {
        setResults(data.album);
      } else {
        setMessage("No albums found.");
      }
    } catch (err) {
      setError("Failed to search for albums. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAlbum = async (album) => {
    const albumPayload = {
      id: album.idAlbum,
      artist: album.strArtist,
      name: album.strAlbum,
      year: album.intYearReleased,
      artwork: album.strAlbumThumb,
    };

    try {
      const response = await fetch("http://localhost:3001/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add album.");
      }

      setMessage(`'${album.strAlbum}' added successfully!`);
      onAlbumAdded(); // Notify parent to refresh album list
    } catch (err) {
      setMessage(err.message); // Show error like "Album already exists"
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Find Album</h2>
      <form
        onSubmit={handleSearch}
        style={{ ...styles.form, gap: "0.5rem", marginBottom: "1rem" }}
      >
        <input
          style={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Led Zeppelin IV"
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={styles.errorText}>{error}</p>}
      {message && <p style={styles.messageText}>{message}</p>}

      <div style={styles.resultsContainer}>
        {results.map((album) => (
          <div key={album.idAlbum} style={styles.resultItem}>
            <img
              src={album.strAlbumThumb + "/preview"}
              alt={album.strAlbum}
              style={styles.artwork}
            />
            <div style={styles.albumInfo}>
              <p style={styles.albumName}>{album.strAlbum}</p>
              <p style={styles.artistName}>
                {album.strArtist} ({album.intYearReleased})
              </p>
            </div>
            <button
              onClick={() => handleAddAlbum(album)}
              style={styles.addButton}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Basic styles to match the main app
const styles = {
  card: {
    backgroundColor: "#2d3748",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #4a5568",
  },
  cardTitle: { margin: 0, marginBottom: "1rem", fontSize: "1.25rem" },
  form: { display: "flex", flexDirection: "column" },
  input: {
    backgroundColor: "#1a202c",
    color: "#e2e8f0",
    border: "1px solid #4a5568",
    borderRadius: "0.25rem",
    padding: "0.5rem",
  },
  button: {
    backgroundColor: "#4c51bf",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  errorText: { color: "#c53030", marginTop: "0.5rem" },
  messageText: { color: "#38a169", marginTop: "0.5rem" },
  resultsContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  resultItem: { display: "flex", alignItems: "center", gap: "1rem" },
  artwork: {
    width: "50px",
    height: "50px",
    borderRadius: "0.25rem",
    objectFit: "cover",
  },
  albumInfo: { flex: 1 },
  albumName: { margin: 0, fontWeight: "bold" },
  artistName: { margin: 0, fontSize: "0.875rem", color: "#a0aec0" },
  addButton: {
    backgroundColor: "#38a169",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
  },
};
