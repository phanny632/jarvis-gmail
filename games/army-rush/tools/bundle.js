// Packt alles für einen Chat ohne Repo-Zugriff in eine Datei: games/army-rush/SPIEL-KOMPLETT.md
// Aufruf (aus dem Repo-Hauptordner oder von überall): node games/army-rush/tools/bundle.js
const fs = require('fs'), path = require('path');
const GAME = path.resolve(__dirname, '..'), ROOT = path.resolve(GAME, '../..');
const OUT = path.join(GAME, 'SPIEL-KOMPLETT.md');
const parts = [
  ['SPIEL.md (Einstieg)', path.join(ROOT, 'SPIEL.md'), 'md'],
  ['UEBERGABE.md (Code-Karte und Regler)', path.join(GAME, 'UEBERGABE.md'), 'md'],
  ['CHAT-VERLAUF.md (bisheriger Verlauf)', path.join(GAME, 'CHAT-VERLAUF.md'), 'md'],
  ['games/army-rush/index.html (kompletter Spielcode)', path.join(GAME, 'index.html'), 'html'],
];
const total = parts.length + 1;
try {
  console.log(`Schritt 1/${total}: Start, Ziel ${OUT}`);
  let out = `# SPIEL-KOMPLETT: Army Rush („Ein Game für Fiete“)

> **Anweisung an die KI, die diese Datei bekommt:**
> Diese Datei enthält das komplette Projekt: Einstieg, Code-Karte, bisherigen Verlauf und den vollständigen Spielcode.
> Der Startbefehl ist **spiel**. Schreibt der Nutzer \`spiel\`, nenne in höchstens 5 Zeilen den Stand und die offenen Punkte und frag nach der nächsten Aufgabe.
> Halte dich an den Antwortstil aus „So möchte Stefan Antworten“.
> Wenn du Code änderst, gib die komplette neue \`index.html\` aus, oder klar abgegrenzte Ersetzungen mit altem und neuem Text.
> Erzeugt mit games/army-rush/tools/bundle.js am ${new Date().toISOString().slice(0, 10)}.

`;
  parts.forEach(([title, file, lang], i) => {
    console.log(`Schritt ${i + 2}/${total}: füge ${title} hinzu`);
    if (!fs.existsSync(file)) throw new Error(`Datei fehlt: ${file}. Lösung: Repo vollständig auschecken und den Pfad prüfen.`);
    const txt = fs.readFileSync(file, 'utf8');
    out += `\n\n---\n\n# ${title}\n\n` + (lang === 'md' ? txt : '```' + lang + '\n' + txt + '\n```\n');
  });
  fs.writeFileSync(OUT, out);
  console.log(`Fertig: ${(out.length / 1024).toFixed(0)} KB geschrieben nach ${OUT}`);
} catch (e) {
  console.error('FEHLER: ' + e.message);
  process.exit(1);
}
