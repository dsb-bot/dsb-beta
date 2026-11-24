function getApiBaseUrl() {
  const configured = window.DSB_API_BASE_URL;
  if (!configured || configured.includes("example.invalid")) {
    throw new Error("Die Cloudflare-Plan-API ist nicht konfiguriert.");
  }
  return configured.replace(/\/$/, "");
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function getBerlinDate(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const today = new Date(Date.UTC(
    Number(parts.find(part => part.type === "year").value),
    Number(parts.find(part => part.type === "month").value) - 1,
    Number(parts.find(part => part.type === "day").value) + offsetDays
  ));
  return today.toISOString().slice(0, 10);
}

async function fetchPlans(from, to) {
  if (getDatabase() !== "cloudflare") {
    const database = getDatabase();
    const url = new URL(`https://api.github.com/repos/dsb-bot/${database}/contents/plans`);
    url.searchParams.set("timestamp", Date.now().toString());
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const files = await response.json();
    if (!Array.isArray(files)) throw new Error("Unerwartete Antwort der GitHub-Datenbank.");

    return files.flatMap(file => {
      const match = /^(\d{4}-\d{2}-\d{2})\.html$/.exec(file.name || "");
      if (file.type !== "file" || !match || !isCalendarDate(match[1])
          || file.size === 0 || typeof file.download_url !== "string") return [];
      if ((from && match[1] < from) || (to && match[1] > to)) return [];
      return [{
        date: match[1],
        title: `Plan vom ${match[1]}`,
        html_url: file.download_url,
      }];
    }).sort((left, right) => left.date.localeCompare(right.date));
  }

  const url = new URL(`${getApiBaseUrl()}/api/v1/plans`);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const payload = await response.json();
  if (!payload || !Array.isArray(payload.plans)) throw new Error("Unerwartete Antwort der Plan-API.");
  return payload.plans;
}

function getPlanHtmlUrl(plan) {
  if (getDatabase() !== "cloudflare") {
    const url = new URL(plan.html_url);
    if (url.protocol !== "https:" || url.hostname !== "raw.githubusercontent.com") {
      throw new Error("Ungültige Plan-URL aus der GitHub-Datenbank.");
    }
    url.searchParams.set("timestamp", Date.now().toString());
    return url.toString();
  }
  return new URL(plan.html_url, `${getApiBaseUrl()}/`).toString();
}

function showPlanLoadError(container, error) {
  const card = document.createElement("div");
  card.className = "card";
  const heading = document.createElement("h2");
  heading.textContent = "Die Pläne konnten nicht geladen werden.";
  const message = document.createElement("p");
  message.textContent = error instanceof Error ? error.message : String(error);
  const contact = document.createElement("p");
  contact.textContent = "Wenn der Fehler bestehen bleibt, melde ihn bitte über die Kontaktseite.";
  const link = document.createElement("a");
  link.href = "/kontakt.html";
  link.textContent = "Kontakt";
  contact.append(" ", link);
  card.append(heading, message, contact);
  container.replaceChildren(card);
}
