function loadPlan(card) {
  const popup = document.getElementById("iframe-popup");
  const iframe = document.getElementById("plan-frame");
  iframe.setAttribute("sandbox", "");
  iframe.src = card.dataset.url;
  popup.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("iframe-popup");
  const iframe = document.getElementById("plan-frame");
  const closeButton = document.getElementById("close-popup");
  const closePopup = () => {
    popup.style.display = "none";
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
