import type { PokemonEntry } from "../types";

export const pokemonEntries: PokemonEntry[] = [
  {
    id: "001",
    name: "Michi",
    nickname: "Captain Confetti",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    bio: "Always appears exactly when a plan needs charm, snacks, and one surprisingly effective pep talk.",
    funFacts: [
      "Signature move: Group Chat Summon",
      "Carries emergency festival glitter",
      "Can navigate any city with 12% battery left",
    ],
    type: "Party",
    rarity: "Legendary Wingman",
    coordinates: { lat: 52.52, lng: 13.405 },
    locationName: "Alexanderplatz",
    qrToken: "captain-confetti",
  },
  {
    id: "002",
    name: "Jonas",
    nickname: "Sir Sidequest",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    bio: "Looks calm, but can turn a coffee stop into a full-scale adventure arc in under three minutes.",
    funFacts: [
      "Signature move: Unexpected Detour",
      "Knows at least one bartender everywhere",
      "Power spikes after first espresso",
    ],
    type: "Chaos",
    rarity: "Elite Four Friend",
    coordinates: { lat: 52.5163, lng: 13.3777 },
    locationName: "Brandenburg Gate",
    qrToken: "sir-sidequest",
  },
  {
    id: "003",
    name: "Timo",
    nickname: "DJ Thunderbeard",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
    bio: "A mysterious rhythm-type creature capable of improving any mood with one song and a terrible dance move.",
    funFacts: [
      "Signature move: Bass Drop",
      "Weakness: Quiet evenings",
      "Immune to awkward silences",
    ],
    type: "Sound",
    rarity: "Mythic Bro",
    coordinates: { lat: 52.5006, lng: 13.376 },
    locationName: "Potsdamer Platz",
    qrToken: "dj-thunderbeard",
  },
  {
    id: "004",
    name: "Luca",
    nickname: "Professor Vibes",
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=900&q=80",
    bio: "Studies advanced friendship mechanics and delivers highly effective morale boosts in the wild.",
    funFacts: [
      "Signature move: Wisdom Burst",
      "Can order for the whole table flawlessly",
      "Often found near late-night food sources",
    ],
    type: "Support",
    rarity: "Rare Spawn",
    coordinates: { lat: 52.4986, lng: 13.376 },
    locationName: "Gleisdreieck Park",
    qrToken: "professor-vibes",
  },
  {
    id: "005",
    name: "Felix",
    nickname: "Snackachu",
    image:
      "https://images.unsplash.com/photo-1506795660198-e95c77602129?auto=format&fit=crop&w=900&q=80",
    bio: "Never arrives empty-handed and can locate the best late-night food options with supernatural precision.",
    funFacts: [
      "Signature move: Crispy Crunch",
      "Always knows the shortcut",
      "Can convince anyone to order one more round",
    ],
    type: "Electric",
    rarity: "Ultra Rare",
    coordinates: { lat: 52.5219, lng: 13.4132 },
    locationName: "Hackescher Markt",
    qrToken: "snackachu",
  },
  {
    id: "006",
    name: "Ben",
    nickname: "Baron Banter",
    image:
      "https://images.unsplash.com/photo-1500038993959-d6c883fd6e70?auto=format&fit=crop&w=900&q=80",
    bio: "Specializes in high-speed jokes, low-speed karaoke, and perfectly timed one-liners.",
    funFacts: [
      "Signature move: Banter Beam",
      "Critical hit chance increases after midnight",
      "Resistant to awkward elevator silences",
    ],
    type: "Normal",
    rarity: "Rare Spawn",
    coordinates: { lat: 52.5096, lng: 13.3759 },
    locationName: "Mall of Berlin",
    qrToken: "baron-banter",
  },
  {
    id: "007",
    name: "Chris",
    nickname: "Coach Hype",
    image:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80",
    bio: "Turns every small moment into a full championship run with unreasonable levels of energy.",
    funFacts: [
      "Signature move: Pep Rally",
      "Can start a chant out of nowhere",
      "Uses finger guns as a support ability",
    ],
    type: "Fighting",
    rarity: "Gym Leader",
    coordinates: { lat: 52.5037, lng: 13.4034 },
    locationName: "Checkpoint Charlie",
    qrToken: "coach-hype",
  },
  {
    id: "008",
    name: "Nico",
    nickname: "Stealth Sipper",
    image:
      "https://images.unsplash.com/photo-1506795664069-5dd4f8d2bd66?auto=format&fit=crop&w=900&q=80",
    bio: "Quiet at first, then suddenly becomes the strategic mastermind behind the whole operation.",
    funFacts: [
      "Signature move: Silent Plan",
      "Can order exactly the right drink for everyone",
      "Has suspiciously strong route-planning stats",
    ],
    type: "Psychic",
    rarity: "Shadow Rare",
    coordinates: { lat: 52.5145, lng: 13.3501 },
    locationName: "Tiergarten Edge",
    qrToken: "stealth-sipper",
  },
  {
    id: "009",
    name: "David",
    nickname: "Radar Bro",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80",
    bio: "Can spot the next destination, the next joke, and the next problem before anyone else notices it.",
    funFacts: [
      "Signature move: Bro Locator",
      "Never loses the group",
      "Gets a passive bonus near train stations",
    ],
    type: "Steel",
    rarity: "Epic",
    coordinates: { lat: 52.5251, lng: 13.3694 },
    locationName: "Berlin Central Station",
    qrToken: "radar-bro",
  },
  {
    id: "010",
    name: "Max",
    nickname: "Final Bossman",
    image:
      "https://images.unsplash.com/photo-1500048993959-d6c883fd6e70?auto=format&fit=crop&w=900&q=80",
    bio: "The late-game encounter: impossible to miss, impossible to predict, and always worth the build-up.",
    funFacts: [
      "Signature move: Grand Entrance",
      "Unlocks the finale atmosphere",
      "Best encountered with full team assembled",
    ],
    type: "Dragon",
    rarity: "Boss Encounter",
    coordinates: { lat: 52.4912, lng: 13.4228 },
    locationName: "Tempelhofer Feld",
    qrToken: "final-bossman",
  },
];

export const tokenToEntry = new Map(
  pokemonEntries.map((entry) => [entry.qrToken, entry]),
);
