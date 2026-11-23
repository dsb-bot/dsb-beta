async function loadHistoricalPlans() {
  const container = document.getElementById("list-container");
  const loading = document.createElement("div");
  loading.className = "card";
  loading.innerHTML = "<h2>Historische Pläne werden geladen …</h2>";
  container.replaceChildren(loading);

  try {
    const today = getBerlinDate();
    const plans = (await fetchPlans(undefined, today))
      .filter(plan => plan.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!plans.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.textContent = "Es sind noch keine historischen Pläne vorhanden.";
      container.replaceChildren(empty);
      return;
    }

    const grouped = new Map();
    for (const plan of plans) {
      const date = new Date(`${plan.date}T00:00:00Z`);
      const week = getIsoWeek(date);
      const key = `${week.year}-${String(week.week).padStart(2, "0")}`;
      if (!grouped.has(key)) grouped.set(key, { ...week, plans: [] });
      grouped.get(key).plans.push(plan);
    }

    container.replaceChildren();
    let cardIndex = 0;
    for (const week of grouped.values()) {
      const section = document.createElement("div");
      section.className = "week-section";
      const heading = document.createElement("h2");
      heading.textContent = `${week.year} Kalenderwoche ${week.week}`;
      const list = document.createElement("div");
      list.className = "list";
      section.append(heading, list);

      for (const plan of week.plans) {
        const date = new Date(`${plan.date}T00:00:00Z`);
        const card = document.createElement("div");
        card.className = "card hidden";
        card.dataset.url = getPlanHtmlUrl(plan);
        card.style.cursor = "pointer";
        const title = document.createElement("h2");
        title.textContent = new Intl.DateTimeFormat("de-DE", {
          weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"
        }).format(date);
        const file = document.createElement("p");
        file.textContent = `Plan vom ${plan.date}`;
        card.append(title, file);
        card.addEventListener("click", () => loadPlan(card));
        list.appendChild(card);
        setTimeout(() => {
          card.classList.remove("hidden");
          card.classList.add("fade-in");
        }, cardIndex * 40);
        cardIndex++;
      }
      container.appendChild(section);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Historie:", error);
    showPlanLoadError(container, error);
  }
}

function getIsoWeek(input) {
  const date = new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const year = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  return { year, week: Math.ceil(((date - yearStart) / 86400000 + 1) / 7) };
}

async function reloadPlans() {
  return loadHistoricalPlans();
}

document.addEventListener("DOMContentLoaded", loadHistoricalPlans);
