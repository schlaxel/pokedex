import type { PokemonContentEntry, PokemonEntry } from "../types";

const pokemonContentModules = import.meta.glob<PokemonContentEntry>(
  "../../content/pokemon/*.json",
  { eager: true, import: "default" },
);

const pokemonContentEntries = Object.values(pokemonContentModules).sort((left, right) =>
  left.id.localeCompare(right.id),
);

function parseCoordinates(entry: PokemonContentEntry) {
  try {
    const geoJson = JSON.parse(entry.location) as {
      type?: string;
      coordinates?: [number, number];
    };

    if (
      geoJson.type === "Point" &&
      Array.isArray(geoJson.coordinates) &&
      geoJson.coordinates.length === 2
    ) {
      const [lng, lat] = geoJson.coordinates;

      return { lat, lng };
    }
  } catch (error) {
    console.warn(`Invalid location for Pokemon ${entry.id}`, error);
  }

  return { lat: 47.9959, lng: 7.8522 };
}

export const pokemonEntries: PokemonEntry[] = pokemonContentEntries.map((entry) => ({
  id: entry.id,
  name: entry.name,
  nickname: entry.nickname,
  image: entry.image,
  bio: entry.bio,
  funFacts: entry.funFacts,
  type: entry.type,
  rarity: entry.rarity,
  coordinates: parseCoordinates(entry),
  locationName: entry.locationName,
  qrToken: entry.qrToken,
}));

export const tokenToEntry = new Map(
  pokemonEntries.map((entry) => [entry.qrToken, entry]),
);
