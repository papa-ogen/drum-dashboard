// data/exercisesData.js
import { v4 as uuidv4 } from "uuid";

/**
 * Generate exercises data for a given segment
 * @param {string} segmentId - The segment ID to assign exercises to
 * @returns {Array} Array of exercise objects
 */
export function generateExercisesData(segmentId) {
  return [
    {
      id: uuidv4(),
      name: "Technique 1",
      segmentId: segmentId,
      type: "segment",
      defaultBpm: 100,
      defaultDuration: 360,
      description:
        "Bass drum endurance: 8th notes (R foot → L foot) then double bass 16ths",
      notation: [
        {
          notes: [{ drum: "bass", foot: "R" }],
          value: "8th",
        },
        {
          notes: [{ drum: "bass", foot: "L" }],
          value: "8th",
        },
        {
          notes: [{ drum: "bass", foot: "R" }],
          value: "8th",
        },
        {
          notes: [{ drum: "bass", foot: "L" }],
          value: "8th",
        },
      ],
    },
    {
      id: uuidv4(),
      name: "Subdivision Ladder",
      segmentId: segmentId,
      type: "segment",
      defaultBpm: 110,
      defaultDuration: 240,
      description: "Progressive subdivision practice from quarters to 32nds",
      notation: [
        {
          notes: [{ drum: "snare", hand: "R" }],
          value: "quarter",
        },
        {
          notes: [{ drum: "snare", hand: "R" }],
          value: "8th",
        },
        {
          notes: [{ drum: "snare", hand: "R" }],
          value: "16th",
        },
        {
          notes: [{ drum: "snare", hand: "R" }],
          value: "32nd",
        },
      ],
    },
    {
      id: uuidv4(),
      name: "Weak Leg Builder",
      segmentId: segmentId,
      type: "segment",
      defaultBpm: 90,
      defaultDuration: 180,
      description: "Focus on left foot independence and control",
      notation: [
        {
          notes: [{ drum: "hihat", foot: "L" }],
          value: "quarter",
        },
        {
          notes: [{ drum: "hihat", foot: "L" }],
          value: "8th",
        },
        {
          notes: [{ drum: "hihat", foot: "L" }],
          value: "16th",
        },
      ],
    },
    {
      id: uuidv4(),
      name: "Endurance",
      segmentId: segmentId,
      type: "segment",
      defaultBpm: 110,
      defaultDuration: 300,
      description: "Long-form endurance building exercises",
      notation: [
        {
          notes: [
            { drum: "snare", hand: "R" },
            { drum: "bass", foot: "R" },
          ],
          value: "quarter",
        },
        {
          notes: [
            { drum: "snare", hand: "L" },
            { drum: "bass", foot: "L" },
          ],
          value: "quarter",
        },
      ],
    },
  ];
}
