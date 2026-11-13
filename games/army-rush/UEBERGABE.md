# Übergabe: Hell Escape („Ein Game für Fiete“)

Stand 13.11.2026 · Version `2026.11.13.2` · Einstieg `SPIEL.md` im Hauptordner · Startbefehl **`spiel`**

Hell Escape hat Army Rush (Edition 03) **komplett ersetzt**. Die Adresse und die Home-Bildschirm-App sind gleich geblieben.
Das alte Spiel liegt unter `archiv/edition03-army-rush.html` und ist im Menü unter **Optionen** verlinkt.

## 1. Vorbild

Nachbau von **„Hell Escape: Firebound“** (Rollic Games, iOS App Store, ID 6754279265).
Grundlage waren die App-Store-Beschreibung, alle 8 App-Store-Screenshots, ein 4-Sekunden-Video und ein 36-Sekunden-Spielvideo von Stefan.
Code, Grafik und Namen sind eigene Arbeit; es wurden keine Inhalte aus der App übernommen.

| Im Vorbild | Im Nachbau |
|---|---|
| Held wirft die ausgerüstete Waffe, Karte „EQUIPPED“ mit Stärke | Automatisches Werfen mit Zielhilfe; Karte „AUSGERÜSTET“ oben rechts |
| „Craft“-Tore mit Fortschrittsbalken | Schmiede-Tore: hineinwerfen füllt den Balken; volle Schmiede beim Durchlaufen gibt die neue Waffe |
| Treppenstücke sammeln | Steinbrunnen und Kristalle geben Treppenstücke; Treppentore (+N, durch Treffer steigend); Treppen bezahlen Götterkarten, Rest wird am Ende zu je 2 Münzen |
| Linker Balken (Treppen), Fähigkeitskarten „Lightning Rate 50 %“, „Lightning Spear“ | Linker Balken zeigt Treppenvorrat gegenüber der nächsten Götterkarte; Fähigkeiten über „Göttliche Hilfe“-Karten auf der Strecke, als Karten unter dem Balken |
| Treppenabschnitt mit „?“-Kiste und 3 Götterkarten (Legendary/Common/Uncommon, 5/6/7 Stufen) | Steintreppe in der Streckenmitte mit ?-Kiste und 3 Götterkarten (Legendär/Gewöhnlich/Ungewöhnlich, Kosten in Treppen) |
| Zielflagge, Käfige mit HP und Kristallen; Boss-Tor mit Pentagramm | Zielflagge, 4 Käfige (10 s Zeit), Boss-Etagen mit Pentagramm-Tor |
| Zwei Ritter (im Menü freischaltbar, Rang und Schaden mit Geld) | Zwillingsritter: 150 Münzen, Rang 1–5 (Wurfrate, ab Rang 3/5 weiterer Ritter), Schaden bis Stufe 30 |
| Münzstapel, Schadenszahlen, Fortschritt zum nächsten Gebiet | Münzstapel, fliegende Schadenszahlen, Ergebnis mit Gebietsfortschritt und Belohnungskacheln |
| Götter Zeus, Ares, Poseidon, Artemis, Hades | Gott wählen (Edelsteine), aktive Fähigkeit und Bonus; Götterkarten auf der Treppenplattform (Seltenheit verstärkt den Gott) |
| Begleiter (Zentaur, Minotaurus) | Zentaur, Minotaurus, Skelettritter (Seelen) |
| Etagen mit Bosstor („Third Floor“) | Jede 5. Ebene ein Boss: Dämonenkoloss, Seelenfänger, Höllenmaschine; jedes 20. Level Hades |
| Gebiete („Area 2 Void Abyss“), Karte mit Checkpoints | 5 Gebiete je 20 Level: Feuerschlund, Leere-Abgrund, Knochenfeld, Eishölle, Olymp-Tor; Karte im Menü |
| Teufelshorden, Sägen, Lava, verfluchte Tore | 6 Gegnerarten in Schwärmen, Kreissägen, Lavafelder, Totems |
| 1x-Tempotaste | Taste 1x/2x oben links |

Nicht nachgebaut: Rebirth, Shop mit Echtgeld, Ausrüstungsteile (Rüstung). Stattdessen gibt es dauerhafte Upgrades. Der Held ist ein Ritter mit Federbusch; die Rüstungsfarbe wechselt mit der Leben-Stufe, ab Stufe 4 mit Krone.

## 2. Dateien

```
games/army-rush/
├── index.html             Das komplette Spiel (eine Datei, kein Build)
├── vendor/three.min.js    Three.js r128 lokal (offline-fähig)
├── manifest.webmanifest   Home-Bildschirm-App „Hell Escape“ (start_url ./?edition=4)
├── sw.js                  Offline-Cache hell-escape-v1 (löscht alte army-rush-Caches)
├── app-icon*.png|svg      Neues Symbol: Treppe über Lava
├── UEBERGABE.md           diese Datei
├── CHAT-VERLAUF.md        Verlauf aller Wünsche (Army Rush + Hell Escape)
├── SPIEL-KOMPLETT.md      alles in einer Datei für Chats ohne Repo (tools/bundle.js)
├── APP-INSTALLIEREN.md    Anleitung Home-Bildschirm
├── screenshots/           Kontrollbilder
├── tools/                 look.js (Screenshots), sim.js (Balance-Bot), probe.js (Herzverlust je Level), bundle.js
└── archiv/                Army Rush Edition 03 mit Unterlagen und alten Werkzeugen
```

## 3. Code-Karte (`index.html`)

| Bereich | Namen im Code |
|---|---|
| Speicherstand | `SAVE_KEY = 'hellEscape.v1'`, `freshSave`, `validateSave`, `persist`, Export/Import (`hell-escape-save` v1) |
| Upgrades (Münzen) | `UPG`: Schaden, Wurfrate, Leben (max. 5), Start-Treppen, Magnet; `ucost` |
| Götter (Edelsteine) | `GODS`, `gcost`, `godSkill`, `godDps`; Abklingzeit `cd` sinkt pro Stufe um 4 % |
| Begleiter (Seelen) | `COMPS` |
| Waffen | `WTYPES` (8 Arten mit Eigenschaft), `makeWeapon3D`, `drawWeaponIcon`, `drawEquipCard` |
| Gegner | `KINDS` (Teufelchen, Dämonen, Skelette, Höllenhunde, Feuermagier, Oger), `layout(e)`, `setFoe`, `FOE_MAX = 1400` |
| Gebiete | `AREAS`, `areaOf(l)` |
| Level | `genLevel(l)`: Ereignisse `rock`, `craft`, `sgate`, `enemy`, `saw`, `totem`, `lava`, `god`, `heart` |
| Bosse | `BOSSES`, `bossFor`, `buildBoss`, `calibrateBoss`, `updateBoss`, `BOSS_T` |
| Kampf | `throwWeapon`, `aimTarget` (Zielhilfe), `findHit`, `applyHit`, `hitEnemy`, `hitObj`, `chainBolt` |
| Fähigkeiten | `PERKS`, `HELP_POOL` (Göttliche Hilfe), `applyPerk`, Blitzspeer in `update` |
| Treppenabschnitt | `climb`-Ereignis, `groundY(z)`, `mystery`, `god` mit `rar` (`RARITY`) |
| Zwillingsritter | `TWIN`, `save.twin`, `twins`, `twinDps` |
| Finale | `cage`-Ereignisse, `startFinale`, `fin` |
| Schadenszahlen | `dmgNum` |
| Test-Schnittstelle | `window.__hellEscape`: `run(bot)`, `jump(z)`, `steer(x)`, `L()`, `B()`, `save()`, `setSave()`, `TUNE`, `sim` |

## 4. Balance-Regler

| Regler | Wert | Wirkung |
|---|---|---|
| `powerRef(l)` | `2 + 0.6·(l−1)` | erwartete Waffenstärke, Bezug für Gegner-HP |
| `ENEMY_E(l)` | `1 + 0.045·(l−1)` | Gegner werden schneller stärker als die Waffen; Upgrades nötig |
| Hordengröße | `(6..15) · K.cnt · (1.15 + 0.05·l) · (0.45 + 0.75·Streckenanteil)` | Horden wachsen über Level und Strecke |
| Durchschlag | Grundwert 2 (+2 je Perk, +1 Dreizack) | ein Wurf trifft mehrere Gegner |
| Horde erreicht Helden | 1–2 Herzen je nach Restgröße | |
| Boss-HP | `(Held-DPS·0.75 + Begleiter + Götter) · 14 s · BOSS_T` | Bosse passen sich der Stärke an |
| Comeback | `save.fails`: +5 % Schaden je Niederlage, Boss −4 % (max. 10) | verhindert Wände |
| Münzen | Sieg `20 + 5·Level + Kills/Stapel/Käfige + 2 je übrige Treppe` | |
| `TUNE` | `{hp: 1, cnt: 1, boss: 1.25}` | globale Regler |
| Käfige im Ziel | HP = Feuerkraft × (1,3 + 0,35·i) s, 10 s Zeit | |

**Messung** (`tools/sim.js 30`, Bot weicht perfekt aus, kauft Upgrades und Zwillingsritter):
- Level 1–30 in 37 Versuchen.
- Der erste Boss (Level 5) braucht 7 Versuche, ab Level 20 wird es mit zwei Zwillingsrittern eher leicht.
- Strecken gelingen meist beim ersten Versuch, oft mit 1–3 Herzen Rest.
- Keine JS-Fehler.

Echte iPhone-Leistung ist nicht gemessen. Der Grafikmodus „Sparsam“ ist vorhanden.

## 5. Tests

```bash
cd games/army-rush/tools && npm init -y && npm i playwright && npx playwright install chromium
node look.js 1 5 22     # Screenshots nach tools/out/
node sim.js 30          # Balance-Bot Level 1–30
node probe.js 3         # Wo verliert der Held Herzen?
node bundle.js          # SPIEL-KOMPLETT.md neu erzeugen
```

## 6. Offene Punkte

1. Auf echten iPhones testen: Leistung, Touch-Steuerung, Home-Bildschirm-App-Update.
2. Alte Army-Rush-Spielstände werden nicht übernommen. Hell Escape startet bei Level 1 (eigener Speicherschlüssel).
3. Ideen aus dem Vorbild, die noch fehlen: Rebirth, Ausrüstungsteile, weitere Gebiete und Bosse.
