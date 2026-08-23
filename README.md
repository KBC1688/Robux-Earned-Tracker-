# Robux Earned Tracker

A tiny offline app for logging Robux earnings, tracking a goal, and seeing what
it's worth in USD. It runs entirely in your phone's browser — no account, no
server, no internet needed after the first load. Everything you log is stored on
the device itself.

## What it does

- Log each earning: amount, source (game pass, dev product, group payout, UGC…),
  date, and an optional note
- Running totals: all time, this week, this month, best day, daily average
- Goal with a progress bar
- USD estimate using the DevEx rate (default $0.0035 per Robux, editable)
- Export to CSV, back up and restore as JSON
- Works offline; data never leaves the phone

## Put it on your phone

### Option A — GitHub Pages (recommended, installs like a real app)

1. In this repo on GitHub: **Settings → Pages → Source: Deploy from a branch**,
   pick the branch and the `/ (root)` folder, then save.
2. Wait a minute, then open the published URL on your phone
   (`https://<your-username>.github.io/Robux-Earned-Tracker-/`).
3. Add it to your home screen:
   - **iPhone (Safari):** Share button → *Add to Home Screen*
   - **Android (Chrome):** ⋮ menu → *Install app* / *Add to Home screen*

It then opens full screen with its own icon and keeps working with no signal.

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
