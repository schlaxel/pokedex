import type { PokemonEntry } from "../types";

type PokedexCardProps = {
  entry: PokemonEntry;
  unlocked: boolean;
  onSelect: (entry: PokemonEntry) => void;
};

export function PokedexCard({
  entry,
  unlocked,
  onSelect,
}: PokedexCardProps) {
  return (
    <button
      className={`pokedex-card ${unlocked ? "is-unlocked" : "is-locked"}`}
      onClick={() => unlocked && onSelect(entry)}
      type="button"
    >
      <div className="pokedex-card__image-wrap">
        <img
          className="pokedex-card__image"
          src={unlocked ? entry.image : "https://placehold.co/400x400/13233a/F3C933?text=%3F"}
          alt={unlocked ? entry.nickname : "Locked Pokemon"}
        />
      </div>
      <div className="pokedex-card__content">
        <p className="pokedex-card__index">#{entry.id.toUpperCase()}</p>
        <h3>{unlocked ? entry.nickname : "Unknown Pokemon"}</h3>
        <p>{unlocked ? entry.name : "Scan the QR code to reveal this friend."}</p>
      </div>
    </button>
  );
}
