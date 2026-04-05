import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AdminQrCard } from "./components/AdminQrCard";
import { PokedexCard } from "./components/PokedexCard";
import { PokedexDetail } from "./components/PokedexDetail";
import { pokemonEntries, tokenToEntry } from "./data/pokemon";
import {
  loadUnlockedIds,
  persistUnlockedIds,
  resetUnlockedIds,
} from "./lib/unlock";
import type { PokemonEntry, ScanStatus } from "./types";

type Tab = "pokedex" | "map" | "admin";

const MapView = lazy(() =>
  import("./components/MapView").then((module) => ({ default: module.MapView })),
);
const ScannerPanel = lazy(() =>
  import("./components/ScannerPanel").then((module) => ({
    default: module.ScannerPanel,
  })),
);

function normalizeToken(rawValue: string) {
  const trimmed = rawValue.trim();

  if (trimmed.startsWith("pokedex://unlock/")) {
    return trimmed.replace("pokedex://unlock/", "");
  }

  try {
    const url = new URL(trimmed);
    return url.searchParams.get("unlock") ?? trimmed;
  } catch {
    return trimmed;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("pokedex");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PokemonEntry | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>({ kind: "idle" });
  const [manualCode, setManualCode] = useState("");
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    setUnlockedIds(loadUnlockedIds());
  }, []);

  useEffect(() => {
    persistUnlockedIds(unlockedIds);
  }, [unlockedIds]);

  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const completion = Math.round((unlockedIds.length / pokemonEntries.length) * 100);
  const allUnlocked = unlockedIds.length === pokemonEntries.length;

  function unlockFromRaw(rawValue: string) {
    const token = normalizeToken(rawValue);
    const entry = tokenToEntry.get(token);

    if (!entry) {
      setScanStatus({
        kind: "error",
        message: "No Pokemon matched that code.",
      });
      return;
    }

    setSelectedEntry(entry);
    setActiveTab("pokedex");

    if (unlockedSet.has(entry.id)) {
      setScanStatus({
        kind: "success",
        message: `${entry.nickname} is already registered.`,
      });
      return;
    }

    setUnlockedIds((currentIds) => [...currentIds, entry.id]);
    setScanStatus({
      kind: "success",
      message: `${entry.nickname} was added to the Pokedex.`,
    });
    setIsScannerOpen(false);
  }

  function handleManualSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    unlockFromRaw(manualCode);
    setManualCode("");
  }

  function handleResetGesture() {
    if (!resetArmed) {
      setResetArmed(true);
      window.setTimeout(() => setResetArmed(false), 4000);
      return;
    }

    setUnlockedIds([]);
    resetUnlockedIds();
    setSelectedEntry(null);
    setScanStatus({ kind: "idle" });
    setResetArmed(false);
    setIsScannerOpen(false);
  }

  function openScanner() {
    setScanStatus({ kind: "idle" });
    setIsScannerOpen(true);
  }

  function handleScannerError(message: string) {
    setScanStatus({
      kind: "error",
      message,
    });
  }

  return (
    <div className="app-shell">
      <div className="pokedex-shell">
        <header className="pokedex-header">
          <div className="pokedex-lights" aria-hidden="true">
            <span className="pokedex-lights__main" />
            <span className="pokedex-lights__small pokedex-lights__small--red" />
            <span className="pokedex-lights__small pokedex-lights__small--yellow" />
            <span className="pokedex-lights__small pokedex-lights__small--green" />
          </div>
          <div className="pokedex-header__copy">
            <p className="pokedex-header__label">Digital Monster Index</p>
            <h1>Pokedex</h1>
          </div>
          <div className="pokedex-progress">
            <span>Seen</span>
            <strong>
              {unlockedIds.length}/{pokemonEntries.length}
            </strong>
          </div>
        </header>

        <nav className="tabbar" aria-label="Primary">
          <button
            className={activeTab === "pokedex" ? "is-active" : ""}
            onClick={() => setActiveTab("pokedex")}
            type="button"
          >
            Pokedex
          </button>
          <button
            className={activeTab === "map" ? "is-active" : ""}
            onClick={() => setActiveTab("map")}
            type="button"
          >
            Map
          </button>
        </nav>

        <main className="screen">
          {activeTab === "pokedex" && (
            <section className="screen-panel">
              <div className="screen-panel__header">
                <div>
                  <p className="screen-panel__label">Registry</p>
                  <h2>Friend Pokemon</h2>
                </div>
                <button
                  className={`reset-button ${resetArmed ? "is-danger" : ""}`}
                  onClick={handleResetGesture}
                  type="button"
                >
                  {resetArmed ? "Tap again to reset" : "Reset"}
                </button>
              </div>

              <div className="status-row">
                <div className="status-pill">
                  Completion <strong>{completion}%</strong>
                </div>
                <div className="status-pill">
                  {allUnlocked ? "All Pokemon registered" : "Grey entries are still hidden"}
                </div>
              </div>

              <div className="pokedex-grid">
                {pokemonEntries.map((entry) => (
                  <PokedexCard
                    key={entry.id}
                    entry={entry}
                    unlocked={unlockedSet.has(entry.id)}
                    onSelect={setSelectedEntry}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === "map" && (
            <section className="screen-panel">
              <div className="screen-panel__header">
                <div>
                  <p className="screen-panel__label">Area</p>
                  <h2>Pokemon Map</h2>
                </div>
                <div className="status-pill">{pokemonEntries.length} markers</div>
              </div>
              <Suspense fallback={<div className="panel__loading">Loading map...</div>}>
                <MapView entries={pokemonEntries} />
              </Suspense>
            </section>
          )}

          {activeTab === "admin" && (
            <section className="screen-panel">
              <div className="screen-panel__header">
                <div>
                  <p className="screen-panel__label">Testing</p>
                  <h2>Admin QR Codes</h2>
                </div>
                <div className="status-pill">{pokemonEntries.length} test codes</div>
              </div>

              <div className="status-row">
                <div className="status-pill">
                  Scan these with the in-app scanner or upload them as images.
                </div>
              </div>

              <div className="admin-grid">
                {pokemonEntries.map((entry) => (
                  <AdminQrCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </main>

        <button
          aria-label="Open QR scanner"
          className="scanner-fab"
          onClick={openScanner}
          type="button"
        >
          <span className="scanner-fab__core" />
          <span>Scan</span>
        </button>

        <footer className="app-footer">
          <button
            className="footer-link"
            onClick={() => setActiveTab("admin")}
            type="button"
          >
            Admin
          </button>
        </footer>
      </div>

      {isScannerOpen && (
        <div className="modal-shell" role="dialog" aria-modal="true">
          <div
            className="modal-shell__backdrop"
            onClick={() => setIsScannerOpen(false)}
          />
          <div className="modal-shell__panel">
            <div className="screen-panel__header">
              <div>
                <p className="screen-panel__label">Scanner</p>
                <h2>Register Pokemon</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setIsScannerOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <Suspense fallback={<div className="panel__loading">Starting scanner...</div>}>
              <ScannerPanel
                onError={handleScannerError}
                onScan={unlockFromRaw}
                status={scanStatus}
              />
            </Suspense>

            <form className="manual-form" onSubmit={handleManualSubmit}>
              <label htmlFor="manual-code">Manual code</label>
              <div className="manual-form__row">
                <input
                  id="manual-code"
                  type="text"
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value)}
                  placeholder="Enter token or unlock URL"
                />
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PokedexDetail
        entry={selectedEntry}
        unlocked={selectedEntry ? unlockedSet.has(selectedEntry.id) : false}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
