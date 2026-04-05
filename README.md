# Bachelor Party Pokedex

Mobile-first React app for a Pokemon-style bachelor party scavenger hunt.

## Run locally

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

## Customize the adventure

- Edit the friend entries in `src/data/pokemon.ts`.
- Replace the sample `image` URLs with your own photos.
- Update each friend's `coordinates` and `locationName`.
- Give each friend a unique `qrToken`.

## QR code format

The scanner accepts either of these formats:

- `pokedex://unlock/captain-confetti`
- `https://your-domain.com/?unlock=captain-confetti`

The `qrToken` must match a token in `src/data/pokemon.ts`.

## Current behavior

- Map markers are visible from the start.
- Unlock progress is stored in browser local storage on one phone.
- Manual code entry is available if camera access fails.
- Double-tap the reset button in the Pokedex screen to clear progress for testing.
