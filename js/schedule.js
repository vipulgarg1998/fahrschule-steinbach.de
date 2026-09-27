const SCHEDULE_FILE = "data/schedule.csv";
const VISIBLE_VALUES = new Set(["yes", "ja", "true", "1"]);

function parseCsvLine(line, separator = ";") {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === separator && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += character;
    }
  }

  values.push(currentValue.trim());
  return values;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    !year ||
    !month ||
    !day ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

function parseSchedule(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());

  return lines.slice(1).map((line, lineIndex) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    );

    try {
      return {
        date: parseLocalDate(row.date),
        dateValue: row.date,
        module: row.module,
        title: row.title,
        published: VISIBLE_VALUES.has((row.published || "yes").toLowerCase()),
      };
    } catch (error) {
      throw new Error(`Row ${lineIndex + 2}: ${error.message}`);
    }
  })
    .filter((course) => course.published)
    .sort((first, second) => first.date - second.date);
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("de-DE", { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
  }).format(date);
}

function createScheduleRow(course, { isNext = false } = {}) {
  const row = document.createElement("div");
  row.className = `schedule-row${isNext ? " next" : ""}`;

  const time = document.createElement("time");
  time.dateTime = course.dateValue;

  const day = document.createElement("strong");
  day.textContent = String(course.date.getDate()).padStart(2, "0");

  const month = document.createElement("span");
  month.textContent = formatMonth(course.date);

  time.append(day, month);

  const description = document.createElement("div");
  const module = document.createElement("span");
  module.textContent = `Modul ${course.module}`;

  const title = document.createElement("strong");
  title.textContent = course.title;

  description.append(module, title);
  row.append(time, description);

  if (isNext) {
    const label = document.createElement("em");
    label.textContent = "Nächster Termin";
    row.append(label);
  }

  return row;
}

function createAdditionalDates(courses, today) {
  if (courses.length === 0) return null;

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.innerHTML = "Alle weiteren Termine <span>+</span>";

  const dates = document.createElement("div");
  dates.className = "more-dates";

  courses.forEach((course) => {
    const entry = document.createElement("p");
    if (course.date < today) entry.classList.add("past-date");

    const date = document.createElement("b");
    date.textContent = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "short",
    }).format(course.date);

    entry.append(date, ` · Modul ${course.module}`);
    dates.append(entry);
  });

  details.append(summary, dates);
  return details;
}

function updateHero(nextCourse) {
  const card = document.querySelector("[data-next-course]");
  const day = document.querySelector("[data-next-day]");
  const summary = document.querySelector("[data-next-summary]");

  if (!card || !day || !summary) return;

  if (!nextCourse) {
    day.textContent = "–";
    summary.textContent = "Neue Termine auf Anfrage";
    return;
  }

  day.textContent = String(nextCourse.date.getDate()).padStart(2, "0");
  summary.textContent = `${formatLongDate(nextCourse.date)} · Modul ${nextCourse.module}`;
}

function updateScheduleYear(courses) {
  const yearTarget = document.querySelector("[data-schedule-year]");
  if (!yearTarget || courses.length === 0) return;

  const years = [...new Set(courses.map((course) => course.date.getFullYear()))];
  yearTarget.textContent = years.join("/");
}

function renderSchedule(courses) {
  const schedule = document.querySelector("[data-schedule]");
  if (!schedule) return;

  schedule.replaceChildren();

  const today = startOfToday();
  const upcoming = courses.filter((course) => course.date >= today);
  const mainCourses = upcoming.slice(0, 3);
  const mainCourseSet = new Set(mainCourses);
  const additionalCourses = courses.filter(
    (course) => !mainCourseSet.has(course),
  );

  if (mainCourses.length === 0) {
    const message = document.createElement("p");
    message.className = "schedule-empty";
    message.textContent = "Neue Termine werden auf Anfrage vergeben.";
    schedule.append(message);
  } else {
    mainCourses.forEach((course, index) => {
      schedule.append(createScheduleRow(course, { isNext: index === 0 }));
    });
  }

  const additionalDates = createAdditionalDates(additionalCourses, today);
  if (additionalDates) schedule.append(additionalDates);

  updateHero(upcoming[0]);
  updateScheduleYear(courses);
}

function showScheduleError(error) {
  const schedule = document.querySelector("[data-schedule]");
  if (schedule) {
    schedule.innerHTML =
      '<p class="schedule-error">Die Termine konnten nicht geladen werden. Bitte rufen Sie uns unter 036651 / 30156 an.</p>';
  }

  updateHero(null);
  console.error("Schedule could not be loaded:", error);
}

function readScheduleFallback() {
  const fallback = document.querySelector("#schedule-fallback");
  if (!fallback) return null;

  return parseSchedule(JSON.parse(fallback.textContent));
}

async function initSchedule() {
  let fallbackCourses = null;

  try {
    fallbackCourses = readScheduleFallback();
  } catch (error) {
    console.error("Embedded schedule fallback is invalid:", error);
  }

  if (window.location.protocol === "file:" && fallbackCourses !== null) {
    renderSchedule(fallbackCourses);
    return;
  }

  try {
    const response = await fetch(SCHEDULE_FILE, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const courses = parseSchedule(await response.text());
    renderSchedule(courses);
  } catch (error) {
    if (fallbackCourses !== null) {
      renderSchedule(fallbackCourses);
      console.warn("Live schedule could not be loaded; using fallback:", error);
    } else {
      showScheduleError(error);
    }
  }
}
