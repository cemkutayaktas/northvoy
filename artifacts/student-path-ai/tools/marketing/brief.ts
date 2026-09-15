/**
 * NorthVoy — marketing brief generator (internal, draft-only).
 *
 *   pnpm marketing:brief --problem "Bilgisayar Müh. mi Endüstri Müh. mi?" \
 *     --majors "Computer Science & Software Engineering,Mechanical & Civil Engineering" \
 *     --campaign tr-launch-01 --source tiktok --page /questionnaire/quick
 *
 * Produces ONE reviewable brief (Markdown) for a short vertical video aimed at
 * Turkish-speaking students choosing between 2–3 majors, plus a tracking record.
 *
 * Every product claim in the output is pulled from the app's own data files at
 * run time and cited with its source path. Nothing about outcomes, testimonials
 * or performance is invented — those fields do not exist here.
 *
 * Model integration is OPTIONAL and replaceable: if ANTHROPIC_API_KEY is set the
 * hooks/script are polished by the Messages API (one call per brief, cached by
 * input hash, hard cap per run). Without a key the deterministic Turkish
 * templates below are used, so the tool keeps working after any promotion or
 * credit expires. Never posts anywhere.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { MAJORS, MAJOR_DATA, type Major } from "../../src/lib/matching";
import { SALARY_DATA } from "../../src/lib/salaryData";
import { UNIVERSITIES_BY_COUNTRY } from "../../src/lib/universities";
import { COUNTRY_GUIDES } from "../../src/lib/countryGuides";
import { tContent } from "../../src/lib/i18n";
import { majorToSlug } from "../../src/lib/majorSlugs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");
const CACHE = path.join(HERE, "cache");
const LEDGER = path.join(HERE, "campaigns.jsonl");
const SITE = "https://northvoy.com";
const MAX_MODEL_CALLS_PER_RUN = 1;

// ─── CLI ──────────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).reduce<string[][]>((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? "true" : arr[i + 1]]);
    return acc;
  }, []),
);
const need = (k: string) => { if (!args[k]) { console.error(`missing --${k}`); process.exit(1); } return args[k]; };

const problem = need("problem");
const campaign = need("campaign").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
const source = (args.source ?? "tiktok").toLowerCase();
const page = args.page ?? "/questionnaire/quick";
const lang = "tr" as const; // initial audience is Turkish-speaking students
const majors = (args.majors ?? "").split(",").map(m => m.trim()).filter(Boolean) as Major[];
for (const m of majors) if (!MAJORS.includes(m)) { console.error(`unknown major: "${m}"\nknown: ${MAJORS.join(" | ")}`); process.exit(1); }

// ─── Verified product facts (computed from the code, cited) ──────────────────
const countries = new Set<string>(); const universities = new Set<string>();
for (const m of MAJORS) {
  for (const [c, l] of Object.entries(UNIVERSITIES_BY_COUNTRY[m] ?? {})) { countries.add(c); l.forEach(u => universities.add(u.split(" (")[0])); }
  MAJOR_DATA[m].countries.forEach(c => countries.add(c.name));
}
interface Fact { tr: string; source: string }
const facts: Fact[] = [
  { tr: "Test ücretsiz; sonuçları görmek için hesap gerekmez.", source: "src/pages/Results.tsx (top match rendered without account; 4 sections gated)" },
  { tr: "Hızlı test 9 soru, ~5 dakika; Detaylı analiz 15 adım / 24 soru, ~12 dakika.", source: "src/pages/QuizFlow.tsx QUICK_STEPS / DETAILED_STEPS" },
  { tr: `${MAJORS.length} bölüm, ${countries.size} ülke, ${universities.size}+ üniversite.`, source: "src/lib/matching.ts, src/lib/universities.ts (computed at run time)" },
  { tr: "Türkçe, İngilizce ve Almanca.", source: "src/lib/i18n.ts" },
  { tr: "Eşleşme puanı cevaplarına uyumu gösterir; kabul şansı veya kariyer garantisi değildir.", source: "src/lib/i18n.ts resultsDisclaimer" },
];
for (const m of majors) {
  const s = SALARY_DATA[m]; const d = MAJOR_DATA[m];
  const name = tContent(lang, "majors", m);
  if (s) facts.push({ tr: `${name}: ABD'de tipik yıllık maaş aralığı $${s.avgSalaryUSD[0].toLocaleString()}–$${s.avgSalaryUSD[1].toLocaleString()}, 10 yıllık istihdam artışı %${s.jobGrowthPct} (US BLS verisine dayalı).`, source: "src/lib/salaryData.ts (US Bureau of Labor Statistics)" });
  facts.push({ tr: `${name} kariyer yolları: ${d.careers.slice(0, 3).join(", ")}.`, source: "src/lib/matching.ts MAJOR_DATA.careers" });
  facts.push({ tr: `${name} için öne çıkan ülkeler: ${d.countries.slice(0, 3).map(c => c.name).join(", ")}.`, source: "src/lib/matching.ts MAJOR_DATA.countries" });
}

// ─── Identifiers, UTM ─────────────────────────────────────────────────────────
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const slug = problem.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const id = `${stamp}-${source}-${slug}`;
const validPage = page.startsWith("/") ? page : `/${page}`;
const utm = `${SITE}${validPage}?utm_source=${source}&utm_medium=social&utm_campaign=${campaign}&utm_content=${id}`;

// ─── Deterministic Turkish templates (always available) ──────────────────────
const trNames = majors.map(m => tContent(lang, "majors", m));
const pair = trNames.length >= 2 ? `${trNames[0]} mi, ${trNames[1]} mi` : problem;
const base = {
  hooks: [
    `"${pair}?" — bu soruyu 3 dakikada netleştirmenin bir yolu var.`,
    `Bölüm seçerken herkes sana "içinden geleni yap" diyor. Peki içinden ne geliyor, onu nasıl ölçeceksin?`,
    `Kararsız olmak sorun değil. Kararsız kalmak sorun. 9 soru, ücretsiz, hesap gerekmez.`,
  ],
  script: [
    { t: "0–3 sn", vo: `${pair}? Bu ikisi arasında kalan tek kişi sen değilsin.`, text: "Bölüm seçimi zor." },
    { t: "3–8 sn", vo: "Sorun şu: ikisini de gerçekten tanımadan karşılaştırıyorsun.", text: "Tahmin etme, karşılaştır." },
    { t: "8–15 sn", vo: `NorthVoy'da 9 soru cevaplıyorsun; ilgi alanlarına, güçlü yönlerine ve hedeflerine göre ${MAJORS.length} bölüm arasında en uygun 3'ünü görüyorsun — kariyer yolları ve üniversitelerle birlikte.`, text: `9 soru → ${MAJORS.length} bölüm arasından ilk 3` },
    { t: "15–20 sn", vo: "Ücretsiz. Sonuçları görmek için hesap bile gerekmez.", text: "Ücretsiz · Hesap gerekmez" },
    { t: "20–24 sn", vo: "Link profilde. Sonucunu yorumlara yaz, birlikte bakalım.", text: "Link profilde ↗" },
  ],
  caption: `${pair}? 🤔 Tahmin etmek yerine karşılaştır: 9 soru, ${MAJORS.length} bölüm, ücretsiz. Sonucunu yorumlara yaz 👇 Link profilde.`,
  cta: "Link profilde → ücretsiz testi çöz",
  hashtags: ["#üniversite", "#bölümseçimi", "#yks", "#tercih", "#kariyer"],
};

// ─── Optional model polish (replaceable; off by default) ─────────────────────
async function polish(): Promise<typeof base | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.NORTHVOY_MARKETING_MODEL ?? "claude-sonnet-5";
  const hash = crypto.createHash("sha256").update(JSON.stringify({ problem, majors, facts, model, v: 1 })).digest("hex").slice(0, 16);
  const cacheFile = path.join(CACHE, `${hash}.json`);
  if (fs.existsSync(cacheFile)) { console.log("model: reused cached output", hash); return JSON.parse(fs.readFileSync(cacheFile, "utf8")); }
  if ((globalThis as { __calls?: number }).__calls! >= MAX_MODEL_CALLS_PER_RUN) return null;
  (globalThis as { __calls?: number }).__calls = 1;

  const prompt = `Sen NorthVoy için kısa video metni yazan bir editörsün. Hedef kitle: 2–3 bölüm arasında kararsız, Türkçe konuşan lise/üniversite öğrencileri. Ton: samimi, net, "işi bilen abla/abi"; korku, abartı, "kaderini bul" gibi vaatler YOK. SADECE aşağıdaki doğrulanmış gerçekleri kullan; yeni istatistik, kullanıcı hikâyesi veya sonuç vaadi UYDURMA.\n\nProblem: ${problem}\nBölümler: ${trNames.join(", ")}\nGerçekler:\n${facts.map(f => "- " + f.tr).join("\n")}\n\nŞu JSON şemasında, Türkçe, başka hiçbir şey yazmadan yanıt ver:\n${JSON.stringify({ hooks: ["3 farklı hook, her biri ≤ 12 kelime"], script: [{ t: "0–3 sn", vo: "seslendirme", text: "ekran yazısı" }], caption: "≤ 200 karakter, emoji az", cta: "kısa CTA", hashtags: ["5 hashtag"] })}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) { console.warn(`model call failed (${res.status}); using templates`); return null; }
  const data = await res.json() as { content: { type: string; text?: string }[] };
  const text = data.content.find(c => c.type === "text")?.text ?? "";
  try {
    const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    if (!Array.isArray(parsed.hooks) || parsed.hooks.length !== 3 || !Array.isArray(parsed.script)) throw new Error("shape");
    fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(cacheFile, JSON.stringify(parsed, null, 2));
    return parsed;
  } catch { console.warn("model output not in expected shape; using templates"); return null; }
}

// ─── Emit ─────────────────────────────────────────────────────────────────────
const content = (await polish()) ?? base;
const generatedBy = process.env.ANTHROPIC_API_KEY ? "template + model polish" : "template (no model key set)";
const shots = fs.existsSync(path.join(HERE, "assets/screenshots"))
  ? fs.readdirSync(path.join(HERE, "assets/screenshots")).filter(f => f.endsWith(".png")) : [];

const md = `# ${id}

**Campaign:** ${campaign} · **Platform:** ${source} · **Language:** ${lang} · **Generated by:** ${generatedBy}
**Student problem:** ${problem}
**Majors:** ${majors.length ? majors.map(m => `${tContent(lang, "majors", m)} (\`/majors/${majorToSlug(m)}\`)`).join(", ") : "—"}
**Destination:** ${SITE}${validPage}

## Tracking link (paste exactly this)
\`\`\`
${utm}
\`\`\`
GA4 → Reports → Acquisition → Traffic acquisition, filter source = ${source}; compare videos by **utm_content = ${id}**.

## Hooks (pick one for the first 1.5 s)
${content.hooks.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n")}

## Script (15–25 s, vertical)
| Time | Voiceover | On-screen text |
|---|---|---|
${content.script.map((s: { t: string; vo: string; text: string }) => `| ${s.t} | ${s.vo} | **${s.text}** |`).join("\n")}

## Scene sequence
1. Talking head or text-on-gradient with the hook (brand blue #2563eb / navy #07091c, logo bottom-right: \`NorthVoy-logo.svg\` from the marketing kit).
2. Cut to a REAL app capture: quiz chooser (\`assets/screenshots/questionnaire.png\`).
3. REAL capture: a quiz step (\`assets/screenshots/quiz-step.png\`).
4. REAL capture: results top match (\`assets/screenshots/results.png\`) — demo data, no personal info.
5. End card: "${content.cta}" + link sticker.
${shots.length ? `\nAvailable captures: ${shots.join(", ")}` : "\n⚠ No captures found yet — run \`pnpm marketing:capture\` first. Until then, scenes 2–4 are ILLUSTRATIVE placeholders, not interface captures."}

## Caption
${content.caption}

**CTA:** ${content.cta}
**Hashtags:** ${content.hashtags.join(" ")}

## Verified claims used (do not add claims that are not on this list)
${facts.map(f => `- ${f.tr}  \n  _source: ${f.source}_`).join("\n")}

## Not allowed in this content
Testimonials, "X students got into Y", accuracy/validation claims, admission or salary guarantees, fear hooks about "wrong choices" (see marketing kit brand-voice.md).

## Performance record
Fill after 7 days from GA4 + platform insights → \`campaigns.jsonl\` entry \`${id}\`.
`;

fs.mkdirSync(OUT, { recursive: true });
const outFile = path.join(OUT, `${id}.md`);
fs.writeFileSync(outFile, md, "utf8");
const record = {
  id, created_at: new Date().toISOString(), campaign, source, lang, page: validPage, problem, majors, utm_url: utm,
  generated_by: generatedBy, status: "draft",
  metrics: { views: null, link_clicks_ga4_sessions: null, quiz_starts: null, quiz_completes: null, signups: null, note: "" },
};
fs.appendFileSync(LEDGER, JSON.stringify(record) + "\n");
console.log(`brief:  ${path.relative(process.cwd(), outFile)}`);
console.log(`ledger: ${path.relative(process.cwd(), LEDGER)} (+1 record, id=${id})`);
console.log(`utm:    ${utm}`);
