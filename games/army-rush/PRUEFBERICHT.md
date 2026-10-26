# Edition 03 – Prüfbericht

25.10.2026. Monster Trails und installierbare Web-App.

## Bestanden

- JavaScript-Syntax und Git-Diff-Formatierung.
- 100 generierte Level: acht Monsterarten bis Level 8, acht unterschiedliche Einstiegsbosse, zwei unterschiedlich starke Wellen je Abschnitt, korrekte Freischaltungen.
- Höchstens drei Waffenreihen, mindestens 20 Sekunden Abstand und höchstens eine Multiplikator-Entscheidung pro Runde.
- Spurbindung und Formation; kein Flächen-/Direktschaden an der anderen Spur.
- Wechselzonen-Regression: eine fremde Welle hält die Bewegung nicht auf. Ein während der Balanceprüfung gefundener Hänger wurde damit behoben.
- Panzerbonus mit sichtbarem Modell und Countdown läuft ab; Fahrzeugzeit pausiert bei ausgeblendeter Seite. Buggy-/Panzerlevel wurden in der Simulation durchlaufen.
- Ergebnis wird vor der Animation gespeichert: Levelanstieg sofort im Gerätespeicher nachgewiesen.
- Ungültiger Import verändert den Stand nicht; Datei-Export und gültiger Import funktionieren.
- App-Neustart mit gespeichertem Stand; zusätzlich vollständiges Beenden und Neustarten eines isolierten Chromium-Prozesses mit persistentem Profil. Wiederherstellung von Level 12 und 777 Münzen aus IndexedDB bei gesperrtem localStorage erfolgreich.
- Beide Speicher-APIs verweigert: sichtbarer Fehlerstatus statt vorgetäuschtem Speichern.
- Manifest, eigene PNG-Symbole, Serviceworker-Kontrolle und erneutes Laden ohne Netzwerk erfolgreich.
- Vier Layoutgrößen: 320×568, 390×844, 844×390 und 1440×900. Sichtkontrolle der Monsterwelt und der beiden Spuren.
- Vorhandener Balance-Bot mit korrekter Auswertung der Rechenfolgen: Level 1–8 in 17 Versuchen, keine JavaScript-Fehler. Dieser Lauf ist zufallsabhängig und ersetzt keinen menschlichen Schwierigkeitsvergleich.

## Dauer und Balance

Reine Laufzeit laut Generator: 60 Sekunden im ersten Level, danach 90–120 Sekunden. Nahkämpfe halten die Bewegung an und verlängern die Runde; ein Fahrzeug verkürzt Laufabschnitte. Tatsächliche komplette Runden im Botlauf liegen überwiegend über zwei Minuten; Einzelwerte stehen im lokalen Protokoll edition03-balance.txt. Gegner-HP verwenden ein festes Level-/Abschnittsbudget mit erwarteter Progression, keine nachträgliche Anpassung an jede gute Rechenentscheidung.

## Grenzen und Sicherheit

Chromium mit SwiftShader und isolierten Testprofilen. Echte iPhone-/Safari-Hardwareleistung und Installation auf Stefans bzw. seinem Kumpels iPhone sind nicht verifiziert. Keine Aussage über native App-Store-Verfügbarkeit. Es ist eine eigenständige Home-Bildschirm-Web-App.

Kein Konto, keine Telemetrie und kein neuer Serverdienst. Die 3D-Bibliothek ist lokal mit MIT-Lizenz paketiert. Der Serviceworker greift nur innerhalb des Spieleordners ein. Importdaten sind größenbegrenzt und validiert; unzulässige Werte werden vor Änderungen am Spielstand zurückgewiesen. Speicher bleibt gerätegebunden und kann durch Löschen der Website-/App-Daten verloren gehen. Export-Sicherung verwenden. Eine automatische Übernahme aus einer fremden Claude-Origin ist nicht möglich.

Reproduktion: `node games/army-rush/tools/edition03-check.js`, `node games/army-rush/tools/bal_short.js 8`, `node games/army-rush/tools/bundle.js`. Playwright/Chromium für Browsertests erforderlich. Der Spielbetrieb selbst braucht keinen Build.
