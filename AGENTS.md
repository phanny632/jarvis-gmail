# Anweisungen für KI-Programme (Codex, Cursor, Claude Code und andere)

Dieses Repo enthält zwei Projekte:

- **Army Rush** (Browser-Spiel): Ordner `games/army-rush/`
- **JARVIS**: `index.html` und `datenschutz.html` im Hauptordner. Nicht anfassen, außer der Nutzer verlangt es ausdrücklich.

## Startbefehl `spiel`

Schreibt der Nutzer **`spiel`** (auch `Spiel` oder `/spiel`), dann:

1. Lies `SPIEL.md` im Hauptordner und folge dort dem Abschnitt „Ablauf beim Startbefehl `spiel`“.
2. Lies `games/army-rush/UEBERGABE.md` und den letzten Abschnitt von `games/army-rush/CHAT-VERLAUF.md`.
3. Antworte mit dem Stand und den offenen Punkten und frag nach der nächsten Aufgabe, oder setze eine schon genannte Aufgabe direkt um.

## Regeln für Arbeiten am Spiel

- Der Code liegt komplett in `games/army-rush/index.html`. Alles bleibt in dieser einen Datei, ohne Build-Schritt.
- Nach jeder Änderung den Syntax-Check aus `SPIEL.md` ausführen. Bei Balance-Änderungen die Simulation in `games/army-rush/tools/` laufen lassen.
- `games/army-rush/CHAT-VERLAUF.md` fortschreiben: Wunsch des Nutzers wörtlich, was geändert wurde, Messwerte.
- Neue oder geänderte Regler und Werte in `games/army-rush/UEBERGABE.md` nachtragen.
- Antwortstil des Nutzers (Stefan) steht in `SPIEL.md` unter „So möchte Stefan Antworten“ und gilt immer.
