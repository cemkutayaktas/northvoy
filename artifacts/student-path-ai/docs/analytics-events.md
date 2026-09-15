# Product analytics — event schema

Provider: the existing GA4 property (`G-36VV99K85B`, loaded in `index.html`). All events go
through `src/lib/analytics.ts`; nothing else calls `gtag` directly.

## Journey and events

| Event | Fires exactly when | Params (besides `lang`) |
|---|---|---|
| `page_view` | Every SPA route change (existing behaviour). `page_location` keeps **only** `utm_*` query params; share payloads and auth tokens are stripped. | `page_path`, `page_location` |
| `quiz_start` | User accepts the consent screen and a **new** attempt begins. Resuming a saved draft does not fire it. Once per attempt. | `quiz_mode`, `attempt_id` |
| `quiz_step_complete` | User advances past a step. Once per (attempt, step): going back and forward again does not double count. | `quiz_mode`, `attempt_id`, `step_id`, `step_index`, `step_total` |
| `quiz_complete` | Results were computed and stored. Once per attempt. | `quiz_mode`, `attempt_id`, `top_major`, `confidence` |
| `results_view` | Results are rendered. Once per results set per browser session (a refresh does not refire; a new session does). | `quiz_mode`, `attempt_id`, `top_major`, `confidence`, `source` = `own` \| `shared_link` |
| `signup_cta_click` | A signup CTA on the results page is clicked. Measures which gate creates intent. | `source` = `results_gate_matches` \| `results_gate_compare` \| `results_gate_plan` \| `results_gate_explore` \| `results_save` |
| `signup_start` | Register form submitted **and** client validation passed (a request is made). | — |
| `signup_complete` | Supabase returned a created account. Email confirmation may still be pending. | `requires_confirmation` |
| `login_success` | A session was established: password login, or the first sign-in after the confirmation email (`type=signup` in the URL hash). | — |
| `share_click` | A share control was clicked. | `method` = `clipboard_link` \| `native` |
| `share_success` | `navigator.share` resolved, or `clipboard.writeText` resolved. A rejected clipboard write is **not** a success. | `method` = `clipboard_link` \| `native` \| `clipboard_text` |
| `pdf_download_click` | The PDF button was clicked. | — |
| `pdf_generated` | The PDF was built and handed to the browser without throwing. Whether the user keeps the file is not observable — hence the name, not "download_success". | — |
| `feedback_submit` | The feedback row was **stored** in Supabase (insert returned no error). | `quiz_mode`, `helped`, `wants` (comma-joined option keys) |

`attempt_id` is a random UUID with no link to a person. `top_major` is the product's own output
category. No names, emails, free text, or raw questionnaire answers are ever sent.

## Privacy
- Quiz/results events can only fire after the consent screen (structural, not a flag).
- The browser's Global Privacy Control signal disables all events including `page_view`.
- The share link embeds encoded answers in the URL for the *recipient*; that URL never reaches GA4.

## Drop-off
Use `quiz_step_complete.step_index` (0-based) per `attempt_id`: the last index reached before no
`quiz_complete` is the abandonment step. Browser-close events are not used — unreliable.

## Campaign attribution
GA4 reads `utm_source / utm_medium / utm_campaign / utm_content` from the landing `page_view`
automatically. `utm_content` is the per-video id from `tools/marketing/campaigns.jsonl`, so
individual videos can be compared. No custom attribution code is duplicated on our side.

## GA4 setup (manual, ~15 min — the property UI is not accessible from the repo)
1. **Admin → Events → Create key events**: mark `quiz_complete`, `signup_complete`, `feedback_submit` as key events.
2. **Admin → Custom definitions → Custom dimensions** (event scope), so params can be used in reports:
   `quiz_mode`, `lang`, `step_id`, `step_index`, `top_major`, `source`, `method`, `helped`, `wants`, `requires_confirmation`.
   (Without this, params are collected but not reportable.)
3. **Explore → Funnel exploration**, steps: `page_view` → `quiz_start` → `quiz_complete` → `results_view` → `signup_complete`.
   Breakdown: `Session source / medium`, then `Session campaign`. This is the acquisition-to-completion view.
4. **Explore → Free form**: rows `step_id`, metric event count for `quiz_step_complete`, filter `quiz_mode` — the drop-off ladder.
5. Realtime → "Event count by Event name" to confirm events arrive after deploy.
Note: GA4 data is not retroactive — nothing exists until these events are deployed.
