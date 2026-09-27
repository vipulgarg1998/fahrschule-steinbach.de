# Fahrschule Steinbach website

This is intentionally a simple static website. It needs no CMS, database, paid
software, or npm dependencies. The published entry point is `index.html`. Its
editable source is split into clearly named files under `src/components`.

## Maintaining dates in Excel

Changing dates on the hosted website requires no HTML editing or site rebuild.

1. Open `data/schedule.csv` in Excel.
2. Edit an existing row or add one row per course.
3. Save it as **CSV UTF-8**, keeping the semicolon as the separator.
4. Upload only the changed `data/schedule.csv` file to the web server.

The website sorts the dates automatically, highlights the next course, and also
shows that course in the hero section.

| Column | Meaning | Example |
| --- | --- | --- |
| `date` | Date in year-month-day format | `2026-10-24` |
| `module` | Module number | `5` |
| `title` | Course title displayed on the website | `Safety for cargo and passengers` |
| `published` | Use `yes` to show or `no` to hide the row | `yes` |

CSV is deliberately used instead of XLSX: Excel edits it directly, while the
browser can read it without an additional library.

## Editing other page content

The homepage is split into small, clearly named files:

| Page section | File |
| --- | --- |
| Header and navigation | `src/components/header.html` |
| Hero image and introduction | `src/components/hero.html` |
| Quick information | `src/components/quick-info.html` |
| About section and gallery | `src/components/about.html` |
| Driving licence categories | `src/components/license-classes.html` |
| News | `src/components/news.html` |
| Learning products | `src/components/learning.html` |
| Schedule section | `src/components/schedule.html` |
| Team | `src/components/team.html` |
| Additional services | `src/components/services.html` |
| Extras and financing | `src/components/extras.html` |
| Contact section | `src/components/contact.html` |
| Footer | `src/components/footer.html` |

After editing one of these component files, rebuild the homepage:

- Windows: double-click `build-site.bat`
- macOS/Linux: run `./build-site.sh` in the project directory

The build script combines the components into `index.html`. Do not edit the
generated `index.html` directly.

## Replacing images

The original images are stored under `assets/media`. The easiest way to replace
an image is to use a new file with the same filename; no HTML change is then
required. The large vehicle image is
`assets/hero-steinbach-fleet-car.webp`.

## Project structure

- `css/`: Stylesheets grouped by topic; `styles.css` only imports them.
- `js/`: Small scripts for navigation, category filtering, and dates.
- `data/`: Content that is updated regularly.
- `src/components/`: Editable homepage content.
- `tools/build.py`: Combines the HTML components and embeds a schedule fallback.

The project uses only browser standards and Python for the build. There are no
npm packages that need regular maintenance.

## Local preview

Use the local preview server when editing dates. This makes the workflow match
the hosted website: save `schedule.csv`, refresh the browser, and see the new
dates immediately.

- Windows: double-click `preview-site.bat`; it starts the server and opens the
  website automatically.
- macOS/Linux: run `./preview-site.sh`, then open
  `http://localhost:4173`.
- Docker alternative: run `docker compose up`.

Do not open `index.html` by double-clicking when testing CSV changes. Browsers
do not allow a directly opened HTML file to read another local file. Direct-file
mode therefore shows the schedule snapshot stored during the last build. Run
`build-site.bat` or `./build-site.sh` to refresh that snapshot.

Check that `index.html` matches the source before uploading:

```sh
python3 tools/build.py --check
```

For a full deployment, upload the whole project or all changed files to the web
server. `impressum.html` and `datenschutz.html` remain standalone pages.
