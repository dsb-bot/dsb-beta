const COOKIE_DATABASE = "dsb_database";
const COOKIE_FUTURE_PLANS = "futurePlans";
const COOKIE_PREFERENCE_MAX_AGE = 365 * 24 * 60 * 60;
const DATABASES = ["cloudflare", "dsb-database", "dsb-beta-database"];
const DATABASE_LABELS = {
  cloudflare: "Cloudflare (Standard)",
  "dsb-database": "GitHub: dsb-database",
  "dsb-beta-database": "GitHub: dsb-beta-database",
};

function cookieOptions(maxAge) {
  return `Max-Age=${maxAge}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

function getCookie(name) {
  const entry = document.cookie.split(";").map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return null;
  }
}

function setPreferenceCookie(name, value, maxAge) {
  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions(maxAge)}`;
}

function expireCookie(name) {
  document.cookie = `${name}=; ${cookieOptions(0)}`;
}

function setDatabase(dbName) {
  if (!DATABASES.includes(dbName)) {
    throw new Error("Unbekannte Plan-Datenquelle.");
  }
  setPreferenceCookie(COOKIE_DATABASE, dbName, COOKIE_PREFERENCE_MAX_AGE);
  updateCurrentDatabaseDisplay();
  return true;
}

function getDatabase() {
  const saved = getCookie(COOKIE_DATABASE);
  if (!saved) return "cloudflare";
  if (DATABASES.includes(saved)) {
    setPreferenceCookie(COOKIE_DATABASE, saved, COOKIE_PREFERENCE_MAX_AGE);
    return saved;
  }

  // Legacy database names cannot be mapped safely; Cloudflare is the new default.
  setPreferenceCookie(COOKIE_DATABASE, "cloudflare", COOKIE_PREFERENCE_MAX_AGE);
  return "cloudflare";
}

function updateCurrentDatabaseDisplay() {
  const db = getDatabase();
  const element = document.getElementById("current-db");
  if (element) {
    element.textContent = DATABASE_LABELS[db];
  }
  const selector = document.getElementById("database-choice");
  if (selector) selector.value = db;
}

function toggleFuturePlans(value) {
  if (value !== "true" && value !== "false") {
    throw new Error("Ungültige Einstellung für zukünftige Pläne.");
  }
  setPreferenceCookie(COOKIE_FUTURE_PLANS, value, COOKIE_PREFERENCE_MAX_AGE);
  updateFuturePlansDisplay();
}

function getFuturePlans() {
  const saved = getCookie(COOKIE_FUTURE_PLANS);
  if (saved === "true" || saved === "false") {
    setPreferenceCookie(COOKIE_FUTURE_PLANS, saved, COOKIE_PREFERENCE_MAX_AGE);
    return saved;
  }
  if (saved !== null) expireCookie(COOKIE_FUTURE_PLANS);
  return "true";
}

function updateFuturePlansDisplay() {
  const element = document.getElementById("current-futurePlans");
  if (!element) return;

  const value = getFuturePlans();
  if (value === "true") element.textContent = "Ein (Zukünftige Pläne sichtbar)";
  else element.textContent = "Aus (Nur Pläne bis morgen)";
}

// Starten beim Laden
document.addEventListener("DOMContentLoaded", () => {
  updateCurrentDatabaseDisplay();
  updateFuturePlansDisplay();
});

// Setzt alle Einstellungen auf die Standardwerte zurück
function resetPreferences() {
  setDatabase("cloudflare");
  toggleFuturePlans("true");
}

// Setzt alle Themes auf die Standardwerte zurück
function resetTheme() {
  localStorage.removeItem("theme");
  window.location.reload();
}

function deleteCookies() {
  const names = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]);
  for (const name of names) {
    if (name === COOKIE_DATABASE || name === COOKIE_FUTURE_PLANS || name.startsWith("popupSeen_")) {
      expireCookie(name);
    }
  }
  updateCurrentDatabaseDisplay();
  updateFuturePlansDisplay();
}

function handleDatabaseSourceChange() {
  const selector = document.getElementById("database-choice");
  if (!selector) return;
  const status = document.getElementById("database-source-status");
  setDatabase(selector.value);
  if (status) status.textContent = `${DATABASE_LABELS[selector.value]} ist gespeichert.`;
}