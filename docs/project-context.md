# Pokedex App Context

## Goal

This project is a mobile-first bachelor party web app themed like a Pokedex.

The idea:

- The groom sees a map with different city locations.
- Each location represents a "Pokemon", but in real life each Pokemon is one of his friends.
- When he finds a friend, he scans that friend's QR code.
- The scan unlocks that friend in the Pokedex and reveals a fun profile entry.

The app is intentionally lightweight and frontend-only for now.

## Current Tech Stack

- Bun for package management / scripts
- React
- Vite
- TypeScript
- Leaflet + react-leaflet for the map
- ZXing browser package for QR scanning
- `qrcode` package for generating testing QR codes in the admin area

## Current Product Shape

The app currently has a tab-based layout with three tabs:

- `Pokedex`
- `Map`
- `Admin`

There is also a floating `Scan` button that opens the scanner in a modal.

## What Is Already Implemented

### Pokedex tab

- Main/default tab
- Shows 10 Pokemon slots
- Locked Pokemon appear greyed out
- Unlocked Pokemon can be opened for detail view
- Progress is displayed as a completion percentage
- Reset button exists for testing

### Map tab

- Shows all Pokemon/friend locations on a Leaflet map
- Markers are visible from the start
- Marker popups include the location name and a Google Maps link

### Scanner modal

- Opens from floating action button
- Attempts to use the device camera for QR scanning
- Supports manual code entry as fallback
- Supports image upload fallback for QR testing
- Parses both:
  - `pokedex://unlock/<token>`
  - URLs with `?unlock=<token>`

### Admin tab

- Displays one generated QR code per Pokemon
- Shows token and payload for each entry
- Useful for local testing without printing physical QR codes yet

### Persistence

- Unlock progress is stored in browser local storage
- Current assumption is one phone / one browser during the event

## Current Data Model

Main source:

- `src/data/pokemon.ts`

Each Pokemon entry currently contains:

- `id`
- `name`
- `nickname`
- `image`
- `bio`
- `funFacts`
- `type`
- `rarity`
- `coordinates`
- `locationName`
- `qrToken`

There are currently 10 sample entries with placeholder friend content and Berlin coordinates.

## Important Current Files

- `src/App.tsx`
  - main app shell, tabs, modal flow, unlock logic
- `src/data/pokemon.ts`
  - friend/Pokemon data
- `src/components/ScannerPanel.tsx`
  - camera scanning, upload fallback, manual error handling
- `src/components/AdminQrCard.tsx`
  - QR code generation for admin/testing
- `src/components/MapView.tsx`
  - map rendering
- `src/components/PokedexCard.tsx`
  - grid cards in Pokedex
- `src/components/PokedexDetail.tsx`
  - unlocked entry detail modal
- `src/lib/unlock.ts`
  - local storage persistence
- `src/styles.css`
  - overall Pokedex-style UI styling

## Known Constraints / Caveats

### Camera on phone

- Camera scanning generally needs HTTPS on phones.
- On desktop localhost this is usually less strict.
- The app includes manual input and image upload fallback because phone camera testing over plain LAN HTTP is unreliable.

### Local development

- Keep Vite setup simple.
- Run locally with plain Vite:

```bash
bun install
bun run dev
```

- For phone testing on the same Wi-Fi, Vite usually needs to be started with:

```bash
bun run dev -- --host 0.0.0.0 --port 5173
```

- Even if the page loads on the phone over LAN HTTP, camera access may still fail due to secure-context restrictions.

### Content

- Current entries are placeholder/sample content.
- Real friend photos, names, bios, locations, and final QR tokens still need to be filled in.

## Good Next Steps

### Content preparation

- Replace all placeholder friends with real participants
- Replace sample photos with actual images
- Finalize real coordinates and meeting locations
- Write better, more personalized Pokedex bios and fun facts

### Event-readiness

- Generate final QR codes for all friends
- Export or print these QR codes
- Decide whether the `Admin` tab should stay in the shipped version or be hidden/removed
- Rehearse the full unlock flow on the actual device that will be used

### Product improvements

- Add a final celebration / completion screen again if desired
- Add a clearer onboarding / intro message for the groom
- Improve locked-card styling and Pokedex detail visuals
- Add an easier admin reset or debug panel if needed
- Optionally hide the `Admin` tab behind a gesture or secret mode

### Mobile / deployment

- Deploy to a real HTTPS host for reliable phone camera scanning
- Test on iPhone Safari and Android Chrome
- Consider making the app installable as a PWA later

## Suggested Shipping Path

Recommended practical path for this project:

1. Finalize the 10 real friend entries in `src/data/pokemon.ts`
2. Use the current `Admin` tab to verify all tokens and unlock behavior
3. Deploy the site to a simple HTTPS host
4. Test QR scanning on the actual phone
5. Hide or remove admin/testing surfaces before the final event version

## Open Questions For Later

- Should the final app keep the `Admin` tab at all?
- Should the map always show all markers, or reveal some later?
- Should the app include a stronger intro / story screen before the Pokedex?
- Should the final unlock payload remain token-based, or use full hosted URLs only?
- Do we want a secret admin gesture instead of a visible admin tab and reset button?
