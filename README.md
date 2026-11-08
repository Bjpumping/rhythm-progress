# Rhythm Progress

An early browser-based practice tracker for drummers, created as Brown Ubom's personal project with AI assistance. A first implementation is now available; it is not a production release.

## Current features

- Create and delete practice routines with a target tempo and duration.
- Use a routine to prefill a session.
- Log dated practice sessions with achieved BPM and notes.
- Set a weekly minutes goal and view Monday–Sunday totals.
- View session history and delete entries.
- Export journal data as JSON.

## Run locally

No dependencies or build step are required. With Python 3 installed, run from the repository directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 in a modern browser. Keep using the same browser and address to access your saved journal.

## Checks

With Node.js installed:

```sh
node --check app.js
node --test app.test.js
```

Tests cover calendar-week boundaries and numeric validation. They do not replace browser testing.

Manual checks: add a routine, use it to log a session, confirm totals, reload and confirm persistence, change the goal, export JSON, cancel a deletion, then confirm a deletion. Check narrow-screen layout and keyboard navigation.

## Storage and limitations

Data stays in localStorage on this browser and origin. There is no backend, sign-in, cloud sync or automatic backup. Clearing browser data can remove the journal. JSON export is available; an import interface is not yet implemented. Progress currently means weekly practice time and session history, not automatic assessment of playing quality. No metronome is included yet.

## Next work

- Browser testing and accessibility review.
- Edit sessions and import validated backups.
- Tempo trends by exercise.
- Evaluate an accurately timed metronome.

## Licence

No open-source licence has been added. Public visibility alone does not grant an open-source licence.
