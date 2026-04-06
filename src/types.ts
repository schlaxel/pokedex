export type Coordinates = {
  lat: number;
  lng: number;
};

export type PokemonEntry = {
  id: string;
  name: string;
  nickname: string;
  image: string;
  bio: string;
  funFacts: string[];
  type: string;
  rarity: string;
  coordinates: Coordinates;
  locationName: string;
  qrToken: string;
};

export type PokemonContentEntry = {
  id: string;
  name: string;
  nickname: string;
  image: string;
  bio: string;
  funFacts: string[];
  type: string;
  rarity: string;
  locationName: string;
  location: string;
  qrToken: string;
};

export type ScanStatus =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };
