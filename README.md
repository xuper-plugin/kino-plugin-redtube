# RedTube for Kino

+18. A Kino plugin for [RedTube](https://www.redtube.com): its lists, categories, performers, search and playback.
Everything is marked 18+, so Kino shows it only while the person's 18+ code is unlocked (Ajustes ▸ Control parental).

## What it does

- **Home**: New, Trending, Most viewed this week, and rows for the site's main categories (3, 6 or 10 rows: a setting).
- **Your own section** (a chip on the phone's Inicio, an entry in the TV's sidebar) with tabs: New, Popular (most viewed by week,
  month and all time, and top rated), Categories, More categories and Performers.
- **Categorías**: 24 tiles with the site's own pictures.
- **"Ver más"** on every row, paged as the site pages (up to 40 pages).
- **Search** by any text the site understands (titles, tags, performers).
- **Title page**: categories and tags as genres, the performers and the channel in the synopsis, the runtime.
- **Playback**: HLS and MP4 at every quality the video has (240p to 1080p). Preferred quality is a setting (720p by default);
  the other qualities are in the player's server menu. Downloads work too.
- **Spanish and English** texts, following the app's language.

## How it works

The plugin reads the site's public pages with `kino.fetch` and never needs an account:

| What | Page |
| --- | --- |
| Lists | `/newest`, `/hot`, `/mostviewed?period=…`, `/top`, `/redtube/<category>`, `/pornstar/<name>`, `/?search=<text>` |
| Categories, performers | `/categories`, `/pornstar` |
| A video | `/<id>`: its player data lists the HLS and MP4 addresses |

If the video page gives no playable address, the plugin opens it in Kino's hidden web view (`kino.browser.capture`) and takes
the video requests the page makes, like a visitor's browser. When the site asks for a human check, Kino never tries to
solve it: the person reads that and can try later.

The plugin does not touch anything else: no login, no cookies of its own, no account data.

## Develop

```
node <kino>/plugins/sdk/validate.mjs .
node <kino>/plugins/sdk/run.mjs . home
node <kino>/plugins/sdk/run.mjs . search latina
node <kino>/plugins/sdk/run.mjs . browse "l:pornstar/angelina+armani"
node <kino>/plugins/sdk/run.mjs . section stars
node <kino>/plugins/sdk/run.mjs . resolve v:190753791
```

The hidden web view only exists in the app, so `resolve` through it has to be tried on a device.

## Refs

`v:<id>` a video · `l:<path>[?sorting=…&period=…]` a list of the site · `q:<text>` a search.

Licence: Apache-2.0.
