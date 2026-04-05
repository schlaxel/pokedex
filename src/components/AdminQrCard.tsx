import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { PokemonEntry } from "../types";

type AdminQrCardProps = {
  entry: PokemonEntry;
};

function createPayload(token: string) {
  return `pokedex://unlock/${token}`;
}

export function AdminQrCard({ entry }: AdminQrCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const payload = createPayload(entry.qrToken);

  useEffect(() => {
    let cancelled = false;

    async function generateQrCode() {
      try {
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 360,
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

  return (
    <article className="admin-card">
      <div className="admin-card__header">
        <div>
          <p className="pokedex-card__index">#{entry.id}</p>
          <h3>{entry.nickname}</h3>
          <p>{entry.name}</p>
        </div>
        <span className="admin-card__type">{entry.type}</span>
      </div>

      <div className="admin-card__qr-wrap">
        {qrDataUrl ? (
          <img
            className="admin-card__qr"
            src={qrDataUrl}
            alt={`QR code for ${entry.nickname}`}
          />
        ) : (
          <div className="admin-card__qr admin-card__qr--loading">Generating QR...</div>
        )}
      </div>

      <div className="admin-card__meta">
        <p>
          <strong>Token:</strong> {entry.qrToken}
        </p>
        <p>
          <strong>Payload:</strong> {payload}
        </p>
      </div>
    </article>
  );
}
