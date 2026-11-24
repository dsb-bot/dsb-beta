async function loadPlan(card) {
  const popup = document.getElementById("iframe-popup");
  const iframe = document.getElementById("plan-frame");
  iframe.setAttribute("sandbox", "");
  iframe.removeAttribute("srcdoc");
  iframe.src = "about:blank";
  popup.style.display = "flex";

  const loadingDocument = document.implementation.createHTMLDocument();
  loadingDocument.body.textContent = "Plan wird geladen …";
  iframe.srcdoc = `<!doctype html>${loadingDocument.documentElement.outerHTML}`;

  try {
    const planUrl = card.dataset.url;
    if (!planUrl) throw new Error("Die Plan-URL fehlt.");

    const response = await fetch(planUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const planDocument = new DOMParser().parseFromString(await response.text(), "text/html");
    const base = planDocument.querySelector("head base") || planDocument.createElement("base");
    base.href = new URL(".", planUrl).toString();
    planDocument.head.prepend(base);
    iframe.srcdoc = `<!doctype html>${planDocument.documentElement.outerHTML}`;
  } catch (error) {
    console.error("Fehler beim Laden des Plans:", error);
    const errorDocument = document.implementation.createHTMLDocument();
    errorDocument.body.textContent = "Der Plan konnte nicht geladen werden. Bitte lade die Seite neu oder melde den Fehler.";
    iframe.srcdoc = `<!doctype html>${errorDocument.documentElement.outerHTML}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("iframe-popup");
  const iframe = document.getElementById("plan-frame");
  const closeButton = document.getElementById("close-popup");
  const closePopup = () => {
    popup.style.display = "none";
    iframe.removeAttribute("srcdoc");
    iframe.src = "about:blank";
  };
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && popup.style.display === "flex") closePopup();
  });
  popup.addEventListener("click", event => {
    if (event.target === popup) closePopup();
  });
  closeButton.addEventListener("click", closePopup);
});
