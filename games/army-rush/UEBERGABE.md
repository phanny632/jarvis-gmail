# Übergabe: Army Rush – „Ein Game für Fiete“

Stand: 23.10.2026 · Branch `claude/running-upgrade-game-s4xpgo` · Repo `phanny632/jarvis-gmail`

**Einstieg ist `SPIEL.md` im Hauptordner. Startbefehl: `spiel`.**
Diese Datei ist die ausführliche Code-Karte. Den Verlauf findest du in `CHAT-VERLAUF.md`, alles in einer Datei in `SPIEL-KOMPLETT.md`.

---

## 1. Was das Spiel ist

3D-Runner-Shooter im Browser nach dem Vorbild von „Real War: Not Fake“ (Heseri Games), Count Masters, Gun Rush und dem Werbespiel von Last War.
Man lenkt eine Armee nur nach links und rechts. Man baut nichts, man levelt und upgradet nur.

- Tore `+N / −N / ×N / ÷N`. Plus-Tore kann man hochschießen, mit abnehmendem Ertrag bis zu einem sichtbaren **MAX**.
- Fässer enthalten eine Waffe, Soldaten oder Münzen. Stehen zwei nebeneinander, bekommt man nur eins.
- 14 Waffen, 5 Gegnertypen in großen Schwärmen, Kreissägen, 5 verschiedene Bosse.
- Dauerhafte Upgrades und Comeback-Bonus nach Niederlagen. Der Spielstand liegt im `localStorage` des Geräts.
- Beim Öffnen: Startbildschirm „ARMY RUSH – Ein Game für Fiete“.

## 2. Links

| Was | Link | Stand |
|---|---|---|
| Spiel (GitHub Pages, aus `main`) | https://phanny632.github.io/jarvis-gmail/games/army-rush/ | aktuell |
| Code | Branch `main`, Ordner `games/army-rush/` | aktuell |
| Alles als ZIP | https://github.com/phanny632/jarvis-gmail/archive/refs/heads/main.zip | |
| Alte Testkopie (Claude-Artifact, privat) | https://claude.ai/artifact/QGJyrQJwcSiVnsDEcB9yUd | wird nicht mehr gepflegt |

## 3. Ordner und Dateien

```
SPIEL.md                  Einstieg für Mensch und KI (Startbefehl „spiel“)
AGENTS.md                 Anweisungen für Codex, Cursor und andere KI-Programme
CLAUDE.md                 Anweisungen für Claude Code
.claude/commands/spiel.md Befehl /spiel in Claude Code
.github/copilot-instructions.md  Hinweis für GitHub Copilot
games/army-rush/
├── SPIEL-KOMPLETT.md     Alles in einer Datei für Chats ohne Repo-Zugriff (erzeugt von tools/bundle.js)
├── index.html            Das komplette Spiel (eine Datei, ca. 1.420 Zeilen, Three.js r128 von cdnjs)
├── UEBERGABE.md          Diese Datei
├── CHAT-VERLAUF.md       Kompletter Gesprächsverlauf mit allen Entscheidungen
├── screenshots/          Kontrollbilder (Welten, Bosse, Waffen, Startbildschirm)
└── tools/                Test- und Balance-Skripte (Node + Playwright, Bot spielt das Spiel)
    ├── balance.js        Fortschritt Level 1–40: Bot spielt, kauft Upgrades, zählt Versuche
    ├── bal_short.js      wie balance.js, kürzer, meldet zu lange Kämpfe
    ├── bosssim.js        Boss-Test: Level 1–25, je 3 Läufe, Siegquote je Boss-Typ
    ├── bossprobe.js      Verlauf eines Bosskampfs Sekunde für Sekunde
    ├── wfactor.js        misst den echten Boss-Schaden je Waffe (Basis für BOSS_WF)
    ├── gates.js          misst Torwerte vor und nach Beschuss
    ├── look.js           Screenshots von Welten und Bossen
    ├── wshots.js         Screenshots aller Waffen gegen einen Schwarm
    ├── perf.js           Rechenzeit der Spiellogik je Waffe
    ├── splash.js         Screenshot vom Startbildschirm
    └── bundle.js         erzeugt SPIEL-KOMPLETT.md neu (nach jeder Änderung ausführen)
```

Der Rest des Repos (`index.html`, `datenschutz.html`) gehört zum JARVIS-Projekt und wurde nicht verändert.

## 4. Technik

- **Eine HTML-Datei** ohne Build-Schritt. Externe Teile: Three.js r128 (`cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`) und Google Fonts (Lilita One, Nunito).
- Die Datei beginnt ohne `<!doctype html>`, weil die Artifact-Plattform das Gerüst selbst ergänzt. Im Browser und auf GitHub Pages läuft sie trotzdem.
- **Grafik:** ACES-Tonemapping, weiche Schatten (1024er Shadow-Map), Himmel als Shader, Wasser mit bewegter Normal-Map, Soldaten als InstancedMesh (Armee bis 180 sichtbar, Gegner bis 1.600).
- Die Umgebungs-Map (PMREM) wurde bewusst entfernt, weil sie im Test alles schwarz gerendert hat. Deshalb ist `metalness` auf höchstens 0,3 begrenzt.
- **Spielstand:** `localStorage` Schlüssel `armyRush.v1` mit `{level, coins, best, fails, up:{start,rate,dmg,range,income}}`.

### Wichtige Stellen in `index.html`

| Bereich | Name im Code |
|---|---|
| Upgrades | `stat`, `UPG`, `cost`, `pity()` (Comeback-Bonus) |
| Waffen | `WEAPONS` (rate, dmg, range, spd, Kugel-Aussehen, Eigenschaften), `wDps()`, `makeGun()`, `GUNGEO` |
| Welten | `THEMES` (6 Stück), `MODS` (Level-Modifikatoren) |
| Gegner | `KINDS`, `layout(e)` (Schwarm-Formation), `FOE_MAX = 1600`, `GROUP_VIS = 260` |
| Level-Aufbau | `genLevel(l)` (S = Gegnerstärke, Gs = Tor-/Belohnungswachstum, E, HARD = 2.1) |
| Bosse | `BOSS_TYPES`, `bossTypeFor()`, `buildBoss()`, `updateBoss()`, `calibrateBoss()`, `BOSS_T`, `BOSS_P`, `BOSS_WF`, `bh()` |
| Tore | `gateTexture()`, Zweig `'gate'` in `damage()`, `GATE_K = 0.5`, `g.maxV` |
| Schießen | Abschnitt „Schießen: jeder sichtbare Schütze …“ in `update()`, `flame()`, `splashAt()`, `bolt()` |
| Test-Schnittstelle | `window.__armyRush` mit `sim(bot)`, `jump(z)`, `setWeapon(id)`, `steer(x)`, `L()`, `B()`, `tune`, `WEAPONS`, `stat` |

### Balance-Regler (die wichtigsten)

| Regler | Wert | Wirkung |
|---|---|---|
| `HARD` | 2.1 | Gegnermenge und Basis-HP der Bosse |
| `S`, `Gs` in `genLevel` | `1.19^(l-1)` (ab Level 26: `1.13`), `Gs = S^0.66` | Gegner wachsen schneller als Tore und Belohnungen |
| `BOSS_T` | brute 0.8, tank 1.05, heli 0.82, mech 0.95, necro 0.8 | Kampfdauer je Boss |
| `BOSS_P` | brute 0.02, tank 0.042, heli 0.02, mech 0.05, necro 0.035 | Anteil der Armee pro Boss-Treffer |
| `BOSS_WF` | gemessen mit `tools/wfactor.js` | echter Boss-Schaden je Waffe |
| `GATE_K`, `g.maxV` | 0.5 · √Schüsse, Grenze `v + max(12, 1.3·|v|)` | wie schnell Tore wachsen |
| `pity()` | +20 % Soldaten, +5 % Schaden je Niederlage, max. 10 | verhindert Endlos-Wände |

Bosse kalibrieren sich beim Kampfbeginn auf die aktuelle Armee und Waffe:
- HP = Armee × Rate × Schaden × `BOSS_WF` × 0,6 × Zielzeit
- Schaden = Anteil `BOSS_P` der Armee

Nach 40 Sekunden werden Bosse wütend und senden alle 3 Sekunden eine Schockwelle.

### Letzte Messwerte (Bot ohne menschliche Fehler)
- Fortschritt Level 1–30: 96 Versuche, höchstens 10 pro Level.
- Bosse ohne Upgrades: Siegquote Koloss 56 %, Panzer 46 %, Heli 80 %, Roboter 50 %, Nekromant 25 %.
- Spiellogik unter 0,2 ms pro Bild. Die Leistung auf echten Handys ist nicht gemessen.

## 5. Tests selbst ausführen

```bash
cd games/army-rush/tools
npm init -y && npm i playwright && npx playwright install chromium
node bosssim.js        # Boss-Siegquoten
node balance.js        # Fortschritt Level 1–40
node gates.js          # Torwerte
node look.js 1 2 3     # Screenshots nach tools/out/
```

Alle Skripte zeigen ihren Fortschritt als „Schritt x/y“. Liegt eine `three.min.js` im Ordner `tools`, wird sie statt des CDN benutzt. Das ist nur nötig, wenn cdnjs gesperrt ist.

## 6. Offene Punkte und Ideen

1. Leistung auf dem iPhone prüfen. Bei Ruckeln: Schalter „Grafik hoch/niedrig“ (Schatten aus, weniger sichtbare Gegner).
2. Optional: das Spiel in ein eigenes Repo auslagern, getrennt von JARVIS.
3. Prüfaufträge für Codex aus dem Chat abarbeiten (siehe `CHAT-VERLAUF.md`).

## 7. Weitermachen

- **Claude Code, Codex, Cursor oder Copilot im Repo:** `spiel` eingeben (in Claude Code auch `/spiel`). Die Anweisungsdateien sorgen dafür, dass das Programm alles einliest.
- **Normaler Chat (ChatGPT, Claude) ohne Repo:** `games/army-rush/SPIEL-KOMPLETT.md` anhängen und `spiel` schreiben.
- Nach Änderungen `node games/army-rush/tools/bundle.js` ausführen, damit `SPIEL-KOMPLETT.md` aktuell bleibt.
