function getApiBaseUrl() {
  const configured = window.DSB_API_BASE_URL;
  if (!configured || configured.includes("example.invalid")) {
    throw new Error("Die Plan-API ist noch nicht konfiguriert. Bitte DSB_API_BASE_URL in assets/js/apiConfig.js setzen.");
  }
  return configured.replace(/\/$/, "");
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
