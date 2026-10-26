# Übergabe – Monster Rush / Army Rush

Stand26.10.2026, Balance2, Meta-Version2026.10.26.3. Einstieg: SPIEL.md, Startbefehl `spiel`.

## Spiel und Veröffentlichung

Bestehender Link für beide Spieler: https://phanny632.github.io/jarvis-gmail/games/army-rush/?edition=3 . Jeder hat einen eigenen Gerätespeicher. Installierbare Web-App, keine native App-Store-App. Code vollständig in index.html, Three.js r128 lokal unter vendor/, kein Build im Spielbetrieb. JARVIS-Seiten im Repo-Hauptordner bleiben getrennt. GitHub Pages aus main, Änderungen über PR.

## Inhalt und Darstellung

18 Waffen, acht normale Monsterarten und acht Bossformen. Normale Monster ab Level1–8: Schleime, Krabbler, Panzerkäfer, Säurespucker, Hornrammer, Sporenschamanen, Steingolems, Splitterbestien. Drei Monsterwelten mit getrennten Pfaden. Waffenmodelle, Gegner, Fahrzeuge und Welt als Three.js-Geometrien. iOS-artige Navigation Mission/Arsenal/Einstellungen; reduzierte Grafik und Systemeinstellung für Bewegung.

Bossreihenfolge: Mooskoloss, Hornkönig, Himmelsschwinge, Kristallwächter, Sporenfürst, Skorpionläufer, Schwarmmutter, Rissherz. Danach wiederholt sich die Reihenfolge, Elite alle fünf Level. Jeder Boss hat eigene Angriffe. Fahrzeuge ab Level3 auf jedem dritten Level, Buggy8s / Panzer10s; Schutz und Durchbruch auf der gewählten Spur, kein Bossüberspringen. Hintergrundpause hält die Simulation an.

## Strecken, Wechsel und Wellen

HALF9, Geschwindigkeit9m/s. Level1 470m und vier Abschnitte; danach690–720m und sechs Abschnitte. Grundbewegung52 bzw.77–80s; Kämpfe stoppen die Vorwärtsbewegung vor nahen Wellen, Fahrzeuge beschleunigen. Echte Gesamtdauer hängt von Kämpfen ab.

Abschnittsstart=-55−i*(len−30)/count; Ende=start−(len−30)/count+44. Offene Wechselzone ab start+44, physischer Mitteltrenner ab start−12. Bonuskisten bei start+18:26m Anlauf ab Öffnung,8HP unabhängig vom Level. Zwei Bonusreihen, drei Kampfabschnitte Abstand. Pro Reihe nur eine Belohnung. Truppenbonus10+min(8,floor(level/3)).

Tor bei start−7 bindet beim Durchlaufen die gewählte Route bereits verbindlich; kurze Strecke bis zum physischen Mitteltrenner gehört zur gebundenen Spur. Bonus, Risikohinweis und folgende Monsterroute passen dadurch zusammen. Monster starten bei start−48 und greifen erst in der gebundenen, eigenen Sektion/Spur an; Beschuss anderer oder noch nicht gewählter Abschnittswellen zählt nicht. Seitliche Formation wird komprimiert, Direkt-/Flächenangriffe bleiben in der gewählten Spur. Wechselzonen werden nicht durch fremde Wellen blockiert.

Wellenbudget: erwartete Armee16+min(level,40)*1.5+i*10; erwartete Upgradestufe min(50,(level−1)*2.5/3). HP=erwarteteArmee*1.6*(1+.04*Up)*(1+.06*Up)*5*(ersterAbschnitt?.65:1)*(EliteRoute?1.55:1). Feste Level-/Abschnittsbudgets, keine Neuskalierung nach jedem Tor. Normal/Elite-Wellen haben unterschiedlich viele Gegner und Belohnung.

## Neue Tore

Genau eine Operation je Seite. Normal: +g, Elite: +2g mit g=6+min(4,floor((level−1)/3)). Ab Level4 höchstens eine Elite-Entscheidung×1,25 in der Rundenmitte. Keine mehrstufigen Divisions-/Additionsketten. `gateResult()` ist die einzige Rechenfunktion für Anzeige und Auszahlung; rundet das Ergebnis und addiert den Trefferbonus einmal.

Ein tatsächlich kollidierendes Projektil zählt einen Treffer, unabhängig vom virtuellen Soldatengewicht. Bonus=min(5,floor(Treffer)); Anzeige enthält echte Trefferzahl sowie Bonusgrenze getrennt. Dauerflammen zählen10/s zeitbasiert. Tormitte gehört eindeutig rechts. Farben: Grün normale Route, Orange Elite. Anzeige: Operation, konkrete Soldatenzahl vorher→nachher inklusive Trefferbonus, Risiko. Texturen aktualisieren sich für Tore im Nahbereich100m.

## Bossfreigabe und Kalibrierung

`bossCanTakeDamage()` verlangt aktive Bossphase, einmalige Initialisierung, lebenden Boss und laufenden Zustand. Direkttreffer, Flammen, Flächen- und Kettentreffer am Boss nutzen diese Grenze; kein Vorabkill und kein Sieg vor der Arena. `calibrateBoss()` läuft genau einmal und leert alte Projektile beim Eintritt. Im echten Kampf wirken Treffer ohne künstliche Mindestzeit.

HP=max(25% Grund-HP, Armee*Feuerrate*Schaden*gemessenerWaffenfaktor*Comeback*.6*T). T=(Level≤2?22:24)*BOSS_T[type]*(KolossAb9?.8:1)*(EliteHornkönig?.9:andererElite?1.12:1)*(1−.05*pity). BOSS_T:1.0/1.05/.82/.95/.8/.9/.7/.7 in Bossreihenfolge. Schadenanteile in BOSS_P, globaler p-Regler .8; Elite-Hitfaktor .65. Bei mehreren Hornkönig-Geschossen wird das Salvenschadensbudget unter den Geschossen aufgeteilt. Ziel etwa20–35s bei Referenzausrüstung, Waffenwahl und Ausweichen beeinflussen die Dauer. Starke Builds dürfen schneller sein. Kampfzeit und Vorabkills werden explizit getestet.

## Drei Upgrades und Münzen

Nur Start-Truppe, Feuerrate, Schaden; je maximal50 Stufen. Werte:5+2*Stufe Soldaten,1.6*(1+.04*Stufe) Schuss/s,1+.06*Stufe Schaden. Reichweite fest26m vor Waffenfaktor; kein Einkommensupgrade. Kaufpreis für jede Kategorie:40+6*Summe der drei gekauften Stufen. Es gibt keine künstliche Kaufbegrenzung.

`economyBudget(level)`=round(115+37.5*(min(level,100)−1)). 35% über besiegte Abschnittswellen, Elite-Route20% Aufschlag auf ihren Abschnittsanteil;65% für den Sieg. Keine Killmünzen nach Monster-HP, keine Doppelprämie für Elite-Bosse. Wellenbelohnung höchstens einmal, auch nach Nahkampf. Niederlage:round(min(30% Budget,50% gesammelte Wellenmünzen+10% Budget*Fortschritt)*max(.1,1−.25*bisherigeFehlversuche)). Damit bleiben Fehlversuche deutlich kleiner und sinken bei Wiederholung. Eine normale Referenzkampagne finanziert2–3 Käufe pro Sieg bis zum Ausbauende; angespartes Geld kann zusätzliche Käufe ermöglichen.

## Speicher und einmalige Umrechnung

Schlüssel armyRush.v1 + armyRush.v1.backup bleiben erhalten; neue Daten haben balanceVersion:2. Ältere Stände werden vollständig validiert, Level/Bestlevel/Fehlversuche bleiben. Original-Level/Bestlevel/Fehlversuche/Zeitstempel/Münzen/alle fünf Upgrades werden als validiertes legacy-Objekt im neuen Stand und im Datei-Export mitgeführt. Zusätzlich preBalance2 in localStorage und IndexedDB (armyRush.device, Store saves). Kein Konto oder Cloudtransfer.

Umrechnung: Ziel-Gesamtstufen=min(150,Summe alter fünf Upgradelevel,max(3,round((Level−1)*2.5))). Verteilung nach bisherigen Anteilen: Start+Income/3; Rate+Range/2+Income/3; Schaden+Range/2+Income/3, jeweils maximal50, verbleibende Stufen nach größtem Rest. Neue Range/Income-Felder bleiben0 als kompatible Speicherfelder. Münzen=round(Altguthaben/100), höchstens Kosten der ersten zwei Käufe (2*neuerPreis+6). Die Einstellungen zeigen die Umrechnung an. Erneutes Laden/Validieren eines Balance2-Stands rechnet nicht erneut um. Import validiert vor Anwendung,64KB Limit. Ungültige Dateien verändern den laufenden Stand nicht.

Neuster gültiger Stand aus localStorage/Backup/IndexedDB wird vor Boot geladen; IDB-Öffnung begrenzt2.5s. `settleRun()` sichert das feststehende Ergebnis vor Animation, genau einmal. Upgrades, Spielstart, pagehide und Sichtbarkeitswechsel sichern ebenfalls. Laufende Runde startet nach Abbruch neu im erreichten Level. Speicherfehler werden sichtbar; Export/Import erreichbar, Einstellungen scrollen vollständig auch mit langem Migrationshinweis. Website-Daten löschen kann lokale Stände löschen. Fremde Claude-Origin lässt sich nicht automatisch übernehmen.

## Offline und Wiederherstellung

Manifest standalone, eigene Symbole, lokales vendor. Cache army-rush-edition03-v4 im Spielordner; Navigation online zuerst Netzwerk, offline gespeichertes HTML. Bei weiterem Asset-Update CACHE erhöhen. Bestehendes Home-Symbol online schließen/neu öffnen; keine neue Adresse notwendig.

Rollback: vorherigen Git-Stand wieder veröffentlichen und Cacheversion erneut erhöhen. Für Wirtschaftsrücknahme gegebenenfalls die validierte Original-Sicherung aus preBalance2/legacy verwenden, nicht einen schon umgerechneten Stand nochmals verkleinern. Vor manueller Wiederherstellung erst Datei-Export sichern.

## Verifikation

`node games/army-rush/tools/balance-rework-check.js`: 100 Torpläne, Bossfreigabe mit18 Waffen, Flächen-/Flammenschaden vor/nach Arena, Migration/Idempotenz, HP-unabhängige Münzen, frische Kampagne1–12 mit Käufen/Kampfzeiten, migrierte Altstände4–12.

`node games/army-rush/tools/edition03-check.js`: 100 Monsterpläne, Spuren, Fahrzeuge,12 Wechsel-/Bonusfälle, Projektilzähler und einmalige Auszahlung, vier Layouts, Altsicherungs-Start/Neustart, Export/Import, Offline und vollständiger Browserprozessneustart samt IDB-Fallback. Playwright/Chromium nur für Tests nötig.

Syntax gemäß SPIEL.md. Nach Dokumentänderungen `node games/army-rush/tools/bundle.js`; eingebettetes HTML muss bytegleich index.html sein. Aktuelle Messwerte in PRUEFBERICHT.md und tools/out/balance-rework-check.json. Echte Safari-/iPhone-Hardwareleistung und Installation sind nicht verifiziert.

## Kürzere Strecken und Gefahren – 26.10.2026

Freigegeben durch Stefan: Ja. Generatorlänge470 / 690+min(30,(Level−2)*3)m;4/6 Abschnitte, sichere Abschnittsabstände bleiben110–115m. Angebote in Abschnitt0 und3;35% des unveränderten Rundenbudgets verteilen sich auf weniger Wellen. Bestehende Wirtschafts-/Speicherversion2 bleibt unverändert.

Hazard-Ereignisse in Level1 in Abschnitt2/3 (Kristalle), danach in Abschnitt1–5, abwechselnd Barrieren/Sporenfelder. Jeweils zwei gespiegelt vorbereitete Spuren, aktiv nur in der gebundenen aktuellen Spur; andere Spur richtet keinen Schaden an. Ort=start−54, mindestens12m vor nächster Wechselzone,38m vor einer folgenden Bonuskiste und47m hinter dem eigenen Tor.

Hinderniszentrum innerhalb der Spur bei Betrag2.9 oder6.1, sichere Formation bei Betrag6.7 bzw.2.3. Kollisionshalbbereiche .7m seitlich /1.2m längs plus .16/.2 Mitgliederabstand; alle sichtbaren Soldatenpositionen werden berücksichtigt. Grün markiert den sicheren Durchgang, Orange/Rosa die Gefahr. HUD nennt die freie Richtung.

`updateHazards(dt)` warnt ab30m Entfernung. Sporen benötigen mindestens1.5s Simulationswarnzeit und maximal5m Entfernung vor dem0.9s-Ausbruch. Früher Kontakt löst nicht sofort aus. Barrieren kosten einmalig ceil(8% Armee), Sporen ceil(12%), höchstens gesamte Armee; Rundung kann bei sehr kleinen Truppen relativ höher ausfallen. Kein Mehrfachschaden pro Bild. Fahrzeugzeit>0 bricht Gefahren ab7m Entfernung; genereller Fahrzeugschutz bleibt. Nach Passage7m hinter der Gefahr wird das Ereignis beendet. Hintergrundpause hält auch Warn-/Ausbruchzeiten an.

Test `node games/army-rush/tools/hazards-check.js`:100 Pläne/994 vorbereitete Gefahren,72 sichere Formationslagen,48 Kontakt-/Ausweich-/Fahrzeugfälle, Warnminimum, Fremdspur und echte Hintergrundpause. Zwei neue Screenshots unter tools/out/hazard-*.png. Bot in balance-rework-check.js berücksichtigt sichere Durchgänge. Aktuelle Rundendauern im PRUEFBERICHT. Keine neue Datenmigration.
