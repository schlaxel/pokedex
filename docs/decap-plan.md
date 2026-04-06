# Decap CMS Plan

## Why Decap

Decap is the chosen editing approach because it fits the event workflow well:

- simple shared CMS-style editing
- works naturally with Netlify
- good fit for a fixed collection of 10 Pokemon entries
- faster to ship than a custom backend editor

## Version 1 Scope

Version 1 keeps the editing experience intentionally simple:

- edit Pokemon card content in forms
- upload or change each Pokemon image
- edit map position with Decap's built-in `map` widget
- keep current QR token behavior unchanged

The public app stays read-only except for local unlock progress.

## Content Structure

Pokemon content now lives in:

- `content/pokemon/*.json`

Each file contains:

- `id`
- `name`
- `nickname`
- `bio`
- `funFacts`
- `type`
- `rarity`
- `locationName`
- `location`
- `qrToken`
- `image`

Uploaded media is configured for:

- `public/uploads`

## Decap Setup

Admin files:

- `public/admin/index.html`
- `public/admin/config.yml`

The CMS is configured as:

- `git-gateway` backend
- `main` branch
- one collection for Pokemon
- entry creation and deletion enabled
- local development through `bun run cms`

## React App Integration

The public app no longer treats `src/data/pokemon.ts` as the canonical source of truth.
Instead, that module loads the JSON content files and normalizes them back into the runtime `PokemonEntry` shape used by the UI.

This keeps the rest of the app stable:

- map still receives `coordinates`
- QR lookup still uses `qrToken`
- Pokedex cards and detail views still use the same runtime type

## Deferred Upgrade

Version 2 can improve location editing with a custom Decap widget:

- embedded map preview
- click-to-place marker picker
- writing `latitude` and `longitude` automatically

That enhancement is intentionally deferred so v1 can ship quickly.
