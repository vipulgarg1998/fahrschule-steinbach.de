# Editing the schedule

`schedule.csv` can be opened and saved directly with Excel.

- One row represents one course.
- Store dates as `YYYY-MM-DD`, for example `2026-10-24`.
- `published=yes` displays the course.
- `published=no` prepares or temporarily hides a course.
- When saving, keep **CSV UTF-8** and the semicolon separator.

After the CSV file is uploaded, the hosted website automatically updates the
schedule section and the next-course information in the hero. A site rebuild is
not required.

For local editing, start `preview-site.bat` on Windows or
`./preview-site.sh` on macOS/Linux. Save this CSV and refresh
`http://localhost:4173`; the new dates appear immediately.

Do not open `index.html` by double-clicking when testing CSV changes. Browser
security prevents a directly opened HTML file from reading another local file.
Direct-file mode therefore uses the schedule snapshot from the last build. Run
`build-site.bat` or `./build-site.sh` once to update that snapshot.
