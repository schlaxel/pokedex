# Bachelor Party Pokedex

Mobile-first React app for a Pokemon-style bachelor party scavenger hunt.

## Run locally

```bash
bun install
bun run dev
```

## Run the CMS locally

Use these in two terminals:

```bash
bun run dev
```

```bash
bun run cms
```

## Build

```bash
bun run build
```

## Customize the adventure

- Edit the friend entries in `content/pokemon/*.json`.
- Open `/admin/` to use Decap CMS instead of editing JSON by hand.
- Replace the sample `image` URLs with your own photos or upload files into `public/uploads`.
- Update each friend's map `location` and `locationName`.
- Give each friend a unique `qrToken`.

## CMS editor

The app includes a Decap CMS editor at:

```text
/admin/
```

You can also create and remove Pokemon entries directly in the CMS now.

Production setup notes:

- Enable `Netlify Identity`
- Enable `Git Gateway`
- Invite whoever should edit the content

Local development notes:

- `public/admin/config.yml` points to the local CMS proxy at `http://localhost:8081/api/v1`
- start the local CMS proxy when testing the editor locally:

```bash
bun run cms
```

## QR code format

The scanner accepts either of these formats:

- `pokedex://unlock/captain-confetti`
- `https://your-domain.com/?unlock=captain-confetti`

The `qrToken` must match a token in `content/pokemon/*.json`.

## Current behavior

- Map markers are visible from the start.
- Unlock progress is stored in browser local storage on one phone.
- Manual code entry is available if camera access fails.
- Double-tap the reset button in the Pokedex screen to clear progress for testing.
- Test QR codes remain available inside the app footer under `Test Codes`.
- The app count updates automatically when Pokemon entries are added or removed in the CMS.
