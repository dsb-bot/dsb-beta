# DSB-Bot

DSB-Bot ist eine Website, die Vertretungspläne für die Main-Taunus-Schule **zuverlässig** lädt und anzeigt. Die Seite bietet verschiedene Themes, eine Historie der Pläne und weitere nützliche Funktionen. Sie ist für Schüler und Lehrer gedacht, die eine zuverlässige und benutzerfreundliche Alternative zur DSB-Mobile-App suchen.

Besuche die Seite: [https://dsb-bot.github.io](https://dsb-bot.github.io)

---

## Inhaltsverzeichnis
1. [Features](#features)
2. [Installation](#installation)
3. [Verwendung](#verwendung)
4. [Themes](#themes)
5. [Ressourcen](#ressourcen)
6. [To-Do](#to-do)
7. [Kontakt](#kontakt)

---

## Features
- **Vertretungspläne anzeigen:** Alle Vertretungspläne immer sichtbar!
- **Plan-Historie:** Zugriff auf ältere Vertretungspläne.
- **Themes:** Mehrere auswählbare Themes, die im Browser gespeichert werden.
- **Responsive Design:** Optimiert für Desktop- und Mobilgeräte.
- **Zitat des Tages:** Anzeige eines täglichen Zitats über eine externe API.

---

## Installation
1. **Projekt klonen:**
   ```bash
   git clone https://github.com/dsb-bot/dsb-bot.github.io.git
   ```
2. **Projekt öffnen:**
   Navigiere in das Projektverzeichnis:
   ```bash
   cd DSB-Bot
   ```
3. **Lokalen Server starten (optional):**
   Verwende einen lokalen Server, um die Anwendung zu testen:
   ```bash
   npx http-server
   ```
   Oder öffne die index.html direkt im Browser.

---

## Verwendung
1. Öffne die index.html im Browser oder besuche [dsb-bot.github.io](https://dsb-bot.github.io).
2. Navigiere durch die Navbar:
   - **Vertretungspläne:** Zeigt die aktuellen Pläne an.
   - **Historie:** Zugriff auf ältere Pläne.
   - **Kontakt:** Möglichkeit, Feedback zu senden.
3. Wähle ein Theme über das Dropdown-Menü in der Navbar.

---

## Themes
Die Website hat  mehrere Themes, die über das Dropdown-Menü in der Navbar ausgewählt werden können. Die Auswahl wird im Browser gespeichert und bleibt auch nach einem Seitenwechsel erhalten.

---

## Ressourcen
- **Externe APIs:** Zitat des Tages.

---

## To-Do
- **Needed Patches:**
  - [x] Reihenfolge der Historie fixen...
  - [x] Neuster Plan nach morgen wird nicht geupdatet
- **Upcomming Features:**
  - [x] Lehrer Pläne für Alle Schüler
  - [ ] Benutzerdefinierte Themes.
  - [ ] Passwortschutz für alle Vertretungspläne.

---

## Kontakt
Hast du Vorschläge oder Feedback? Kontaktiere mich gerne:
- **E-Mail:** [contact.dsbbot@gmail.com](mailto:contact.dsbbot@gmail.com)
- **Discord:** derjokko

---

Viel Spaß mit DSB-Bot! 😊
# Frontend API setup

The GitHub Pages frontend uses the Cloudflare read API by default. In Einstellungen, users can switch to either of
the public GitHub plan repositories, `dsb-database` or `dsb-beta-database`. The selected source is stored in a
one-year preference cookie. Existing recognized `dsb_database` values are preserved; unknown legacy values fall back
to Cloudflare. Users do not need to clear their cookies manually.

The source selection does not grant write access. Never put API credentials in the frontend. Current and historical
plans continue to use the same read-only API contract, and plan HTML remains sandboxed in the viewer.
