import type { PokemonContentEntry, PokemonEntry } from "../types";

const pokemonContentModules = import.meta.glob<PokemonContentEntry>(
  "../../content/pokemon/*.json",
  { eager: true, import: "default" },
);

const pokemonContentEntries = Object.values(pokemonContentModules).sort((left, right) =>
  left.id.localeCompare(right.id),
);

function parseCoordinates(entry: PokemonContentEntry) {
  if (!entry.location) {
    return undefined;
  }

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

  return undefined;
}

export const pokemonEntries: PokemonEntry[] = pokemonContentEntries
  .map((entry) => ({
    id: entry.id,
    name: entry.name,
    image: entry.image,
    bio: entry.bio,
    funFacts: entry.funFacts,
    type: entry.type,
    rarity: entry.rarity,
    height: entry.height,
    weight: entry.weight,
    weaknesses: entry.weaknesses,
    stats: entry.stats,
    coordinates: parseCoordinates(entry),
    locationName: entry.locationName,
    qrToken: entry.qrToken,
  }))
  .sort((left, right) => {
    const leftHasCoordinates = Boolean(left.coordinates);
    const rightHasCoordinates = Boolean(right.coordinates);

    if (leftHasCoordinates !== rightHasCoordinates) {
      return leftHasCoordinates ? -1 : 1;
    }

    return left.id.localeCompare(right.id);
  });

export const tokenToEntry = new Map(
  pokemonEntries.map((entry) => [entry.qrToken, entry]),
);
