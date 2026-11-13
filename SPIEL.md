# SPIEL – Hell Escape („Ein Game für Fiete“)

**Startbefehl: `spiel`**
Schreibt der Nutzer `spiel`, liest das Programm diese Datei und macht direkt am Spiel weiter.

---

## Das Wichtigste in 30 Sekunden

| | |
|---|---|
| **Was** | 3D-Kletter-Runner im Browser, Nachbau von „Hell Escape: Firebound“ (Rollic). Held wirft automatisch seine Waffe, sammelt Treppenstücke, schmiedet Waffen, wählt Götter und Begleiter, besiegt Horden und Etagen-Bosse und erklimmt am Levelende die Treppe. Ersetzt seit 13.11.2026 Army Rush (archiviert). |
| **Spielen** | https://phanny632.github.io/jarvis-gmail/games/army-rush/ (gleiche Adresse und Home-Bildschirm-App wie vorher) |
| **Code** | `games/army-rush/index.html`: eine Datei, kein Build, Three.js r128 lokal unter vendor/ |
| **Nutzer** | Stefan. Das Spiel ist für Fiete. |
| **Stand** | Hell Escape 2026.11.13.1: 8 Schmiede-Waffen, 6 Gegnerarten, 4 Bosse, 5 Gebiete, 5 Götter, 3 Begleiter, 9 Lauf-Fähigkeiten, Treppenfinale, Grafiksparmodus, Spielstand-Export |

## Wo finde ich was

| Ich will … | Datei |
|---|---|
| den Code ändern | `games/army-rush/index.html` |
| verstehen, wie der Code aufgebaut ist und welche Regler es gibt | `games/army-rush/UEBERGABE.md` |
| wissen, was bisher gewünscht und entschieden wurde | `games/army-rush/CHAT-VERLAUF.md` |
| Schwierigkeit oder Bosse testen | `games/army-rush/tools/` (Bot-Simulation, siehe unten) |
| alles in **einer** Datei für einen Chat ohne Repo-Zugriff | `games/army-rush/SPIEL-KOMPLETT.md` |
| Screenshots sehen | `games/army-rush/screenshots/` |
| das alte Army Rush ansehen | `games/army-rush/archiv/` |

## Ablauf beim Startbefehl `spiel`

1. Diese Datei lesen, dann `games/army-rush/UEBERGABE.md` (Code-Karte und Regler).
2. Den letzten Abschnitt von `games/army-rush/CHAT-VERLAUF.md` lesen: Was wurde zuletzt geändert, was ist offen?
3. Stefan in höchstens 5 Zeilen antworten: aktueller Stand, offene Punkte, Frage nach der nächsten Aufgabe. Ist schon eine Aufgabe genannt, direkt loslegen.
4. Nach jeder Änderung:
   - Die Datei muss weiterhin fehlerfrei laufen (Syntax-Check siehe unten).
   - Bei Balance-Änderungen die Simulation laufen lassen.
   - `CHAT-VERLAUF.md` um einen Abschnitt ergänzen: Wunsch von Stefan wörtlich, was geändert wurde.
   - Werte in `UEBERGABE.md` aktuell halten.

## So möchte Stefan Antworten

- Jede Antwort beginnt mit „Stefan“, auf Deutsch.
- Sachlich, knapp, kein Ja-Sager. Widerspruch mit kurzer Begründung.
- Keine Vermutungen als Fakten. Nicht Belegbares als „nicht verifiziert“ kennzeichnen.
- Aufgaben als nummerierte Schritte, nur Schritte, die Stefan selbst ausführen muss.
- Immer den vollen Pfad geänderter Dateien nennen.
- Skripte zeigen ihren Fortschritt („Schritt 2/5: …“), Fehler mit Ursache und Lösungshinweis, am Ende Ergebnis und Pfad.
- Am Ende jeder Code-Aufgabe ein kurzer Prüfauftrag für ChatGPT/Codex: Dateien und Prüfpunkte, direkt einfügbar.

## Prüfen und Testen

```bash
# Syntax-Check des Spiels (ohne Browser)
node -e "const s=require('fs').readFileSync('games/army-rush/index.html','utf8'); new Function(s.match(/<script>([\s\S]*)<\/script>/)[1]); console.log('Syntax OK')"

# Bot-Simulation (einmalig einrichten)
cd games/army-rush/tools && npm init -y && npm i playwright && npx playwright install chromium
node sim.js 30       # Balance-Bot: Versuche pro Level, Boss-Rest-HP
node probe.js 3      # wo der Held in einem Level Herzen verliert
node look.js 1 5 22  # Screenshots nach tools/out/
node bundle.js       # SPIEL-KOMPLETT.md neu erzeugen
```

Lokal spielen: `games/army-rush/index.html` im Browser öffnen. Nach dem ersten vollständigen Laden kann die Home-Bildschirm-Web-App über ihren Serviceworker offline starten. Die lokale HTML-Datei benötigt den mitgelieferten vendor-Ordner.

## Veröffentlichen

- GitHub Pages veröffentlicht automatisch aus `main`, Ordner `/`.
- Änderung live bringen: auf einem Branch committen, einen Pull Request nach `main` erstellen und mergen. Nach 1–2 Minuten ist sie unter dem Spiel-Link sichtbar.
- Der Rest des Repos (`index.html`, `datenschutz.html` im Hauptordner) gehört zum Projekt JARVIS und ist nicht Teil des Spiels.

## Offene Punkte

1. Leistung und Safari-Bedienung auf echter iPhone-Hardware sind nicht verifiziert. Grafiksparmodus ist vorhanden.
2. Rückmeldung von Stefan und Fiete zum neuen Spiel abwarten (Schwierigkeit, Bedienung, was im Vergleich zum Original fehlt).
3. Prüfaufträge am Ende von `games/army-rush/CHAT-VERLAUF.md`.
4. Optional: das Spiel in ein eigenes Repo auslagern.
