import type { PokemonEntry } from "../types";

type PokedexDetailProps = {
  entry: PokemonEntry | null;
  unlocked: boolean;
  onClose: () => void;
};

export function PokedexDetail({
  entry,
  unlocked,
  onClose,
}: PokedexDetailProps) {
  if (!entry) {
    return null;
  }

  return (
    <div className="detail-sheet" role="dialog" aria-modal="true">
      <div className="detail-sheet__backdrop" onClick={onClose} />
      <div className="detail-sheet__panel">
        <button className="detail-sheet__close" onClick={onClose} type="button">
          Close
        </button>
        {unlocked ? (
          <>
            <img className="detail-sheet__image" src={entry.image} alt={entry.nickname} />
            <div className="detail-sheet__header">
              <p>#{entry.id.toUpperCase()}</p>
              <h3>{entry.nickname}</h3>
              <p>{entry.name}</p>
            </div>
            <div className="detail-sheet__meta">
              <span>{entry.type}</span>
              <span>{entry.rarity}</span>
              <span>{entry.locationName}</span>
            </div>
            <p className="detail-sheet__bio">{entry.bio}</p>
            <ul className="detail-sheet__facts">
              {entry.funFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="detail-sheet__locked">
            <h3>Entry Locked</h3>
            <p>Track down this Pokemon and scan the QR code they carry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
