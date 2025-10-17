// data/songs.js

/**
 * Curated list of songs with known BPM values
 * Fields: title, artist, bpm, optional spotifyId
 */
export const songs = [
  {
    title: "Bad Guy",
    artist: "Billie Eilish",
    bpm: 135,
    spotifyId: "2Fxmhks0bxGSBdJ92vM42m",
  },
  {
    title: "Toxic",
    artist: "Britney Spears",
    bpm: 144,
    spotifyId: "6I9VzXrHxO9rA9A5euc8Ak",
  },
  {
    title: "Sandstorm",
    artist: "Darude",
    bpm: 136,
    spotifyId: "3ZOEytgrvLwQaqXreDs2Jx",
  },
  {
    title: "Beat It",
    artist: "Michael Jackson",
    bpm: 138,
    spotifyId: "3S2R0EVwBSAVMd5UMgKTL0",
  },
  {
    title: "Adagio for Strings (Tiesto Remix)",
    artist: "Tiësto",
    bpm: 138,
    spotifyId: "1YVfC2cikFGr2RFxYDs2fz",
  },
  {
    title: "For An Angel",
    artist: "Paul van Dyk",
    bpm: 138,
    spotifyId: "0b4I9AN3hC5sR9LkJRxkK9",
  },
  {
    title: "Carte Blanche",
    artist: "Veracocha",
    bpm: 138,
    spotifyId: "1NmMzdh0dXChGkP7FpC18g",
  },
  {
    title: "As The Rush Comes",
    artist: "Motorcycle",
    bpm: 135,
    spotifyId: "7i9uY9qsK0kGugHgdGXNqS",
  },
  {
    title: "Everytime We Touch (Radio Edit)",
    artist: "Cascada",
    bpm: 142,
    spotifyId: "1i6N76fftMZhijOzFQ5ZtL",
  },
  { title: "Titanium (Alesso Remix)", artist: "David Guetta, Sia", bpm: 140 },
  {
    title: "Sun Is Shining (Radio Mix)",
    artist: "Axwell / Ingrosso",
    bpm: 140,
  },
  {
    title: "Zombie Nation",
    artist: "Kernkraft 400",
    bpm: 145,
    spotifyId: "3scnF6lNBPDPlJ8r3W2RZt",
  },
  { title: "We Found Love", artist: "Rihanna, Calvin Harris", bpm: 140 },
  {
    title: "Sail",
    artist: "AWOLNATION",
    bpm: 136,
    spotifyId: "7GNR9CGujGJzF1DgX36qQY",
  },
  {
    title: "Seven Nation Army (The Glitch Mob Remix)",
    artist: "The White Stripes",
    bpm: 140,
  },
  { title: "Hysteria", artist: "Muse", bpm: 138 },
  { title: "Song 2", artist: "Blur", bpm: 136 },
  { title: "No One Knows", artist: "Queens of the Stone Age", bpm: 138 },
  { title: "Reptilia", artist: "The Strokes", bpm: 140 },
  { title: "Song For The Dead", artist: "Queens of the Stone Age", bpm: 138 },
  { title: "The Phoenix", artist: "Fall Out Boy", bpm: 144 },
  {
    title: "Heads Will Roll (A-Trak Remix)",
    artist: "Yeah Yeah Yeahs",
    bpm: 140,
  },
];

/**
 * Helper function to get songs within a specific BPM range
 * @param {number} minBpm - Minimum BPM
 * @param {number} maxBpm - Maximum BPM
 * @returns {Array} Filtered array of songs within the BPM range
 */
export const getSongsInBpmRange = (minBpm, maxBpm) => {
  return songs.filter((song) => song.bpm >= minBpm && song.bpm <= maxBpm);
};
