import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PokemonEntry } from "../types";

const icon = L.divIcon({
  className: "pokemon-marker",
  html: '<div class="pokemon-marker__inner"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

type MapViewProps = {
  entries: PokemonEntry[];
};

export function MapView({ entries }: MapViewProps) {
  const mappableEntries = entries.filter(
    (entry): entry is PokemonEntry & { coordinates: { lat: number; lng: number } } =>
      Boolean(entry.coordinates),
  );
  const center = mappableEntries[0]?.coordinates ?? { lat: 52.52, lng: 13.405 };

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappableEntries.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.coordinates.lat, entry.coordinates.lng]}
          icon={icon}
        >
          <Popup>
            <span>Typ: {entry.type}</span>
            <br />
            {entry.locationName ? (
              <>
                {entry.locationName}
                <br />
              </>
            ) : null}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${entry.coordinates.lat},${entry.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
