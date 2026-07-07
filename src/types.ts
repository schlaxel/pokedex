export type Coordinates = {
  lat: number;
  lng: number;
};

export type PokemonStats = {
  hp?: number;
  attack?: number;
  defense?: number;
};

export type PokemonEntry = {
  id: string;
  name: string;
  image: string;
  bio: string;
  funFacts: string[];
  type: string;
  rarity: string;
  height?: string;
  weight?: string;
  weaknesses?: string[];
  stats?: PokemonStats;
  coordinates?: Coordinates;
  locationName?: string;
  qrToken: string;
};

export type PokemonContentEntry = {
  id: string;
  name: string;
  image: string;
  bio: string;
  funFacts: string[];
  type: string;
  rarity: string;
  height?: string;
  weight?: string;
  weaknesses?: string[];
  stats?: PokemonStats;
  locationName?: string;
  location?: string;
  qrToken: string;
};

export type ScanStatus =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };
