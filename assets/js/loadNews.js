// --- News Popup aus JSON laden ---
fetch('assets/json/news.json')
  .then(response => response.json())
  .then(data => {
    const cookieName = "popupSeen_" + data.lastUpdated;

    // Wenn Cookie existiert, abbrechen
    if (getCookie(cookieName)) return;

    // Nur anzeigen, wenn aktiv
    if (data.active) {
      showMessagePopup(data.title, data.message, "Stand: " + data.lastUpdated);

      // "Nicht mehr anzeigen" Funktion
      window.forgetMessagePopup = function () {
        setCookie(cookieName, "true", 30);
        closeMessagePopup();
      };
    }
  })
  .catch(err => console.error("News konnte nicht geladen werden:", err));

// --- Funktionen zum Öffnen/Schließen ---
function showMessagePopup(title, message, date = "") {
  const popup = document.getElementById("message-popup");
  if (!popup) return;

  document.getElementById("popup-title").textContent = title;
  document.getElementById("popup-message").innerHTML = message; // HTML erlaubt
  document.getElementById("popup-date").textContent = date;

  popup.style.display = "flex"; // Overlay wird sichtbar
  document.body.classList.add("popup-open");
}

function closeMessagePopup() {
  const popup = document.getElementById("message-popup");
  if (popup) popup.style.display = "none";
  document.body.classList.remove("popup-open");
}

// --- Cookie-Funktionen ---
function setCookie(name, value, days) {
  const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name) {
  const entry = document.cookie.split(";").map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${encodeURIComponent(name)}=`));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(encodeURIComponent(name).length + 1));
  } catch {
    return null;
  }
}