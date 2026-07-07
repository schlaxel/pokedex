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
            <img className="detail-sheet__image" src={entry.image} alt={entry.name} />
            <div className="detail-sheet__header">
              <p>#{entry.id.toUpperCase()}</p>
              <h3>{entry.name}</h3>
            </div>
            <div className="detail-sheet__meta">
              <span>{entry.type}</span>
              <span>{entry.rarity}</span>
              {entry.locationName ? <span>{entry.locationName}</span> : null}
            </div>
            {(entry.height || entry.weight) && (
              <div className="detail-sheet__profile">
                {entry.height ? (
                  <span>
                    <strong>Größe:</strong> {entry.height}
                  </span>
                ) : null}
                {entry.weight ? (
                  <span>
                    <strong>Gewicht:</strong> {entry.weight}
                  </span>
                ) : null}
              </div>
            )}
            {entry.weaknesses?.length ? (
              <div className="detail-sheet__profile">
                <span className="detail-sheet__profile-label">Schwächen</span>
                <div className="detail-sheet__weaknesses">
                  {entry.weaknesses.map((weakness) => (
                    <span key={weakness}>{weakness}</span>
                  ))}
                </div>
              </div>
            ) : null}
            {entry.stats && (entry.stats.hp || entry.stats.attack || entry.stats.defense) ? (
              <div className="detail-sheet__stats">
                {entry.stats.hp !== undefined ? (
                  <div className="detail-sheet__stat">
                    <span>KP</span>
                    <strong>{entry.stats.hp}</strong>
                  </div>
                ) : null}
                {entry.stats.attack !== undefined ? (
                  <div className="detail-sheet__stat">
                    <span>Angriff</span>
                    <strong>{entry.stats.attack}</strong>
                  </div>
                ) : null}
                {entry.stats.defense !== undefined ? (
                  <div className="detail-sheet__stat">
                    <span>Verteidigung</span>
                    <strong>{entry.stats.defense}</strong>
                  </div>
                ) : null}
              </div>
            ) : null}
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
