# Lilly's Command Center

Lilly's school hub: Game Plan, Calendar, Long-Range, Writing Studio, Grades, Study Lab, Builder Lab and Parent View.

- `index.html` is the app. `data.js` holds the week plans, calendar and writing data, and is refreshed at the Sunday reset.
- **Sync between phone and computer:** a one-time Google Apps Script setup using `sync-Code.gs` (steps are at the bottom of that file). The save file lives in a parent's Google Drive. The family key is never stored in this repo.
- **Privacy:** first name only, no locations, no essay text. The page is hidden from search engines (`noindex` and `robots.txt`). Full scorecards with quoted writing stay private outside this repo.
