// @ts-check
/// <reference path="./kino.d.ts" />
// RedTube: lists the site's videos by reading its public pages (lists, categories, performers, a video's own page) and
// plays them from the player data of the video page; when the page does not give a playable address, it opens the page
// in Kino's hidden web view like a visitor would. Every entry is marked 18+: Kino shows it only while the person's 18+
// code is unlocked on that device.
// Read it top to bottom: 1. texts  2. pages  3. items  4. lists  5. home, section, categories  6. details  7. playing

const SITE = "https://www.redtube.com";
/** The site pages a long way, but nobody scrolls past this: it bounds "Ver más". */
const MAX_PAGE = 40;

// ---- 1. texts ----------------------------------------------------------------------------------------------------

const TEXTS = {
  es: {
    timeout: "RedTube no responde. Inténtalo de nuevo en un momento.",
    network: "No se pudo conectar con RedTube.",
    server: "RedTube respondió {status}.",
    badAnswer: "RedTube respondió algo inesperado.",
    unknownRef: "Referencia desconocida.",
    removed: "Este video ya no está disponible en RedTube.",
    geo: "RedTube no ofrece este video en tu país.",
    noStream: "No se encontró una fuente de video para este título.",
    human: "RedTube pide comprobar que eres una persona; Kino no lo resuelve. Inténtalo más tarde.",
    noBrowser: "Este dispositivo no puede abrir la página oculta de RedTube.",
    busy: "Kino está abriendo otra página. Inténtalo de nuevo en un momento.",
    views: "{n} vistas",
    performers: "Con {names}",
    uploader: "Canal: {name}",
    new: "Novedades",
    trending: "Tendencias",
    topRated: "Mejor valorados",
    viewedPeriod: "Más vistos",
    tabNew: "Novedades",
    tabPopular: "Populares",
    tabCats: "Categorías",
    tabCats2: "Más categorías",
    tabStars: "Estrellas",
    periodWeekly: "de la semana",
    periodMonthly: "del mes",
    periodAlltime: "de siempre",
    heroTitle: "RedTube",
    heroText: "Videos para adultos. Solo se muestran con tu código 18+ desbloqueado.",
    qualityMp4: "MP4 {q}p",
    qualityHls: "HLS {q}p",
    qualityBrowser: "Página oculta",
  },
  en: {
    timeout: "RedTube isn't responding. Try again in a moment.",
    network: "Could not reach RedTube.",
    server: "RedTube answered {status}.",
    badAnswer: "RedTube answered something unexpected.",
    unknownRef: "Unknown reference.",
    removed: "This video is no longer available on RedTube.",
    geo: "RedTube does not offer this video in your country.",
    noStream: "No video source was found for this title.",
    human: "RedTube asks to check that you are a person; Kino does not solve that. Try again later.",
    noBrowser: "This device cannot open RedTube's hidden page.",
    busy: "Kino is opening another page. Try again in a moment.",
    views: "{n} views",
    performers: "With {names}",
    uploader: "Channel: {name}",
    new: "New",
    trending: "Trending",
    topRated: "Top rated",
    viewedPeriod: "Most viewed",
    tabNew: "New",
    tabPopular: "Popular",
    tabCats: "Categories",
    tabCats2: "More categories",
    tabStars: "Performers",
    periodWeekly: "this week",
    periodMonthly: "this month",
    periodAlltime: "all time",
    heroTitle: "RedTube",
    heroText: "Adult videos. Shown only while your 18+ code is unlocked.",
    qualityMp4: "MP4 {q}p",
    qualityHls: "HLS {q}p",
    qualityBrowser: "Hidden page",
  },
};

function lang() {
  return String(kino.lang || "").toLowerCase().startsWith("es") ? "es" : "en";
}

function t(key, vars) {
  const tpl = TEXTS[lang()][key] || TEXTS.es[key] || key;
  return vars ? tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] != null ? vars[k] : "")) : tpl;
}

/** The Spanish name shown for the site's categories (by their English name); the site's own name is the fallback. */
const CATEGORY_ES = {
  "Big Tits": "Tetas grandes", Teens: "Jovencitas", Lesbian: "Lesbianas", Blowjob: "Sexo oral", Anal: "Anal", Amateur: "Amateur",
  Asian: "Asiáticas", Public: "En público", Cumshot: "Eyaculación", Ebony: "Ébano", Group: "Grupal", Hentai: "Hentai",
  Mature: "Maduras", Fetish: "Fetiche", Japanese: "Japonesas", Facials: "Facial", MILF: "MILF", Latina: "Latinas",
  Gangbang: "Gangbang", Squirting: "Squirting", Interracial: "Interracial", Masturbation: "Masturbación", Blonde: "Rubias",
  Creampie: "Creampie", "Double Penetration": "Doble penetración", Lingerie: "Lencería", POV: "POV", Redhead: "Pelirrojas",
  Vintage: "Vintage", Arab: "Árabes", Brazilian: "Brasileñas", HD: "HD", "Virtual Reality": "Realidad virtual",
  Compilation: "Recopilaciones", Casting: "Casting", "Verified Amateurs": "Amateur verificados", "Young and Old": "Jóvenes y maduros",
  Indian: "Indias", BBW: "BBW", Romantic: "Romántico", Massage: "Masajes", Cartoon: "Dibujos", French: "Francesas",
  Bondage: "Bondage", Pissing: "Lluvia dorada", Feet: "Pies", Brunette: "Morenas", Celebrity: "Famosas", German: "Alemanas",
  Rough: "Duro", "Big Ass": "Culos grandes", Funny: "Divertido", Threesome: "Tríos", European: "Europeas", Orgy: "Orgías",
  Reality: "Reality", College: "Universitarias", Bukkake: "Bukkake", Party: "Fiesta", Cosplay: "Cosplay", Webcam: "Webcam",
  "Big Dick": "Pollas grandes", "Step Fantasy": "Fantasía familiar", "Female Orgasm": "Orgasmo femenino", Toys: "Juguetes",
  "Solo Male": "Hombre solo", "Bisexual Male": "Bisexual masculino", Bisexual: "Bisexual", Cuckold: "Cuckold",
  Fingering: "Dedos", Fisting: "Fisting", Handjob: "Con la mano", Muscle: "Musculosos", Parody: "Parodias",
  "Popular With Women": "Popular entre mujeres", "Pussy Licking": "Sexo oral a ella", "Small Tits": "Tetas pequeñas",
  "Solo girl": "Chica sola", Striptease: "Striptease", Tattoos: "Tatuajes", Erotic: "Erótico", Hardcore: "Hardcore",
  Strip: "Strip", Shemale: "Trans", Transgender: "Transgénero",
};

/** The categories Home and the section's first category tab lean on, in this order (the site's own names). */
const FEATURED = ["HD", "Amateur", "MILF", "Latina", "Asian", "Teens", "Lesbian", "Big Tits", "Anal", "Blonde", "Ebony", "Mature"];

function categoryName(name) {
  return lang() === "es" ? CATEGORY_ES[name] || name : name;
}

// ---- 2. pages ----------------------------------------------------------------------------------------------------

function failFetch(e) {
  const code = e && e.code;
  throw kino.error("unavailable", "fetch " + (code || "error"), { userMessage: t(code === "timeout" ? "timeout" : "network") });
}

/** A page of the site as text. A missing page (404 or 410) is `null`; any other failure throws. */
async function getHtml(pathAndQuery, timeoutMs) {
  let r;
  try {
    r = await kino.fetch(SITE + "/" + pathAndQuery.replace(/^\//, ""), { timeoutMs: timeoutMs || 15000, headers: { Accept: "text/html" } });
  } catch (e) {
    failFetch(e);
  }
  if (r.status === 404 || r.status === 410) return null;
  if (!r.ok) throw kino.error("unavailable", "http " + r.status, { userMessage: t("server", { status: r.status }) });
  return r.text();
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decode(s) {
  return String(s == null ? "" : s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (ENTITIES[n.toLowerCase()] != null ? ENTITIES[n.toLowerCase()] : m))
    .replace(/\s+/g, " ")
    .trim();
}

function httpUrl(u) {
  const s = decode(u);
  return /^https?:\/\//i.test(s) && s.length <= 2048 ? s : undefined;
}

let categoriesCache = null;
let starsCache = null;

/** The site's categories: `[{ id, name, slug, art }]`, from its Categories page. */
async function loadCategories() {
  if (categoriesCache) return categoriesCache;
  const html = await getHtml("categories");
  if (!html) throw kino.error("unavailable", "no categories", { userMessage: t("badAnswer") });
  const out = [];
  const seen = new Set();
  const re = /data-category_id="(\d+)"[\s\S]*?aria-label="([^"]+)"\s+href="\/redtube\/([a-z0-9_-]+)"[\s\S]*?data-src="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    if (seen.has(m[3])) continue;
    seen.add(m[3]);
    out.push({ id: m[1], name: decode(m[2]), slug: m[3], art: httpUrl(m[4]) });
  }
  if (!out.length) throw kino.error("unavailable", "no categories", { userMessage: t("badAnswer") });
  categoriesCache = out;
  return out;
}

/** The site's most popular performers: `[{ name, slug }]`, in the order its Pornstars page lists them. */
async function loadStars() {
  if (starsCache) return starsCache;
  const html = await getHtml("pornstar");
  const out = [];
  const seen = new Set();
  const re = /<a[^>]*aria-label="([^"]+)"[^>]*href="\/pornstar\/([^"?\/]+)"/g;
  let m;
  while (html && (m = re.exec(html))) {
    if (seen.has(m[2])) continue;
    seen.add(m[2]);
    out.push({ name: decode(m[1]), slug: m[2] });
  }
  starsCache = out;
  return out;
}

// ---- 3. items ----------------------------------------------------------------------------------------------------

/** "7:05" or "1:02:33" to minutes (at least 1), or undefined. */
function minutesOf(duration) {
  const parts = String(duration || "").split(":").map((x) => Number(x));
  if (!parts.length || parts.some((n) => !Number.isFinite(n))) return undefined;
  const seconds = parts.reduce((acc, n) => acc * 60 + n, 0);
  return seconds > 0 ? Math.max(1, Math.round(seconds / 60)) : undefined;
}

/** The video cards of a list page, as Kino items. */
function parseCards(html) {
  const items = [];
  const seen = new Set();
  const re = /<li\b[^>]*\bdata-video-id="(\d{1,12})"[^>]*>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const id = m[1];
    if (seen.has(id)) continue;
    const body = m[2];
    const title = decode((/class="video-title-text[^"]*"[\s\S]*?>([^<]+)</.exec(body) || /alt="([^"]+)"/.exec(body) || [])[1]);
    if (!title) continue;
    seen.add(id);
    const poster = httpUrl((/data-o_thumb="([^"]+)"/.exec(body) || /data-src="(https?:[^"]+)"/.exec(body) || [])[1]);
    const duration = (/tm_video_duration">\s*([\d:]+)/.exec(body) || [])[1];
    const stats = [...body.matchAll(/class='info-views'>\s*([^<]*)</g)].map((x) => decode(x[1]));
    const views = stats[0] || "";
    const pct = Number((/^(\d{1,3})%$/.exec(stats[1] || "") || [])[1]);
    const item = {
      id: "rt" + id,
      ref: "v:" + id,
      title: title.slice(0, 200),
      kind: "movie",
      adult: true,
      poster,
      runtimeMinutes: minutesOf(duration),
      overview: views && views !== "0" ? t("views", { n: views }) : undefined,
    };
    if (pct > 0) item.rating = Math.min(10, pct / 10);
    items.push(item);
  }
  return items;
}

// ---- 4. lists ----------------------------------------------------------------------------------------------------

const SORTINGS = new Set(["newest", "mostviewed", "rating", "longest", "mostfavored", "featured"]);
const PERIODS = new Set(["weekly", "monthly", "alltime"]);
const LIST_PATH = /^(newest|hot|mostviewed|top|redtube\/[a-z0-9_-]{1,40}|pornstar\/[a-z0-9+_.%'-]{1,80})$/i;

function settingPeriod() {
  const p = String(kino.config.get("period") || "monthly");
  return PERIODS.has(p) ? p : "monthly";
}

/**
 * The refs of a list: `l:<path>[?sorting=..&period=..]` (a page of the site: `newest`, `hot`, `mostviewed`, `top`,
 * `redtube/<category>`, `pornstar/<performer>`) and `q:<text>` (a search). Anything else is not ours.
 */
function listRef(path, params) {
  const qs = Object.entries(params || {})
    .filter(([, v]) => v)
    .map(([k, v]) => k + "=" + encodeURIComponent(v))
    .join("&");
  return "l:" + path + (qs ? "?" + qs : "");
}

function parseListRef(ref) {
  const s = String(ref || "");
  if (s.startsWith("q:")) return s.length > 2 && s.length <= 140 ? { search: s.slice(2) } : null;
  if (!s.startsWith("l:")) return null;
  const [path, qs] = s.slice(2).split("?");
  if (!LIST_PATH.test(path)) return null;
  const params = {};
  for (const pair of (qs || "").split("&").filter(Boolean)) {
    const [k, v] = pair.split("=");
    const val = decodeURIComponent(v || "");
    if (k === "sorting" && SORTINGS.has(val)) params.sorting = val;
    else if (k === "period" && PERIODS.has(val)) params.period = val;
  }
  return { path, params };
}

function pageOf(cursor) {
  const n = Number(cursor);
  return Number.isInteger(n) && n >= 1 && n <= MAX_PAGE ? n : 1;
}

/** One page of a list or a search, with `next` while the site says there is another. */
async function listPage(spec, cursor) {
  const page = pageOf(cursor);
  const q = [];
  let path = "";
  if (spec.search != null) q.push("search=" + encodeURIComponent(spec.search.slice(0, 100)));
  else {
    path = spec.path;
    if (spec.params && spec.params.sorting) q.push("sorting=" + spec.params.sorting);
    if (spec.params && spec.params.period) q.push("period=" + spec.params.period);
  }
  if (page > 1) q.push("page=" + page);
  const html = await getHtml(path + (q.length ? "?" + q.join("&") : ""));
  if (!html) return { items: [] };
  const items = parseCards(html);
  const out = { items };
  if (items.length && page < MAX_PAGE && /rel="next"/.test(html)) out.next = String(page + 1);
  return out;
}

export async function browse(ref, cursor) {
  const spec = parseListRef(ref);
  if (!spec) throw kino.error("not_found", "bad ref", { userMessage: t("unknownRef") });
  return listPage(spec, cursor);
}

export async function search(query) {
  const q = String((query && query.q) || "").trim();
  if (!q) return [];
  return listPage({ search: q }, query && query.cursor);
}

// ---- 5. home, section, categories --------------------------------------------------------------------------------

function periodLabel(period) {
  return t(period === "weekly" ? "periodWeekly" : period === "alltime" ? "periodAlltime" : "periodMonthly");
}

/** A row for a list, or null when it came back empty or failed (one slow list never costs the others). */
async function rowFor(id, title, ref) {
  try {
    const page = await listPage(parseListRef(ref), null);
    if (!page.items.length) return null;
    return { id, title, ref, items: page.items.slice(0, 40) };
  } catch (e) {
    kino.log("row " + id + " failed: " + (e && e.code ? e.code : "error"));
    return null;
  }
}

async function featuredCategories() {
  const all = await loadCategories();
  const byName = new Map(all.map((c) => [c.name, c]));
  return FEATURED.map((n) => byName.get(n)).filter(Boolean);
}

function categoryRow(c, prefix) {
  return rowFor((prefix || "") + "cat-" + c.slug, categoryName(c.name), listRef("redtube/" + c.slug));
}

export async function home() {
  const rowCount = Math.min(10, Math.max(1, Number(kino.config.get("homeRows")) || 6));
  const jobs = [
    rowFor("new", t("new"), listRef("newest")),
    rowFor("hot", t("trending"), listRef("hot")),
    rowFor("viewed", t("viewedPeriod") + " " + periodLabel("weekly"), listRef("mostviewed", { period: "weekly" })),
  ];
  if (rowCount > 3) {
    let cats = [];
    try {
      cats = await featuredCategories();
    } catch (e) {
      kino.log("categories failed: " + (e && e.code ? e.code : "error"));
    }
    for (const c of cats.slice(0, rowCount - 3)) jobs.push(categoryRow(c));
  }
  const rows = (await Promise.all(jobs)).filter(Boolean).slice(0, rowCount);
  if (!rows.length) throw kino.error("unavailable", "no rows", { userMessage: t("network") });
  return rows;
}

export async function section(arg) {
  const tabs = [
    { id: "new", label: t("tabNew") },
    { id: "popular", label: t("tabPopular") },
    { id: "cats", label: t("tabCats") },
    { id: "cats2", label: t("tabCats2") },
    { id: "stars", label: t("tabStars") },
  ];
  const tab = tabs.some((x) => x.id === (arg && arg.tab)) ? arg.tab : "new";
  const hero = { title: t("heroTitle"), text: t("heroText") };
  const jobs = [];
  if (tab === "new") {
    jobs.push(rowFor("s-new", t("new"), listRef("newest")));
    jobs.push(rowFor("s-hot", t("trending"), listRef("hot")));
  } else if (tab === "popular") {
    for (const p of ["weekly", "monthly", "alltime"]) {
      jobs.push(rowFor("s-pop-" + p, t("viewedPeriod") + " " + periodLabel(p), listRef("mostviewed", { period: p })));
    }
    jobs.push(rowFor("s-top", t("topRated"), listRef("top", { period: settingPeriod() })));
  } else if (tab === "stars") {
    for (const s of (await loadStars()).slice(0, 12)) jobs.push(rowFor("s-star-" + s.slug.replace(/[^A-Za-z0-9._~-]/g, "-"), s.name, listRef("pornstar/" + s.slug)));
  } else {
    const all = await loadCategories();
    const featured = new Set(FEATURED);
    const pool = tab === "cats" ? FEATURED.map((n) => all.find((c) => c.name === n)).filter(Boolean) : all.filter((c) => !featured.has(c.name));
    for (const c of pool.slice(0, 12)) jobs.push(categoryRow(c, "s-"));
  }
  const rows = (await Promise.all(jobs)).filter(Boolean);
  return { tabs, tab, hero, rows };
}

export async function categories() {
  const all = await loadCategories();
  const featured = FEATURED.map((n) => all.find((c) => c.name === n)).filter(Boolean);
  const rest = all.filter((c) => !FEATURED.includes(c.name));
  return featured.concat(rest).slice(0, 24).map((c) => ({
    id: "cat-" + c.slug,
    title: categoryName(c.name).slice(0, 40),
    ref: listRef("redtube/" + c.slug),
    art: c.art,
    adult: true,
  }));
}

// ---- 6. details --------------------------------------------------------------------------------------------------

function idOfRef(ref) {
  const m = /^(?:v|cap):(\d{1,12})$/.exec(String(ref || ""));
  return m ? m[1] : null;
}

/** A video's own page, read once per run: `details` and `resolve` both want it right after each other. */
const pageCache = new Map();

async function loadVideoPage(id) {
  if (pageCache.has(id)) return pageCache.get(id);
  const html = await getHtml(id);
  if (pageCache.size > 8) pageCache.delete(pageCache.keys().next().value);
  pageCache.set(id, html);
  return html;
}

function titleCase(s) {
  return String(s).replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

function allMatches(html, re) {
  return [...html.matchAll(re)].map((m) => decode(m[1])).filter(Boolean);
}

/** A title's own page: categories and tags as genres, the performers and the channel in the synopsis. */
export async function details(ref) {
  const id = idOfRef(ref);
  if (!id) return null;
  const html = await loadVideoPage(id);
  if (!html) return null;
  const categoryNames = allMatches(html, /video_carousel_category"\s+href="\/redtube\/[^"]+">([^<]+)</g);
  const tags = allMatches(html, /video_carousel_tag[^"]*"\s+href="\/\?search=[^"]+">([^<]+)</g);
  const performers = [...new Set(allMatches(html, /class\s*=\s*"pornstar-name[^"]*">\s*<a\s+href="\/pornstar\/[^"]+">([^<]+)</g))];
  const channel = (/href="\/channels\/[^"]+"[^>]*>\s*([^<]+?)\s*</.exec(html) || [])[1];
  const lines = [];
  if (performers.length) lines.push(t("performers", { names: performers.slice(0, 6).join(", ") }));
  if (channel) lines.push(t("uploader", { name: decode(channel) }));
  const more = tags.slice(0, 12).join(", ");
  if (more) lines.push(more);
  const out = {
    genres: categoryNames.concat(tags.map(titleCase)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 5).map((x) => x.slice(0, 30)),
  };
  if (lines.length) out.overview = lines.join("\n");
  const seconds = Number((/"video_duration":"?(\d+)/.exec(html) || [])[1]);
  if (seconds > 0) out.runtimeMinutes = Math.max(1, Math.round(seconds / 60));
  const image = httpUrl((/<meta property="og:image" content="([^"]+)"/.exec(html) || [])[1]);
  if (image) out.backdrop = image;
  return out;
}

// ---- 7. playing --------------------------------------------------------------------------------------------------

const HLS = "application/x-mpegURL";

function absolute(u) {
  const s = String(u || "").replace(/\\\//g, "/");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  return s.startsWith("/") ? SITE + s : "";
}

/** The JSON array that follows `"mediaDefinitions":` in a video page, found by matching brackets (strings respected). */
function mediaDefinitionsOf(html) {
  const key = '"mediaDefinitions":';
  const at = html.indexOf(key);
  if (at < 0) return null;
  let i = html.indexOf("[", at + key.length);
  if (i < 0 || i - (at + key.length) > 4) return null;
  const start = i;
  let depth = 0;
  let inString = false;
  for (; i < html.length && i - start < 200000; i++) {
    const ch = html[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) {
      try {
        const list = JSON.parse(html.slice(start, i + 1));
        return Array.isArray(list) ? list : null;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

/** What one definition offers: `[{ format, quality, url }]`. A `remote` one is an address that answers with a list. */
async function variantsOf(def, pageUrl) {
  if (!def || typeof def !== "object") return [];
  const url = absolute(def.videoUrl);
  if (!url) return [];
  if (!def.remote) {
    const quality = Number(def.quality) || null;
    return [{ format: def.format === "hls" ? "hls" : "mp4", quality, url }];
  }
  let r;
  try {
    r = await kino.fetch(url, { timeoutMs: 12000, headers: { Accept: "application/json", Referer: pageUrl } });
  } catch (e) {
    return [];
  }
  if (!r.ok) return [];
  let list;
  try {
    list = r.json();
  } catch (e) {
    return []; // the site answered a web page, not the list: the hidden page will do it
  }
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const e of list) {
    const u = e && absolute(e.videoUrl);
    if (!u) continue;
    const format = e.format === "hls" || /\.m3u8(\?|$)/i.test(u) ? "hls" : "mp4";
    const q = Number(Array.isArray(e.quality) ? e.quality[0] : e.quality) || Number(e.defaultQuality) || null;
    out.push({ format, quality: q, url: u });
  }
  return out;
}

function streamHeaders() {
  return { Referer: SITE + "/" };
}

/** The Stream for the variants found: the preferred quality first (HLS before MP4 at the same quality), the rest as labelled copies. */
function streamFrom(variants) {
  const rank = (v) => (v.quality || 0) * 2 + (v.format === "hls" ? 1 : 0);
  const sorted = variants.slice().sort((x, y) => rank(y) - rank(x));
  if (!sorted.length) return null;
  const wanted = Number(kino.config.get("quality")) || 0; // 0: the best there is
  const primary = (wanted && sorted.find((v) => v.quality && v.quality <= wanted)) || (wanted ? sorted[sorted.length - 1] : sorted[0]);
  const label = (v) => t(v.format === "hls" ? "qualityHls" : "qualityMp4", { q: v.quality || "?" });
  const headers = streamHeaders();
  const copy = (v) => ({ url: v.url, mime: v.format === "hls" ? HLS : "video/mp4", headers, label: label(v) });
  return Object.assign(copy(primary), {
    alternatives: sorted.filter((v) => v !== primary).slice(0, 7).map(copy),
    expiresInSeconds: 1200,
  });
}

/** Reads the video's own page like any visitor's browser does; null when it gives no playable address. */
async function resolveFromPage(id) {
  const pageUrl = SITE + "/" + id;
  const html = await loadVideoPage(id);
  if (html === null) throw kino.error("not_found", "page 404", { userMessage: t("removed") });
  if (/"video_unavailable_country"\s*:\s*"?true/.test(html)) throw kino.error("unavailable", "geo", { userMessage: t("geo") });
  const defs = mediaDefinitionsOf(html);
  if (!defs || !defs.length) return null;
  const all = [];
  for (const def of defs) all.push(...(await variantsOf(def, pageUrl)));
  return streamFrom(all);
}

/** Opens the page in Kino's hidden web view and takes the video requests it makes. */
async function resolveFromBrowser(id) {
  if (!kino.browser || typeof kino.browser.capture !== "function") {
    throw kino.error("unavailable", "no browser", { userMessage: t("noBrowser") });
  }
  let page;
  try {
    page = await kino.browser.capture(SITE + "/" + id, { timeoutMs: 22000 });
  } catch (e) {
    const code = e && e.code;
    if (code === "blocked") throw kino.error("unavailable", "blocked", { userMessage: t("human") });
    if (code === "browser_unavailable") throw kino.error("unavailable", "browser_unavailable", { userMessage: t("noBrowser") });
    if (code === "busy") throw kino.error("unavailable", "busy", { userMessage: t("busy") });
    throw kino.error("unavailable", "capture " + (code || "error"), { userMessage: t("noStream") });
  }
  const media = Array.isArray(page.media) ? page.media : [];
  if (!media.length) throw kino.error("unavailable", "no media", { userMessage: t("noStream") });
  const kindOf = (m) => ((m.mime && /mpegurl/i.test(m.mime)) || /\.m3u8(\?|$)/i.test(m.url) ? HLS : m.mime || "video/mp4");
  const [first, ...rest] = media;
  return {
    url: first.url,
    mime: kindOf(first),
    headers: first.headers,
    label: t("qualityBrowser"),
    alternatives: rest.slice(0, 6).map((m) => ({ url: m.url, mime: kindOf(m), headers: m.headers, label: t("qualityBrowser") })),
  };
}

export async function resolve(ref) {
  const id = idOfRef(ref);
  if (!id) throw kino.error("not_found", "bad ref", { userMessage: t("unknownRef") });
  if (String(ref).startsWith("cap:")) return resolveFromBrowser(id);
  let stream = null;
  try {
    stream = await resolveFromPage(id);
  } catch (e) {
    // A video that is gone or blocked for the country says so; anything else falls through to the hidden page.
    if (e && (e.code === "not_found" || String(e.message).includes("geo"))) throw e;
    kino.log("page read failed: " + (e && e.code ? e.code : "error"));
  }
  if (stream) return stream;
  return resolveFromBrowser(id);
}
