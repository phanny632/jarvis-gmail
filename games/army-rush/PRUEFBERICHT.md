# Army Rush Edition 02 – Prüfbericht

25.10.2026. Lokale Prüfung der Erweiterung; Veröffentlichungsprüfung wird separat nach Merge protokolliert.

## Umfang

Sechs Wellenmuster, drei neue Bosse, vier neue Waffen und iOS-artige Oberfläche mit Mission/Arsenal/Einstellungen. Bestehender Speicherstand und öffentlicher Pfad bleiben erhalten. Keine Änderungen an den JARVIS-Seiten im Hauptordner.

## Prüfungen

- JavaScript-Syntax: bestanden.
- 100 generierte Level: 18 Waffen, alle acht Bossarten und alle sechs Wellenmuster erreichbar; keine falschen Freischaltungen und keine direkten Bosswiederholungen.
- Alle 18 Waffen gegen einen Boss: positiver Schaden und endliche Werte. Neue Waffenfaktoren nach Messung gerundet.
- Alle acht Bossmodelle: aufgebaut und in der Kampfschleife mit endlichen HP-Werten geprüft.
- Kryotreffer, Waffenwechsel mit fliegenden Geschossen und offene/geschlossene Kernphasen: geprüft.
- Navigation: drei bedienbare Bereiche, 18 Arsenal-Karten und Freischaltsperren. Grafikeinstellung bleibt nach Neuladen erhalten.
- Layouts: 320×568, 390×844, 844×390 und 1440×900; Karten innerhalb des Viewports; kleine Ansichten verwenden einen scrollbaren Inhalt mit fest erreichbarer Tab-Leiste.
- Bestehender Spielstand: isolierter Test mit Level 12, 1.234 Münzen, bestehenden Upgrades, Bestlevel und Niederlagenzähler.
- Balance, vorhandener Bot mit automatischen Upgrades: Level 1–30 in 80 Versuchen; höchstens 13 Versuche auf einem Level, keine JavaScript-Fehler. Zufallsabhängiger Lauf.
- Sichtkontrolle: Mission, Arsenal, Einstellungen und neue Bossmodelle im Chromium-Browser.
- Bundle-Befehl zeigt Schritt 1/5 bis 5/5. Eingebetteter HTML-Code wird vor Veröffentlichung bytegenau gegen index.html verglichen.

Reproduktion: `node games/army-rush/tools/expansion-check.js` und `node games/army-rush/tools/bal_short.js` nach Installation von Playwright/Chromium. Optionale lokale Three.js-Datei über `THREE_JS` für expansion-check.js oder tools/three.min.js für bestehende Skripte. Ergebnisse und Screenshots landen in tools/out/. Testbrowser haben einen isolierten Spielstand.

## Begrenzte Sicherheitsprüfung der Änderungen

Kein zusätzlicher Netzwerkdienst, kein Login, keine Telemetrie und keine neuen sensiblen Daten. Neue HTML-Karten verwenden konstante Waffenwerte; neue Grafikeinstellung wird lokal und defensiv gelesen. Fonts werden über die Systemschrift dargestellt, ohne Google-Fonts-Abfrage. Bestehende externe 3D-Abhängigkeit bleibt Three.js r128 vom bisherigen CDN. Kein vollständiger Audit aller unveränderten Altmechaniken oder der externen Bibliothek.

## Grenzen

Echte iPhone-Hardware, Safari/WebKit-Leistung, Home-Bildschirm-Installation und langfristiger Speichererhalt sind nicht verifiziert. Die Oberfläche ist ein Browser-Spiel im iOS-Stil. Chromium verwendet für reproduzierbare Tests SwiftShader; daraus folgt keine FPS-Zusage für ein iPhone. BOSS_WF-Messungen der neuen Waffen stammen vom Koloss und sind keine vollständige Messmatrix aller Bossformen. Alte Prüfaufträge im Chatverlauf sind nur insoweit erledigt, wie dieser Bericht es belegt.
