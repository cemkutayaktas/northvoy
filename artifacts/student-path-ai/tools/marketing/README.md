# Marketing brief tool (internal)

Draft-only. Generates a reviewable short-video brief for **Turkish-speaking students
choosing between 2–3 majors**, with a per-video UTM link and a ledger row for results.
Never posts, never DMs, never buys ads.

```
pnpm marketing:brief --problem "Bilgisayar Mühendisliği mi Endüstri Mühendisliği mi?" \
  --majors "Computer Science & Software Engineering,Mechanical & Civil Engineering" \
  --campaign tr-launch-01 --source tiktok --page /questionnaire/quick
pnpm marketing:capture     # real app screenshots → tools/marketing/assets/screenshots
```

Outputs
- `out/<id>.md` — hooks ×3, 15–25 s script, scene sequence + on-screen text, caption, CTA, UTM link, cited claims.
- `campaigns.jsonl` — one line per brief: id, inputs, UTM, `metrics` placeholders to fill from GA4 after 7 days.
- `<id>` is also the `utm_content` value, so GA4 can compare videos.

Claims: every product statement is computed from `src/lib/*` at run time and cited.
The brief lists what is **not allowed** (testimonials, accuracy claims, guarantees).

Model polish (optional): set `ANTHROPIC_API_KEY` to have the Messages API rewrite hooks/script
(1 call per brief, cached in `cache/`, model via `NORTHVOY_MARKETING_MODEL`). Without a key the
built-in Turkish templates are used — the tool does not depend on any credit or subscription.
Do not commit keys; `cache/` and `out/` are git-ignored except the three seed briefs.
