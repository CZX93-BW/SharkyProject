# Deployment

Dieses Dokument beschreibt die Veröffentlichung von Sharky – Jump and Swim als
statische Webanwendung.

Das Projekt besitzt keinen Build-Schritt und benötigt zur Laufzeit keinen
Node.js-Server. HTML, CSS, JavaScript und Assets werden direkt durch einen
Webserver ausgeliefert.

## Aktueller Stand

Im Repository ist derzeit kein automatisches Deployment eingerichtet.

Nicht vorhanden sind:

- GitHub-Actions-Workflow
- automatische Veröffentlichung
- fest konfigurierte Hosting-Plattform
- dokumentierte Produktionsdomain
- verbindlicher Release-Tag-Prozess

Das Deployment wird deshalb aktuell manuell durchgeführt.

## Technische Anforderungen

Der Webserver muss statische Dateien ausliefern können:

- HTML
- CSS
- JavaScript
- SVG
- PNG
- JPG
- Audioformate
- Schriftdateien
- Textdateien

Eine Datenbank oder serverseitige Anwendung ist nicht erforderlich.

Für die veröffentlichte Version sollte HTTPS aktiviert sein.

## Laufzeitdateien

Für das Spiel werden mindestens folgende Dateien und Verzeichnisse benötigt:

```text
index.html
imprint.html
robots.txt
assets/
js/
styles/
```

Nicht für die Laufzeit erforderlich sind:

```text
docs/
scripts/
tests/
.git/
.gitignore
.editorconfig
package.json
package-lock.json
node_modules/
```

Diese Dateien können im Repository bleiben, müssen aber nicht auf den
Produktionsserver übertragen werden.

## Deployment-Struktur

Die Inhalte müssen so auf dem Server liegen, dass `index.html` direkt im
Webstamm der Anwendung erreichbar ist:

```text
webroot/
├── index.html
├── imprint.html
├── robots.txt
├── assets/
├── js/
└── styles/
```

Nicht korrekt wäre:

```text
webroot/
└── SharkyProject/
    ├── index.html
    ├── assets/
    ├── js/
    └── styles/
```

Diese zweite Struktur ist nur korrekt, wenn die Anwendung ausdrücklich unter
`/SharkyProject/` erreichbar sein soll.

Beim Upload eines ZIP-Archivs müssen deshalb normalerweise die Inhalte des
Releaseordners und nicht der umgebende Releaseordner im Webstamm landen.

## Relative Pfade

Das Projekt verwendet relative Dateipfade:

```html
<link rel="stylesheet" href="styles/base.css">
<script src="js/main.js"></script>
<link rel="icon" href="assets/icons/favicon.svg">
```

CSS-Dateien greifen ebenfalls relativ auf Assets zu:

```css
background-image: url("../assets/img/backgrounds/Mesa de trabajo 1.png");
```

Die Verzeichnisstruktur darf beim Deployment daher nicht verändert werden.

## Groß- und Kleinschreibung

Viele lokale Windows-Dateisysteme unterscheiden bei Dateipfaden nicht streng
zwischen Groß- und Kleinschreibung.

Linux-basierte Webserver unterscheiden dagegen beispielsweise zwischen:

```text
assets/img/Player/shark.png
assets/img/player/shark.png
```

Diese Pfade bezeichnen dort unterschiedliche Dateien.

Vor dem Deployment muss deshalb gelten:

- Dateiname und Referenz stimmen exakt überein.
- Groß- und Kleinschreibung stimmen überein.
- Leerzeichen in bestehenden Assetnamen bleiben erhalten.
- Dateien werden nicht einzeln ohne Anpassung ihrer Referenzen umbenannt.
- Der vollständige Assetordner wird übertragen.

## Releaseprüfung

Vor jedem Deployment:

```bash
git status
npm run check
git diff --check
```

Erwartet wird:

- Projektvalidierung erfolgreich
- alle 42 Tests erfolgreich
- keine Diff-Fehler
- keine ungeklärten lokalen Änderungen

Die Testanzahl kann sich bei späteren Erweiterungen erhöhen.

## Main aktualisieren

```bash
git switch main
git pull --ff-only origin main
git status
```

Der zu veröffentlichende Stand sollte committed und auf GitHub vorhanden sein.

Letzte Commits prüfen:

```bash
git log --oneline -5
```

## Releaseordner unter PowerShell erstellen

Die `.gitignore` schließt das Verzeichnis `.deploy/` aus. Dort können lokale
Releasepakete erstellt werden, ohne sie zu committen.

```powershell
$releaseId = Get-Date -Format "yyyyMMdd-HHmmss"
$releasePath = Join-Path (Get-Location) ".deploy\sharky-$releaseId"

New-Item -ItemType Directory -Path $releasePath -Force
Copy-Item "index.html" $releasePath
Copy-Item "imprint.html" $releasePath
Copy-Item "robots.txt" $releasePath
Copy-Item "assets" $releasePath -Recurse
Copy-Item "js" $releasePath -Recurse
Copy-Item "styles" $releasePath -Recurse

Compress-Archive `
    -Path "$releasePath\*" `
    -DestinationPath "$releasePath.zip"
```

Dadurch entstehen beispielsweise:

```text
.deploy/
├── sharky-20260827-153000/
└── sharky-20260827-153000.zip
```

Jeder Durchlauf verwendet einen neuen Zeitstempel und überschreibt kein älteres
Releasepaket.

## Releaseinhalt prüfen

PowerShell:

```powershell
Get-ChildItem $releasePath
```

Erwartete Einträge:

```text
assets
js
styles
index.html
imprint.html
robots.txt
```

Anzahl aller Release-Dateien prüfen:

```powershell
Get-ChildItem $releasePath -Recurse -File |
    Measure-Object
```

ZIP-Inhalt testweise entpacken:

```powershell
$testPath = "$releasePath-test"

Expand-Archive `
    -Path "$releasePath.zip" `
    -DestinationPath $testPath
```

Danach muss `index.html` direkt im Testordner liegen:

```text
.deploy/sharky-<release>/index.html
```

## Lokaler Release-Test

Der erzeugte Releaseordner sollte vor dem Upload über einen lokalen Webserver
getestet werden.

Beispielsweise mit einer bereits vorhandenen Serverlösung oder VS Code Live
Server.

Falls `serve` verwendet wird:

```bash
npx serve .deploy/sharky-<release>
```

Zu prüfen sind:

- Startseite erreichbar
- keine 404-Fehler
- Bilder werden geladen
- Schriftart wird geladen
- Musik und Soundeffekte werden geladen
- Level 1 startet
- Level 2 startet
- Impressum ist erreichbar
- Browserkonsole bleibt fehlerfrei

## Manueller Upload

Der genaue Uploadvorgang hängt vom Hostinganbieter ab.

Typischer Ablauf:

1. Webspace oder Subdomain auswählen.
2. Document Root der Anwendung ermitteln.
3. vorhandenen Stand sichern.
4. Inhalte des Releasepakets hochladen.
5. Verzeichnisstruktur beibehalten.
6. HTTPS prüfen.
7. Anwendung über die öffentliche URL öffnen.
8. Browser- und Netzwerktest durchführen.

Beim FTP- oder Webinterface-Upload muss geprüft werden, ob wirklich alle Assets
übertragen wurden. Das Projekt enthält eine größere Anzahl einzelner Dateien.

## Deployment auf einer Subdomain

Bei einer Subdomain muss ihr Document Root auf das Verzeichnis zeigen, in dem
sich `index.html` befindet.

Beispiel:

```text
Subdomain:
sharky.example.de

Document Root:
htdocs/sharky/
```

Erwartete Serverstruktur:

```text
htdocs/
└── sharky/
    ├── index.html
    ├── imprint.html
    ├── robots.txt
    ├── assets/
    ├── js/
    └── styles/
```

Die tatsächliche Domain und der tatsächliche Serverpfad müssen an den
Hostingvertrag angepasst werden.

## Optionales GitHub-Pages-Deployment

Da Sharky eine statische Anwendung ist, kann das Projekt grundsätzlich auch
über GitHub Pages bereitgestellt werden.

Ein möglicher manueller Ablauf:

1. Repository auf GitHub öffnen.
2. `Settings` auswählen.
3. `Pages` öffnen.
4. Veröffentlichung aus einem Branch auswählen.
5. Branch `main` festlegen.
6. Verzeichnis `/ (root)` auswählen.
7. Veröffentlichung speichern.
8. die von GitHub angezeigte URL testen.

Das ist derzeit nicht als verbindlicher Projektworkflow konfiguriert.

Bei GitHub Pages wird das gesamte ausgewählte Stammverzeichnis veröffentlicht,
einschließlich Dateien, die für die Laufzeit nicht erforderlich sind.

## `robots.txt`

Der aktuelle Inhalt lautet:

```text
User-agent: *
Allow: /
```

Damit wird Suchmaschinen das Crawlen der veröffentlichten Anwendung
grundsätzlich erlaubt.

Soll eine Vorschauversion nicht indexiert werden, müsste diese Konfiguration vor
der Veröffentlichung bewusst angepasst werden. Eine solche Änderung gehört in
einen eigenen Commit und muss zur gewünschten Umgebung passen.

`robots.txt` ist keine Zugriffskontrolle. Vertrauliche Dateien dürfen unabhängig
davon nicht veröffentlicht werden.

## Impressum

`imprint.html` ist Bestandteil des Releasepakets und wird aus dem Hauptmenü
verlinkt.

Vor einer Veröffentlichung muss geprüft werden:

- Datei ist erreichbar.
- Link aus dem Hauptmenü funktioniert.
- Zurück-Link funktioniert.
- Stylesheets werden geladen.
- Inhalt entspricht dem freigegebenen Projektstand.

Die Datei wird durch den Deploymentprozess nicht inhaltlich verändert.

## Audio im Browser

Browser erlauben Audiowiedergabe normalerweise erst nach einer
Benutzerinteraktion.

Nach dem Deployment muss deshalb geprüft werden:

1. Seite neu laden.
2. Spiel oder Menü über einen Button bedienen.
3. Musik aktivieren.
4. Soundeffekte auslösen.
5. Bossmusik prüfen.
6. Mute und Lautstärke prüfen.

Ein ausbleibender automatischer Musikstart vor der ersten Benutzerinteraktion
ist nicht automatisch ein Fehler.

## Vollbildmodus

Der Vollbildmodus muss über eine Benutzeraktion gestartet werden.

Zu prüfen sind:

- Vollbildbutton ist aktiv.
- Vollbild kann gestartet werden.
- Vollbild kann beendet werden.
- `aria-pressed` bleibt synchron.
- Layout füllt den Viewport aus.
- mobile Browser verhalten sich korrekt.

Nicht jeder Browser unterstützt die Fullscreen API im gleichen Umfang. Nicht
unterstützte Buttons werden von der Anwendung deaktiviert.

## Local Storage

Anzeige- und Audioeinstellungen werden im Browser gespeichert.

Nach dem Deployment:

1. Theme wechseln.
2. Lautstärke verändern.
3. Audiozustand wechseln.
4. Seite neu laden.
5. gespeicherte Einstellungen prüfen.

Local Storage ist an die jeweilige Origin gebunden. Einstellungen einer lokalen
Version werden nicht automatisch auf eine neue Domain oder Subdomain
übertragen.

## Browser-Cache

Browser können ältere CSS-, JavaScript- oder Assetdateien zwischenspeichern.

Nach einem Deployment sollte zunächst ein vollständiges Neuladen durchgeführt
werden:

```text
Windows:
Strg + F5
```

Zusätzlich kann im Browser unter den Entwicklertools der Cache vorübergehend
deaktiviert werden.

Einige Skripte besitzen bereits Versionsparameter, aber das Projekt verwendet
noch kein durchgängiges automatisches Cache-Busting für alle Dateien.

## Netzwerkprüfung

In den Browser-Entwicklertools sollte der Bereich `Network` geprüft werden.

Es dürfen keine unerwarteten Statuscodes auftreten:

| Status | Bedeutung |
| --- | --- |
| `200` | Datei erfolgreich geladen |
| `304` | Datei unverändert aus Cache verwendet |
| `403` | Zugriff verweigert |
| `404` | Datei oder Pfad nicht gefunden |
| `500` | Serverfehler |

Besondere Aufmerksamkeit benötigen:

- Favicon
- lokale Schriftart
- Hintergrundbilder
- Spieleranimationen
- Gegneranimationen
- Sammelobjekte
- Musikdateien
- Soundeffekte

## Konsolenprüfung

Die Browserkonsole muss nach einem vollständigen Spielablauf fehlerfrei bleiben.

Zu prüfen sind:

- Startseite
- Einstellungen
- Anleitung
- Story
- Levelauswahl
- Level 1
- Shop
- Level 2
- Bosskampf
- Game Over
- Restart
- Gewinnbildschirm
- Rückkehr zum Hauptmenü

Produktionsskripte sollen keine eigenen `console`-Ausgaben enthalten.

## Mobile Deploymentprüfung

Die veröffentlichte Version muss auf einem echten Touch-Gerät geprüft werden.

### Hochformat

- Orientierungshinweis erscheint.
- Seite scrollt nicht hinter dem Hinweis.
- Hinweis ist vollständig lesbar.
- Rotationsgrafik funktioniert.
- reduzierte Bewegung wird respektiert.

### Querformat

- Hinweis verschwindet.
- Canvas bleibt vollständig sichtbar.
- Joystick reagiert.
- drei Angriffstasten reagieren.
- Kontextmenü erscheint nicht.
- HUD und Buttons überlagern sich nicht.
- Pause und Vollbild funktionieren.
- keine Scrollbalken entstehen.

## Funktionale Abnahme

Nach dem Upload muss mindestens ein vollständiger Spielablauf erfolgen:

1. Startseite öffnen.
2. Level 1 starten.
3. Gegner bekämpfen.
4. Münzen und Gift sammeln.
5. Boss besiegen.
6. Shop öffnen.
7. Upgrade kaufen.
8. Level 2 starten.
9. zweiten Boss besiegen.
10. Gewinnbildschirm prüfen.
11. Restart prüfen.
12. Hauptmenü prüfen.

Zusätzlich muss ein Game-Over-Ablauf getestet werden.

## Deployment-Checkliste

### Vor dem Paket

- [ ] Richtiger Branch aktiv
- [ ] Aktueller Stand gepullt
- [ ] Arbeitsverzeichnis geprüft
- [ ] `npm run check` erfolgreich
- [ ] `git diff --check` erfolgreich
- [ ] alle Änderungen committed
- [ ] Änderungen auf GitHub vorhanden

### Releasepaket

- [ ] `index.html` enthalten
- [ ] `imprint.html` enthalten
- [ ] `robots.txt` enthalten
- [ ] `assets/` vollständig enthalten
- [ ] `js/` vollständig enthalten
- [ ] `styles/` vollständig enthalten
- [ ] `index.html` liegt direkt im Release-Stamm
- [ ] ZIP-Datei testweise entpackt
- [ ] lokaler Release-Test erfolgreich

### Nach dem Upload

- [ ] öffentliche URL erreichbar
- [ ] HTTPS aktiv
- [ ] Impressum erreichbar
- [ ] keine 404- oder 500-Fehler
- [ ] Browserkonsole fehlerfrei
- [ ] Bilder vollständig
- [ ] Audio vollständig
- [ ] Desktop getestet
- [ ] Smartphone Hochformat getestet
- [ ] Smartphone Querformat getestet
- [ ] vollständiger Spielablauf getestet
- [ ] Game Over und Restart getestet
- [ ] Local Storage getestet
- [ ] Vollbild getestet

## Fehlerdiagnose

### Weiße oder leere Seite

Prüfen:

- Liegt `index.html` im richtigen Webverzeichnis?
- Wird die richtige Domain aufgerufen?
- Zeigt die Browserkonsole einen JavaScript-Fehler?
- Wurden alle Skripte übertragen?

### Styles fehlen

Prüfen:

- Existiert `styles/` neben `index.html`?
- Stimmen Dateinamen exakt?
- Liefert der Server CSS mit geeignetem MIME-Type?
- Verwendet der Browser eine alte Cacheversion?

### Bilder fehlen

Prüfen:

- Wurde `assets/` vollständig übertragen?
- Stimmen Groß- und Kleinschreibung?
- Enthält der Pfad Leerzeichen?
- Zeigt der Network-Tab einen 404-Fehler?

### Audio fehlt

Prüfen:

- Wurde zuerst eine Benutzerinteraktion ausgeführt?
- Sind Musik und Soundeffekte aktiviert?
- Ist die Lautstärke größer als null?
- Wurden die Audioverzeichnisse übertragen?
- Unterstützt der Server den Dateityp?
- Zeigt der Network-Tab Ladefehler?

### Lokale Version funktioniert, Serverversion nicht

Wahrscheinliche Ursachen:

- abweichende Groß- und Kleinschreibung
- unvollständiger Upload
- falscher Document Root
- falsche Verzeichnisstruktur
- Browser-Cache
- falscher MIME-Type
- Serverberechtigungen

## Rollback

Vor dem Ersetzen einer funktionierenden Version sollte der bisherige
Serverstand gesichert werden.

Bei einem fehlerhaften Release:

1. fehlerhafte Version nicht weiter verändern,
2. vorheriges Releasepaket wieder hochladen,
3. Anwendung erneut prüfen,
4. Ursache lokal untersuchen,
5. Korrektur als neuen Commit erstellen,
6. Tests erneut ausführen,
7. neues Releasepaket erzeugen.

Ein veröffentlichter Git-Commit sollte bei einem normalen Rollback nicht durch
eine umgeschriebene Historie entfernt werden.

Falls eine Codeänderung zurückgenommen werden muss:

```bash
git revert <commit-sha>
```

Danach:

```bash
npm run check
git push origin main
```

## Optionale Release-Tags

Das Repository verwendet derzeit keinen verbindlichen Tagprozess.

Für spätere stabile Versionen können annotierte Tags verwendet werden:

```bash
git tag -a v1.0.0 -m "Release Sharky v1.0.0"
git push origin v1.0.0
```

Vorher muss geprüft werden, ob die Version noch nicht vergeben wurde:

```bash
git tag
```

Ein Release-Tag sollte nur auf einem vollständig getesteten Commit liegen.

## Weiterführende Dokumentation

- [Dokumentationsübersicht](../README.md)
- [Rendering und Assets](../architecture/rendering-assets.md)
- [Interface und Steuerung](../features/interface-controls.md)
- [Audio und Anzeigeeinstellungen](../features/audio-display-settings.md)
- [Tests und Validierung](../engineering/testing-validation.md)
- [Styling und Barrierefreiheit](../engineering/styling-accessibility.md)
- [Entwicklungsworkflow](development-workflow.md)