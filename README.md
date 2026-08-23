# Robux Earned Tracker

A tiny offline app for logging Robux earnings, tracking a goal, and seeing what
it's worth in USD. It runs entirely in your phone's browser — no account, no
server, no internet needed after the first load. Everything you log is stored on
the device itself.

## What it does

- **Two goal rings** — Robux earned against a 1.5B goal, and take-home USD
  against a $3,500,000 goal
- **Tax built in** — converts Robux to USD at the DevEx rate, takes 35% off the
  top and shows the tax amount; only the take-home figure counts toward the USD goal
- **Roblox CSV import** — load your Roblox transaction export and it files the
  earnings for you, skipping spends and anything already logged
- Log earnings by hand too: amount, source (game pass, dev product, group payout,
  UGC…), date, note
- Running totals: this week, this month, best day, daily average
- Export to CSV, back up and restore as JSON
- Works offline; data never leaves the phone

All four numbers — both goals, the DevEx rate and the tax rate — are editable in
Settings.

## About connecting to Roblox

The app cannot read your Roblox balance on its own, and no app on your phone can.
Balance and transaction history sit behind Roblox's authenticated API, which
requires your `.ROBLOSECURITY` cookie — that cookie is full access to your
account, it bypasses two-factor, and handing it to any third party breaks
Roblox's terms. Browsers also block cross-site requests to Roblox outright, so
the call cannot be made from a web page at all.

What works instead, with no credentials involved: on roblox.com open
**Settings → Transactions** (or Creator Dashboard → Transactions), export the
range you want as CSV, then tap **Import Roblox CSV** in the app. It reads both
the account and creator export layouts, maps each transaction type to a source,
skips purchases, and de-duplicates against what you've already imported — so
overlapping date ranges never double-count.

## Put it on your phone

### Option A — GitHub Pages (recommended, installs like a real app)

GitHub Pages needs the repository to be **public**, unless the account is on a
paid GitHub plan.

1. **Settings → General**, scroll to the bottom, **Change repository visibility
   → Public**.
2. **Settings → Pages → Source: Deploy from a branch**. Pick branch
   `claude/local-phone-app-script-9lh2lr` and folder `/ (root)`, then **Save**.
3. Wait about a minute, then open
   `https://kbc1688.github.io/Robux-Earned-Tracker-/` on your phone.
4. Add it to your home screen:
   - **iPhone (Safari):** Share button → *Add to Home Screen*
   - **Android (Chrome):** ⋮ menu → *Install app* / *Add to Home screen*

It then opens full screen with its own icon and keeps working with no signal.
Every later push to that branch republishes the site automatically.

Making the repo public shares the app's source code. It does not share anything
you log — entries live in your phone's browser storage and are never committed.

### Option B — no hosting at all

Save `index.html` to the phone (email or AirDrop it to yourself, or download it
from GitHub) and open it from the Files app. Everything works except the
install-to-home-screen part.

### Option C — try it on a computer first

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app — markup, styling and logic in one file |
| `manifest.json` | Name, icon and colors used when installing to the home screen |
| `sw.js` | Service worker that caches the app so it opens offline |
| `icons/` | Home screen icons |

## Notes

- Data lives in the browser's `localStorage` for that site, on that phone. Clearing
  the browser's site data wipes it — use **Backup JSON** in Settings first.
- Log what actually reached your account (after Roblox's marketplace cut) so the
  totals match your transaction history.
- The USD figure is an estimate at the DevEx rate; it isn't a payout quote, and
  DevEx has its own eligibility rules and minimums.
- Updating the app? Bump `CACHE` in `sw.js` so installed phones fetch the new files.
