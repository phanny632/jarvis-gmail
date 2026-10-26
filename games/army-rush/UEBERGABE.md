# Army Rush · Monster Trails – Edition 03

Stand 25.10.2026. Einstieg für Mensch und KI: SPIEL.md. Startbefehl: `spiel`.

## App für Stefan und seinen Kumpel

Einstieg: https://phanny632.github.io/jarvis-gmail/games/army-rush/?edition=3

In Safari öffnen, Teilen → Zum Home-Bildschirm, „Als Web-App öffnen“ einschalten, falls angeboten, und hinzufügen. Beide verwenden dieselbe Adresse; Fortschritt ist pro Gerät getrennt. Keine Anmeldung, keine Cloud-Synchronisierung. Das bisherige Claude-Symbol öffnet eine andere Fassung und aktualisiert sich nicht durch diese Veröffentlichung. Das alte Symbol und seine Daten nicht als Teil einer Migration löschen.

Der bisherige Link ohne Parameter funktioniert weiter. `?edition=3` ist ein klar erkennbarer Einstieg auf derselben Origin. Meta-Version: 2026.10.25.3.

## Dateien und Architektur

- index.html: gesamter Spielcode, Gestaltung und Speicherung.
- manifest.webmanifest: Name, Startadresse, Standalone-Modus, Sprache und Symbole.
- app-icon.svg, app-icon-192.png, app-icon-512.png: eigene Monster-Symbole.
- sw.js: Offline-Cache nur innerhalb games/army-rush/.
- vendor/three.min.js: lokal paketierte Three.js r128 mit MIT-Lizenz in vendor/LICENSE-three.txt. Keine externen Fonts und kein externer 3D-CDN-Abruf mehr.
- tools/edition03-check.js: Browser-, Speicher-, Spur- und Offlineprüfungen, erzeugt PNG-Symbole aus SVG.
- tools/bal_short.js 8: Bot-Simulation bis Level 8; erkennt Hänger.
- PRUEFBERICHT.md: Ergebnisse und Grenzen. CHAT-VERLAUF.md: Aufträge und Verlauf.
- SPIEL-KOMPLETT.md: Einstieg, Übergabe, Verlauf und kompletter index.html-Code; PWA-Dateien bleiben zusätzliche Dateien im Repository/Paket.

Kein Build-Schritt zum Spielen. JARVIS-Seiten im Hauptordner gehören nicht zum Spiel und werden nicht geändert.

## Monster und Bosse

| Ab Level | Monsterart | Eigenes Verhalten |
|---|---|---|
| 1 | Schleime | organische, hüpfende Grundwelle |
| 2 | Krabbler | schnellere, stoßweise Bewegung |
| 3 | Panzerkäfer | 30 Prozent Schadensreduktion |
| 4 | Säurespucker | angekündigte Säureeinschläge, ausweichbar |
| 5 | Hornrammer | angekündigter Ansturm mit Beschleunigung |
| 6 | Sporenschamanen | heilen nahe Monster derselben Spur |
| 7 | Steingolems | große Körper und angekündigte Bodenangriffe |
| 8 | Splitterbestien | kleinere, schnellere Teilformen bei niedrigen HP |

Alle acht Arten haben eigene Geometrie/Silhouette. Level 1–8 führen die neue Art garantiert ein. Die ersten acht Bosse sind Mooskoloss, Hornkönig, Himmelsschwinge, Kristallwächter, Sporenfürst, Skorpionläufer, Schwarmmutter und Rissherz. Danach rotiert die Folge. Bossmechaniken bleiben individuell; Körper und Umgebung gehören zur Monsterwelt.

## Zwei Kampfspuren und feste Levelpläne

`genLevel()` erzeugt sechs Abschnitte im Tutorial und neun ab Level 2. Jeder Abschnitt hat eine Wechselzone, zwei sichtbare Angebote und Monstergruppen auf beiden Seiten. Die Elite-Seite wechselt und bietet höhere Belohnung. `updateRoute()`, `laneClamp()` und `sameLane()` binden die gewählte Route und begrenzen Formation, Gegnerbewegung, Schüsse und Flächenschaden. Im Bossraum ist die volle Breite frei.

Grundlaufstrecke: Level 1 540 m, ab Level 2 810–1080 m bei 9 m/s. Das sind 60 bzw. 90–120 Sekunden reine Bewegung. Kämpfe halten die Vorwärtsbewegung bei nahen Wellen an; dadurch dauert die tatsächliche Runde länger. Der Fahrzeugbonus beschleunigt das Durchbrechen.

Monster-HP basieren auf festem Level-/Abschnittsbudget mit erwarteter Progression; sie werden nicht nach jeder guten Torentscheidung an die aktuelle Armee angepasst. Normale Gruppen sollen mehrere Sekunden standhalten. Die konkrete Dauer wird im Prüfbericht gemessen.

## Rechentore und Waffen

18 Waffen bleiben verfügbar. Höchstens drei Waffenreihen je Runde, drei Kampfabschnitte und mindestens 20 Sekunden Abstand. `gateResult()` wertet sichtbare Rechenfolgen aus. Es gibt höchstens eine Multiplikator-Entscheidung je Runde, keine ×2-Ketten. Die Alternative kann je nach Truppenstärke besser sein; Tore lassen sich nicht durch Beschuss hochzählen.

## Fahrzeugbonus

Ab Level 3 jedes dritte Level: automatisch beim Erreichen der Bonusposition ein Buggy für acht oder ein Panzer für zehn Sekunden. Sichtbares Modell, Countdown, Schutz der vorhandenen Truppe, zusätzlicher Schaden gegen Monster auf der gewählten Spur und höheres Fahrt-Tempo. Danach läuft dieselbe Truppe weiter. Bonus überspringt keinen Boss. `frame()` pausiert die Simulation bei ausgeblendeter App, damit der Bonus im Hintergrund nicht verbraucht wird.

## Speicherung

`validateSave()` prüft Level, Münzen, Bestlevel, Fehlversuche, Zeitstempel und Upgrades. Vorhandenes `armyRush.v1` wird gelesen. Hauptstand und lokaler Sicherungsstand, verifizierte localStorage-Schreibvorgänge und ergänzende IndexedDB-Sicherung (`armyRush.device`) werden verwendet. Der neueste gültige Stand wird vor Spielstart geladen.

`settleRun()` sichert Sieg/Niederlage und Belohnung sofort beim feststehenden Ergebnis; die Animation kommt danach. Upgrades, Spielstart, App-Wechsel und pagehide ergänzen das Speichern. Nach einem Neustart wird das erreichte Level fortgesetzt; eine abgebrochene laufende Runde beginnt neu. Bei nicht bestätigtem Speicher zeigt das Spiel eine sichtbare Warnung. Einstellungen bieten validierten Datei-Export und -Import. Ungültige Importe ändern den vorhandenen Stand nicht.

Dies ersetzt kein Cloud-Backup. Vollständiges Löschen von Website-Daten oder Entfernen einer Home-Bildschirm-App kann lokale Daten verlieren. Spielstände einer fremden Claude-Origin können nicht automatisch ausgelesen werden.

## Offline und Updates

Nach dem ersten vollständigen Laden und erfolgreicher Serviceworker-Installation startet die Web-App offline. Navigation lädt online zuerst die aktuelle HTML-Datei und nutzt offline die gespeicherte Version. Cache-Scope ist nur der Spielordner. Bei Änderungen an vorkopierten Assets oder Startdateien die CACHE-Version in sw.js erhöhen. Die Versionsanzeige prüfen.

## Tests und offene Grenzen

Syntax: `node -e "new Function(require('fs').readFileSync('games/army-rush/index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"`.
Browser: `node games/army-rush/tools/edition03-check.js` nach Installation von Playwright/Chromium.
Balance: `node games/army-rush/tools/bal_short.js 8`.
Bundle: `node games/army-rush/tools/bundle.js`.

Echte iPhone-Hardware, Safari/WebKit-FPS und die Installation auf Stefans und seinem Kumpels Geräten sind nicht durch die lokalen Chromiumtests verifiziert. Schritte zur Home-Bildschirm-Installation folgen Apples Dokumentation: https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios .
