async function loadCurrentPlans() {
  const container = document.getElementById("currentPlans-container");
  const list = document.createElement("div");
  list.className = "list";
  const loading = document.createElement("div");
  loading.className = "card";
  loading.innerHTML = "<h2>Pläne werden geladen …</h2>";
  list.appendChild(loading);
  container.replaceChildren(list);

  try {
    const today = getBerlinDate();
    const futurePlansEnabled = typeof getFuturePlans !== "function" || getFuturePlans() === "true";
    let endDate;
    if (!futurePlansEnabled) {
      const tomorrow = new Date(`${today}T00:00:00Z`);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      endDate = tomorrow.toISOString().slice(0, 10);
    }
    const plans = (await fetchPlans(today, endDate)).sort((a, b) => a.date.localeCompare(b.date));
    if (!plans.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = '<h2>Keine Pläne vorhanden</h2><p>Für den ausgewählten Zeitraum wurden keine Pläne gefunden.</p>';
      list.replaceChildren(empty);
      return;
    }

    list.replaceChildren();
    for (const plan of plans) {
      const date = new Date(`${plan.date}T00:00:00Z`);
      const formattedDate = new Intl.DateTimeFormat("de-DE", {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"
      }).format(date);
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.url = getPlanHtmlUrl(plan);
      card.style.cursor = "pointer";
      const heading = document.createElement("h2");
      heading.textContent = formattedDate;
      card.appendChild(heading);
      if (plan.updated_at) {
        const updated = document.createElement("p");
        updated.textContent = `Zuletzt aktualisiert: ${new Intl.DateTimeFormat("de-DE", {
          dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin"
        }).format(new Date(plan.updated_at))}`;
        card.appendChild(updated);
      }
      card.addEventListener("click", () => loadPlan(card));
      list.appendChild(card);
    }
  } catch (error) {
    console.error("Fehler beim Laden aktueller Pläne:", error);
    showPlanLoadError(container, error);
  }
}

async function reloadPlans() {
  return loadCurrentPlans();
}

document.addEventListener("DOMContentLoaded", loadCurrentPlans);
