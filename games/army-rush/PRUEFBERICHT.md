# Prüfbericht – Balance2,26.10.2026

Version2026.10.26.2. Alle folgenden Nachweise aus isoliertem Chromium/SwiftShader; echtes iPhone/Safari nicht verifiziert.

## Bestanden

- Syntax, Git-Diff-Format, Bundle-Identität.
- 100 Monster-/Spurenpläne und 100 neue Torpläne. Höchstens drei Waffenreihen, passende Freischaltungen, höchstens ein seltener×1,25-Multiplikator.
- 116 benannte mechanische Prüfungen: Migration, Idempotenz, drei Kategorien, keine HP-abhängige Münzerzeugung; alle18 Waffen vor Arena gegen Boss geschützt; Direkttreffer, Flächenschaden und Flammen wirken nach Freigabe; Kalibrierung einmalig.
- Frische Kampagne1–12 in15 Versuchen abgeschlossen. Alle zwölf Siege finanzierten jeweils2–3 einzelne Käufe. Keine Boss-Vorabkills. Bosszeitmedian25,0s; Bereich13,7–32,83s. Der kurze Level11-Kampf nutzt Flammenwerfer, kein erzwungenes Mindestzeitfenster. Waffen und Ausweichen können die Dauer verändern.
- Migrierte Altstände mit hohen ursprünglichen Upgrades/Guthaben in Level4–12 separat gespielt. Alle neun Szenarien gewonnen; maximal drei Versuche in Level11. Originalwerte erhalten, keine erneute Umrechnung beim Validieren/Neustart.
- 16 Seitenwechsel-/Bonusfälle in Level1/4/8, beide Richtungen und alle vorhandenen Bonusreihen mit fünf Startsoldaten: Bonus erhalten, andere Kiste nicht gerammt, kein Verlust im Bonusbereich.
- Tatsächliche Projektiltreffer unabhängig von virtuellem Gewicht: sieben Treffer bleiben als sieben gezählt, Bonus höchstens+5; Tormitte rechts; einmalige korrekte Auszahlung.
- Spur-/Flächenangriffstrennung, Wechselzonen-Fortschritt, Fahrzeugablauf, Ergebnis sofort gespeichert, ungültiger Import verändert Stand nicht.
- Vier Layoutgrößen; Export/Import, automatisch migrierter Altstand mit sichtbarem Hinweis und erreichbarem Export, erneuter Start ohne Münzverlust durch erneute Umrechnung.
- Offline-Neustart; vollständiger Browserprozessneustart mit persistentem Profil; IndexedDB-Fallback bei gesperrtem localStorage; sichtbarer Fehler bei beiden gesperrten Speicherarten; Hintergrundpause.
- Sichtkontrolle drei Upgradefelder, grüne/orange Tore, konkrete Ergebnisanzeige und Migrationshinweis.

## Gemessene Siege

|Level|Waffe|Bosszeit s|Münzen|Käufe|
|---|---|---:|---:|---:|
|1|uzi|23.37|115|2|
|2|revolver|30.7|153|3|
|3|shotgun|20.23|190|2|
|4|rifle|24.73|228|3|
|5|cryo|25.27|265|2|
|6|shotgun|20.47|303|3|
|7|sniper|32.83|340|2|
|8|shotgun|20.77|378|3|
|9|plasma|27.1|415|2|
|10|shotgun|32|453|3|
|11|flamer|13.7|490|3|
|12|rocket|28.63|528|2|

## Grenzen und sichere Umstellung

Die zuvor verwendete Balanceprüfung konnte Boss-Vorabkills übersehen, weil nur der Levelabschluss bewertet wurde. Die neue Prüfung erfasst ausdrücklich Initialisierung und reale Bosszeit.

Münzen und Upgradewerte werden beim ersten Start der neuen Balance einmalig normalisiert; das Level bleibt. Originalwerte liegen im eingebetteten legacy-Objekt und in preBalance2. Export sichert auch diesen Originalstand. Details/Formeln in UEBERGABE.md. Keine Telemetrie, neuen Server oder zusätzlichen Konten.

Ein Botlauf ist ein reproduzierbarer technischer Referenzfall und ersetzt menschliches Spielgefühl nicht. Körperliche iPhone-/Safari-Leistung und die Geräteinstallation sind nicht verifiziert. Bei maximal ausgebauten Kategorien oder angesparten Münzen weicht die Zahl kaufbarer Upgrades naturgemäß ab.

Reproduktion: node games/army-rush/tools/balance-rework-check.js, node games/army-rush/tools/edition03-check.js, node games/army-rush/tools/bundle.js. Vollprotokolle lokal in tools/out/balance-rework-check.json und balance-integration.txt. Öffentliche Veröffentlichung separat nach Merge prüfen.
