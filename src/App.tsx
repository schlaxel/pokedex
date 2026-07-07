import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AdminQrCard } from "./components/AdminQrCard";
import { CompanionEntryDetail } from "./components/CompanionEntryDetail";
import { PokedexCard } from "./components/PokedexCard";
import { pokemonEntries, tokenToEntry } from "./data/pokemon";
import {
  loadUnlockedIds,
  persistUnlockedIds,
  resetUnlockedIds,
} from "./lib/unlock";
import type { ScanStatus } from "./types";

type Tab = "pokedex" | "map" | "test-codes";

const companionPathname = "/companions";
const tabPathnames: Record<Tab, string> = {
  pokedex: "/",
  map: "/map",
  "test-codes": "/test-codes",
};

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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [scanStatus, setScanStatus] = useState<ScanStatus>({ kind: "idle" });
  const [manualCode, setManualCode] = useState("");
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    setUnlockedIds(loadUnlockedIds());
  }, []);

  useEffect(() => {
    persistUnlockedIds(unlockedIds);
  }, [unlockedIds]);

  const previewParam = searchParams.get("preview");
  const previewUnlockedIds = useMemo(() => {
    if (!previewParam) {
      return [];
    }

    if (previewParam === "all") {
      return pokemonEntries.map((entry) => entry.id);
    }

    return previewParam
      .split(",")
      .map((value) => value.trim())
      .filter((value) => pokemonEntries.some((entry) => entry.id === value));
  }, [previewParam]);
  const effectiveUnlockedIds = useMemo(
    () => Array.from(new Set([...unlockedIds, ...previewUnlockedIds])),
    [previewUnlockedIds, unlockedIds],
  );
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const effectiveUnlockedSet = useMemo(
    () => new Set(effectiveUnlockedIds),
    [effectiveUnlockedIds],
  );
  const completion = Math.round(
    (effectiveUnlockedIds.length / pokemonEntries.length) * 100,
  );
  const allUnlocked = effectiveUnlockedIds.length === pokemonEntries.length;
  const mappedEntries = pokemonEntries.filter((entry) => entry.coordinates);
  const entriesWithLocation = pokemonEntries.filter((entry) => entry.coordinates);
  const entriesWithoutLocation = pokemonEntries.filter((entry) => !entry.coordinates);
  const companionEntryId = searchParams.get("pokemon");
  const companionEntry =
    pokemonEntries.find((entry) => entry.id === companionEntryId) ?? null;
  const isScannerOpen = searchParams.get("scanner") === "1";
  const isCompanionRoute = location.pathname === companionPathname;
  const mainBackHref = previewParam ? `/?preview=${encodeURIComponent(previewParam)}` : "/";

  useEffect(() => {
    if (!companionEntryId) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [companionEntryId]);

  if (
    !Object.values(tabPathnames).includes(location.pathname) &&
    location.pathname !== companionPathname
  ) {
    return <Navigate to="/" replace />;
  }

  const activeTab = (Object.entries(tabPathnames).find(
    ([, pathname]) => pathname === location.pathname,
  )?.[0] ?? "pokedex") as Tab;

  function updateCurrentSearch(
    options: {
      scanner?: boolean;
      replace?: boolean;
    },
  ) {
    const nextParams = new URLSearchParams(searchParams);

    if (options.scanner !== undefined) {
      if (options.scanner) {
        nextParams.set("scanner", "1");
      } else {
        nextParams.delete("scanner");
      }
    }

    setSearchParams(nextParams, { replace: options.replace });
  }

  function openCompanionEntry(entryId: string, options?: { replace?: boolean }) {
    const nextParams = new URLSearchParams();

    nextParams.set("pokemon", entryId);

    if (previewParam) {
      nextParams.set("preview", previewParam);
    }

    navigate(
      {
        pathname: companionPathname,
        search: `?${nextParams.toString()}`,
      },
      { replace: options?.replace },
    );
  }

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

    openCompanionEntry(entry.id);

    if (unlockedSet.has(entry.id)) {
      setScanStatus({
        kind: "success",
        message: `${entry.name} is already registered.`,
      });
      return;
    }

    setUnlockedIds((currentIds) => [...currentIds, entry.id]);
    setScanStatus({
      kind: "success",
      message: `${entry.name} was added to the Pokedex.`,
    });
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
    setScanStatus({ kind: "idle" });
    setResetArmed(false);
    updateCurrentSearch({
      scanner: false,
      replace: true,
    });
  }

  function openScanner() {
    setScanStatus({ kind: "idle" });
    updateCurrentSearch({ scanner: true });
  }

  function handleScannerError(message: string) {
    setScanStatus({
      kind: "error",
      message,
    });
  }

  if (isCompanionRoute) {
    return (
      <div className="app-shell">
        <div className="pokedex-shell pokedex-shell--guide">
          <header className="pokedex-header">
            <div className="pokedex-lights" aria-hidden="true">
              <span className="pokedex-lights__main" />
              <span className="pokedex-lights__small pokedex-lights__small--red" />
              <span className="pokedex-lights__small pokedex-lights__small--yellow" />
              <span className="pokedex-lights__small pokedex-lights__small--green" />
            </div>
            <div className="pokedex-header__copy">
              <h1>Pokedex Guide</h1>
            </div>
            <div className="pokedex-header__actions">
              <div className="pokedex-progress">
                <span>Pokemon</span>
                <strong>{pokemonEntries.length}</strong>
              </div>
              {companionEntry ? (
                <Link className="pokedex-header__back-link" to={mainBackHref}>
                  Zurück
                </Link>
              ) : null}
            </div>
          </header>

          <main className={companionEntry ? "companion-main" : "screen"}>
            {!companionEntry ? (
              <section className="screen-panel">
                <div className="screen-panel__header">
                  <div>
                    <p className="screen-panel__label">Begleiterseite</p>
                    <h2>Alle Pokemon</h2>
                  </div>
                </div>

                <p className="companion-list__intro">
                  Wähle dein Pokemon aus, um den vollständigen Eintrag, den QR-Code
                  und gegebenenfalls den Standort zu sehen.
                </p>

                <div className="companion-list">
                  {entriesWithLocation.map((entry) => (
                    <Link
                      key={entry.id}
                      className="companion-list__item"
                      to={`${companionPathname}?pokemon=${entry.id}`}
                    >
                      <img
                        className="companion-list__image"
                        src={entry.image}
                        alt={entry.name}
                      />
                      <div className="companion-list__copy">
                        <p className="pokedex-card__index">#{entry.id}</p>
                        <h3>{entry.name}</h3>
                        <span className="companion-list__location">
                          <MapPin aria-hidden="true" size={16} strokeWidth={2.25} />
                          <span>{entry.locationName ?? "Kein Standort"}</span>
                        </span>
                      </div>
                    </Link>
                  ))}

                  {entriesWithoutLocation.length > 0 ? (
                    <div className="list-divider">
                      <hr />
                    </div>
                  ) : null}

                  {entriesWithoutLocation.map((entry) => (
                    <Link
                      key={entry.id}
                      className="companion-list__item"
                      to={`${companionPathname}?pokemon=${entry.id}`}
                    >
                      <img
                        className="companion-list__image"
                        src={entry.image}
                        alt={entry.name}
                      />
                      <div className="companion-list__copy">
                        <p className="pokedex-card__index">#{entry.id}</p>
                        <h3>{entry.name}</h3>
                        <span className="companion-list__location">
                          <MapPin aria-hidden="true" size={16} strokeWidth={2.25} />
                          <span>{entry.locationName ?? "Kein Standort"}</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <CompanionEntryDetail
                entry={companionEntry}
                backHref={mainBackHref}
              />
            )}
          </main>
        </div>
      </div>
    );
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
            <h1>Pokedex</h1>
          </div>
          <div className="pokedex-progress">
            <span>Seen</span>
            <strong>
              {unlockedIds.length}/{pokemonEntries.length}
            </strong>
          </div>
        </header>

        <nav className="tabbar tabbar--top" aria-label="Primary">
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to={tabPathnames.pokedex}
            end
          >
            Pokedex
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "is-active" : "")}
            to={tabPathnames.map}
          >
            Map
          </NavLink>
        </nav>

        <main
          className={`screen ${activeTab === "map" ? "screen--map" : ""} ${
            isScannerOpen ? "screen--scanner-open" : ""
          }`}
        >
          {activeTab === "pokedex" && (
            <section className="screen-panel screen-panel--map">
              <div className="status-row">
                <div className="status-pill">
                  Completion <strong>{completion}%</strong>
                </div>
                {allUnlocked && (
                  <div className="status-pill">All Pokemon registered</div>
                )}
              </div>

              <div className="pokedex-grid">
                {entriesWithLocation.map((entry) => (
                  <PokedexCard
                    key={entry.id}
                    entry={entry}
                    unlocked={effectiveUnlockedSet.has(entry.id)}
                    onSelect={(pickedEntry) => openCompanionEntry(pickedEntry.id)}
                  />
                ))}
              </div>

              {entriesWithoutLocation.length > 0 ? (
                <>
                  <div className="list-divider">
                    <hr />
                  </div>

                  <div className="pokedex-grid">
                    {entriesWithoutLocation.map((entry) => (
                      <PokedexCard
                        key={entry.id}
                        entry={entry}
                        unlocked={effectiveUnlockedSet.has(entry.id)}
                        onSelect={(pickedEntry) => openCompanionEntry(pickedEntry.id)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              <div className="screen-panel__actions">
                <button
                  className={`reset-button ${resetArmed ? "is-danger" : ""}`}
                  onClick={handleResetGesture}
                  type="button"
                >
                  {resetArmed ? "Tap again to reset" : "Reset progress"}
                </button>
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
                <div className="status-pill">{mappedEntries.length} markers</div>
              </div>
              {mappedEntries.length > 0 ? (
                <Suspense fallback={<div className="panel__loading">Loading map...</div>}>
                  <MapView entries={mappedEntries} />
                </Suspense>
              ) : (
                <div className="panel__loading">Noch keine Pokemon mit Standort hinterlegt.</div>
              )}
            </section>
          )}

          {activeTab === "test-codes" && (
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
                  Use these codes to test the in-app scanner.
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
          <span className="scanner-fab__hinge" aria-hidden="true" />
          <span className="scanner-fab__label">Scan</span>
        </button>
      </div>

      {isScannerOpen && (
        <div className="modal-shell scanner-modal-shell" role="dialog" aria-modal="true">
          <div
            className="modal-shell__backdrop"
            onClick={() => updateCurrentSearch({ scanner: false })}
          />
          <div className="modal-shell__panel scanner-modal-panel">
            <button
              className="scanner-overlay-close"
              onClick={() => updateCurrentSearch({ scanner: false })}
              type="button"
            >
              Close
            </button>

            <div className="scanner-modal-copy">
              <p className="screen-panel__label">Scanner</p>
              <h2>Register Pokemon</h2>
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
    </div>
  );
}
