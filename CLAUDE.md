# Repo guide

Two small phone apps, both static and both served by GitHub Pages from this
branch. No build step — edit the files and push.

| Path | What it is | Live at |
| --- | --- | --- |
| `index.html`, `sw.js`, `manifest.json`, `icons/` | Robux Earned Tracker | `/Robux-Earned-Tracker-/` |
| `board/` | Claude Project Board | `/Robux-Earned-Tracker-/board/` |

Pages deploys from branch `claude/local-phone-app-script-9lh2lr`, folder `/ (root)`.
A push is live in about a minute. Bump `CACHE` in the relevant `sw.js` whenever
the file list changes.

## Keeping the project board up to date

**`board/tasks.json` is the single source of truth for project status.** The
board app reads it; nothing else writes it. Kylie's phone can only hold changes
locally until an agent commits them here.

### When to update it

Whenever you finish, start, or learn something substantial about **Whimsy World**
or **Cog Cleanup** in any session on this repo, update `board/tasks.json` in the
same commit as the work:

- Started something → set that task's `status` to `wip`
- Finished something → set it to `done`
- Found follow-up work → add a task with status `todo`
- Idea for later, not committed to → add it with status `future`

Don't wait to be asked. If you did the work, record it.

### Schema

```jsonc
{
  "version": 1,
  "updated": "2026-08-23T18:00:00Z",   // bump to now (UTC) on every change
  "projects": [
    { "id": "whimsy-world", "name": "Whimsy World", "emoji": "🎡" }
  ],
  "tasks": [
    {
      "id": "t-007",                  // unique, stable, never reused
      "project": "whimsy-world",      // must match a project id
      "status": "wip",                // wip | todo | future | done
      "title": "Short, plain-language",
      "note": "Optional detail",
      "updated": "2026-08-23",        // YYYY-MM-DD, the day you touched it
      "by": "Claude"                  // "Claude" or "Kylie"
    }
  ]
}
```

Rules that keep the phone in sync:

- **Never reuse or renumber an `id`.** The app matches its local edits against
  them; renumbering resurrects changes Kylie already dealt with.
- **Always set `updated`** on a task you touch. The app drops Kylie's local copy
  of a task once the committed `updated` is that day or later — that's how her
  phone clears itself.
- `status` must be exactly one of `wip`, `todo`, `future`, `done`.
- Adding a project is fine; give it an `id`, `name` and `emoji`, and the app
  grows a tab for it.
- Validate before committing: `python3 -c "import json;json.load(open('board/tasks.json'))"`

### Applying changes from Kylie's phone

She may paste a block headed *"Board changes from my phone"* with `EDIT` / `ADD`
/ `DELETE` lines and a JSON blob. Apply each line to `board/tasks.json`:

- `EDIT <id>` — set that task's status/title/note, and set `updated` to today
- `ADD [project] "title"` — append a task with a fresh `t-NNN` id, `by: "Kylie"`
- `DELETE <id>` — remove that task

Then bump the top-level `updated`, commit, and push. Her phone clears those
local changes the next time it loads.

## Conventions

- Work on branch `claude/local-phone-app-script-9lh2lr` unless told otherwise.
- Both apps are plain HTML/CSS/JS in one file each. Keep it that way — no
  frameworks, no bundler.
- Everything the apps store lives in the visitor's browser. Never add anything
  that collects credentials, and never put a token in these files.
