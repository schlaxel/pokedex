import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Expand, MapPin } from "lucide-react";
import { MapView } from "./MapView";
import type { PokemonEntry } from "../types";
import { Link } from "react-router-dom";

type CompanionEntryDetailProps = {
  entry: PokemonEntry;
  backHref: string;
};

function createPayload(token: string) {
  return `pokedex://unlock/${token}`;
}

export function CompanionEntryDetail({ entry, backHref }: CompanionEntryDetailProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isMobileZoomEnabled, setIsMobileZoomEnabled] = useState(false);
  const payload = createPayload(entry.qrToken);

  useEffect(() => {
    let cancelled = false;

    async function generateQrCode() {
      try {
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 420,
          margin: 1,
          color: {
            dark: "#1f2f3d",
            light: "#f6f0dd",
          },
        });

        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void generateQrCode();

    return () => {
      cancelled = true;
    };
  }, [payload]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const syncMobileState = () => {
      setIsMobileZoomEnabled(mediaQuery.matches);
    };

    syncMobileState();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMobileState);
    } else {
      mediaQuery.addListener(syncMobileState);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncMobileState);
      } else {
        mediaQuery.removeListener(syncMobileState);
      }
    };
  }, []);

  useEffect(() => {
    if (!isImageOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageOpen]);

  const handleImageOpen = () => {
    if (!isMobileZoomEnabled) {
      return;
    }

    setIsImageOpen(true);
  };

  return (
    <div className="companion-detail">
      <div className="companion-detail__media">
        <button
          className="companion-detail__image-button"
          onClick={handleImageOpen}
          type="button"
          aria-label={
            isMobileZoomEnabled
              ? `${entry.name} in voller Größe öffnen`
              : `${entry.name} Bild`
          }
        >
          <img
            className="companion-detail__image"
            src={entry.image}
            alt={entry.name}
          />
          {isMobileZoomEnabled ? (
            <span className="companion-detail__image-hint" aria-hidden="true">
              <Expand size={18} strokeWidth={2.4} />
            </span>
          ) : null}
        </button>
      </div>

      <div className="companion-detail__card">
        <div className="companion-detail__title">
          <p className="pokedex-card__index">#{entry.id}</p>
          <h2>{entry.name}</h2>
        </div>

        <div className="detail-sheet__meta companion-detail__meta">
          <span>{entry.type}</span>
          <span>{entry.rarity}</span>
          {entry.locationName ? (
            <div className="companion-detail__meta-location">
              <MapPin aria-hidden="true" size={16} strokeWidth={2.25} />
              <strong>{entry.locationName}</strong>
            </div>
          ) : null}
        </div>

        {(entry.height || entry.weight) && (
          <div className="detail-sheet__profile companion-detail__profile">
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

        {entry.stats && (entry.stats.hp || entry.stats.attack || entry.stats.defense) ? (
          <div className="detail-sheet__stats companion-detail__stats">
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

        {entry.weaknesses?.length ? (
          <div className="detail-sheet__profile companion-detail__profile companion-detail__profile--center">
            <span className="companion-detail__weakness-pill">
              <strong>Schwächen:</strong> {entry.weaknesses.join(", ")}
            </span>
          </div>
        ) : null}

        <p className="detail-sheet__bio companion-detail__bio">{entry.bio}</p>
        <ul className="detail-sheet__facts companion-detail__facts">
          {entry.funFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>

      <div className="companion-detail__footer">
        <section className="companion-detail__aside">
          <div className="companion-detail__section-head">
            <p className="screen-panel__label">Treffpunkt</p>
            <h3 className="companion-detail__meeting-title">
              {entry.coordinates ? (
                <>
                  <MapPin aria-hidden="true" size={18} strokeWidth={2.4} />
                  <span>{entry.locationName ?? "Standort"}</span>
                </>
              ) : (
                "Kein Standort hinterlegt"
              )}
            </h3>
          </div>
          {!entry.coordinates ? (
            <p className="companion-detail__location-copy">
              Dieses Pokemon erscheint nur im Pokedex und hat keinen Kartenpunkt.
            </p>
          ) : null}
          {entry.coordinates ? (
            <a
              className="companion-detail__maps-link"
              href={`https://www.google.com/maps/search/?api=1&query=${entry.coordinates.lat},${entry.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              In Maps öffnen
            </a>
          ) : null}
        </section>
      </div>

      {entry.coordinates ? (
        <div className="companion-detail__map-block">
          <div className="companion-detail__section-head">
            <p className="screen-panel__label">Standort</p>
            <h3>Karte</h3>
          </div>
          <div className="companion-detail__map">
            <MapView entries={[entry]} />
          </div>
        </div>
      ) : null}

      <details className="companion-detail__qr-disclosure">
        <summary>QR-Code anzeigen</summary>
        <div className="companion-detail__qr-block">
          <div className="companion-detail__section-head">
            <p className="screen-panel__label">Show this later</p>
            <h3>QR Code</h3>
          </div>
          <div className="admin-card__qr-wrap companion-detail__qr-wrap">
            {qrDataUrl ? (
              <img
                className="admin-card__qr companion-detail__qr"
                src={qrDataUrl}
                alt={`QR code for ${entry.name}`}
              />
            ) : (
              <div className="admin-card__qr admin-card__qr--loading">Generating QR...</div>
            )}
          </div>
          <div className="admin-card__meta">
            <p>
              <strong>Token:</strong> {entry.qrToken}
            </p>
          </div>
        </div>
      </details>

      <div className="companion-detail__back-wrap">
        <Link className="status-pill companion-detail__back" to={backHref}>
          Zurück zur Liste
        </Link>
      </div>

      {isImageOpen ? (
        <div className="companion-image-modal" role="dialog" aria-modal="true">
          <button
            className="companion-image-modal__backdrop"
            onClick={() => setIsImageOpen(false)}
            type="button"
          />
          <button
            className="companion-image-modal__close"
            onClick={() => setIsImageOpen(false)}
            type="button"
          >
            Schließen
          </button>
          <img
            className="companion-image-modal__image"
            src={entry.image}
            alt={entry.name}
          />
        </div>
      ) : null}
    </div>
  );
}
