# Code-Konventionen

Dieses Dokument beschreibt die verbindlichen Code-, Benennungs- und
Dokumentationsstandards von **Sharky – Jump and Swim**.

Die Regeln gelten für:

- produktiven JavaScript-Code
- Konfigurationen
- Tests
- HTML
- CSS
- technische Dokumentation

## Ziele

Die Konventionen sollen sicherstellen, dass der Projektcode:

- verständlich
- nachvollziehbar
- erweiterbar
- testbar
- einheitlich
- reviewbar

bleibt.

Das Projekt verwendet Vanilla JavaScript ohne Framework, Bundler oder statische
Typprüfung. Eine klare Struktur und konsistente Dokumentation sind deshalb
besonders wichtig.

## Aktuell geprüfter Stand

Der aktuelle `main`-Stand wurde projektweit geprüft.

| Prüfung | Ergebnis |
| --- | ---: |
| produktive JavaScript-Dateien | `46` |
| Dateien mit Strict Mode | `46/46` |
| Dateien mit mindestens einem JSDoc-Block | `46/46` |
| produktive Konsolenausgaben | `0` |
| Dateien über 400 Zeilen | `1` |

Aktuelle Abweichung:

```text
js/systems/audio-manager.class.js: 404 Zeilen
```

Die Datei liegt damit vier physische Zeilen über dem bisherigen Zielwert von
maximal 400 Zeilen.

Die übrigen größten Dateien liegen bei höchstens 400 Zeilen.

## Sprache

### Quellcode

Folgende Inhalte werden auf Englisch geschrieben:

- Klassen
- Methoden
- Funktionen
- Variablen
- Konstanten
- Dateinamen
- JSDoc
- technische Fehlermeldungen
- Testnamen

Beispiele:

```js
class EnemySpawner {}

function validateLevelConfig(levelConfig) {}

const maximumPlacementAttempts = 120;
```

### Benutzeroberfläche

Sichtbare Inhalte werden auf Deutsch geschrieben.

Beispiele:

```text
Spiel starten
Hauptmenü
Giftflaschen
Darstellung: Dunkel
```

### Projektdokumentation

Die technische Dokumentation wird auf Deutsch verfasst. Klassen-, Methoden-,
Property- und Dateinamen bleiben in ihrer tatsächlichen englischen Schreibweise.

## JavaScript-Grundlagen

Alle produktiven JavaScript-Dateien beginnen mit:

```js
'use strict';
```

Strict Mode verhindert unter anderem:

- unbeabsichtigte globale Variablen
- stillschweigende ungültige Zuweisungen
- verschiedene veraltete JavaScript-Verhaltensweisen

Test- und Validierungsdateien verwenden `.mjs`. ECMAScript-Module arbeiten
bereits automatisch im Strict Mode.

## Formatierung

Der Projektcode verwendet:

- vier Leerzeichen Einrückung
- einfache Anführungszeichen in JavaScript
- Semikolon am Ende von Anweisungen
- geschweifte Klammern für Kontrollblöcke
- eine Anweisung pro Zeile
- mehrzeilige Formatierung für lange Aufrufe
- abschließende Zeilenumbrüche

Beispiel:

```js
const horizontalDistance = Math.abs(
    movement.getCenterX() - movement.getObjectCenterX(player)
);
```

Lange Ausdrücke werden lesbar umgebrochen, statt die vollständige Logik in
einer schwer lesbaren Zeile abzulegen.

## Benennung

### Klassen

Klassen verwenden `PascalCase`.

```js
class GameState {}
class CollisionManager {}
class DisplaySettingsController {}
```

### Methoden und Funktionen

Methoden und Funktionen verwenden `camelCase`.

```js
updateActiveGame();
createInitialPopulation();
isValidSpawnPosition();
```

### Variablen und Properties

Variablen und Objekteigenschaften verwenden ebenfalls `camelCase`.

```js
currentLevel
activeAttacks
previousGameStatus
```

### Konstanten

Globale, unveränderliche Konfigurationsobjekte verwenden
`UPPER_SNAKE_CASE`.

```js
GAME_CONFIG
LEVEL_CONFIG
ASSET_CONFIG
END_BOSS_STATES
GAME_CLOCK
```

Normale lokale `const`-Variablen bleiben in `camelCase`.

### Boolesche Werte

Boolesche Namen beginnen bevorzugt mit:

- `is`
- `has`
- `can`
- `should`
- `was`

Beispiele:

```js
isPaused
hasBeenIntroduced
canDealContactDamage()
shouldEnableTouchControls()
wasPlayingBeforeSettings
```

### Getter und Abfragen

Methoden, die einen Wert zurückgeben, verwenden eindeutige Präfixe:

- `get`
- `create`
- `is`
- `has`
- `can`
- `should`

Beispiele:

```js
getVisibleBounds();
createStatusBars();
isAnimationFinished();
hasRemainingBudget();
canTakeDamage();
shouldChase();
```

### Ereignisbehandlung

Eventmethoden verwenden bevorzugt:

- `handle`
- `bind`
- `toggle`
- `open`
- `close`

Beispiele:

```js
handleKeyDown();
bindApplicationEvents();
toggleFullscreen();
openMainMenuPanel();
closeIngameSettingsDialog();
```

### Zustandsänderungen

Methoden mit klarer Zustandsänderung verwenden:

- `set`
- `reset`
- `start`
- `stop`
- `update`
- `apply`

Beispiele:

```js
setGameOver();
resetAllInputs();
startNextLevel();
stopSoundEffects();
updateBossAudio();
applyPoison();
```

## Dateibenennung

Dateien verwenden beschreibende Namen in `kebab-case`.

### Klassen

Klassen verwenden das Suffix:

```text
.class.js
```

Beispiele:

```text
game-state.class.js
enemy-spawner.class.js
mobile-controls.class.js
```

### Konfiguration

Konfigurationsdateien verwenden:

```text
*-config.js
```

Beispiele:

```text
game-config.js
level-config.js
asset-config.js
```

### Level

Leveldateien verwenden ausgeschriebene Namen:

```text
level-one.js
level-two.js
```

### Tests

Testdateien verwenden:

```text
*.test.mjs
```

Beispiele:

```text
audio-manager.test.mjs
enemy-spawner.test.mjs
game-lifecycle.test.mjs
```

### Hilfs- und Validierungsdateien

Node.js-Hilfsdateien verwenden `.mjs`.

```text
test-helpers.mjs
validate-project.mjs
```

## Verzeichnisregeln

Produktiver Code wird nach fachlicher Verantwortung abgelegt.

```text
js/
├── config/
├── core/
├── entities/
├── game/
├── input/
├── levels/
├── systems/
└── ui/
```

### `config`

Enthält Werte und Pfade, die unabhängig von der Klassenimplementierung
angepasst werden können.

### `core`

Enthält Basisklassen und allgemeine technische Grundlagen.

### `entities`

Enthält konkrete Objekte der Spielwelt.

### `game`

Enthält Ablauf, Zustand, Kamera, Level und Rendering.

### `input`

Enthält Eingabequellen und normalisierte Eingabestatus.

### `levels`

Enthält den konkreten Aufbau der spielbaren Riffzonen.

### `systems`

Enthält Logik, die mehrere Entities oder Fachbereiche koordiniert.

### `ui`

Enthält DOM-bezogene Controller und Oberflächenlogik.

Eine Datei wird nicht aufgrund ihres Namens, sondern aufgrund ihrer
Verantwortung eingeordnet.

## Klassenverantwortung

Eine Klasse soll einen klar abgegrenzten Aufgabenbereich besitzen.

Beispiele:

| Klasse | Verantwortung |
| --- | --- |
| `Game` | Spielablauf koordinieren |
| `GameState` | Sitzungszustand speichern |
| `GameRenderer` | Spielwelt rendern |
| `GameStatusRenderer` | Canvas-Statusleisten rendern |
| `CollisionManager` | Kollisionen verarbeiten |
| `EnemySpawner` | Spawnablauf verwalten |
| `EnemySpawnPositionFinder` | sichere Spawnposition suchen |
| `UiEventBinder` | DOM-Ereignisse registrieren |
| `UiStatusController` | UI-Status synchronisieren |

Die Aufteilung verhindert, dass eine zentrale Klasse gleichzeitig:

- Fachzustand
- Rendering
- DOM-Zugriff
- Audio
- Eingaben
- Persistenz

verwaltet.

## Konstruktoren

Konstruktoren sollen nur den initialen Zustand erzeugen und größere
Initialisierungsschritte delegieren.

Beispiel:

```js
constructor(config = {}) {
    this.configureCombat(config);
    this.initializeStatusEffects();
    this.configureAppearance(config);
    this.initializeEnemyMovement(config);
    this.prepareAnimations();
}
```

Längere Initialisierungen werden in sprechende Methoden zerlegt.

## Methodengröße

Methoden und Funktionen sollen klein bleiben und eine einzelne Aufgabe
erledigen.

Der projektinterne Zielwert lautet:

```text
höchstens 14 Implementierungszeilen pro Funktion oder Methode
```

Längere Abläufe werden in benannte Teilschritte zerlegt.

Beispiel:

```js
updateActiveGame() {
    this.updatePlayer();
    this.updateCamera();
    this.updateAttacks();
    this.updateLevel();
    this.updateCollisions();
    this.updateGameStatus();
}
```

Die aufgerufenen Methoden beschreiben gleichzeitig die fachliche Reihenfolge.

Die Funktionslänge wird aktuell nicht automatisiert durch `npm run check`
kontrolliert und muss bei Reviews zusätzlich geprüft werden.

## Dateigröße

Der projektinterne Zielwert für produktive JavaScript-Dateien lautet:

```text
maximal 400 physische Zeilen
```

Große Dateien werden nach fachlicher Verantwortung aufgeteilt.

Bereits erfolgte Auslagerungen sind beispielsweise:

- `GameStatusRenderer` aus `GameRenderer`
- `EnemySpawnPositionFinder` aus `EnemySpawner`
- `UiAudioControls` aus `UiController`
- `UiEventBinder` aus `UiController`
- `UiStatusController` aus `UiController`

Aktuell liegt `audio-manager.class.js` bei 404 Zeilen und sollte bei einer
späteren Überarbeitung wieder unter den Grenzwert gebracht werden.

## Frühe Rückgaben

Ungültige oder nicht anwendbare Fälle werden bevorzugt früh beendet.

Beispiel:

```js
if (!this.canAttackHitTarget(attack, target)) {
    return;
}

this.applyAttackHit(attack, target);
```

Frühe Rückgaben reduzieren:

- Verschachtelung
- schwer lesbare `else`-Blöcke
- mehrfach wiederholte Bedingungen

## Positive Methodennamen

Bedingungen werden bevorzugt über positiv formulierte Methoden ausgedrückt.

```js
canSpawnEnemy();
isCooldownReady();
hasActiveEndboss();
```

Dadurch bleiben Aufrufer verständlich:

```js
if (!this.canSpawnEnemy(player, currentTime)) {
    return;
}
```

## Methodenparameter

Methoden erhalten nur die Daten, die sie tatsächlich benötigen.

Wenn mehrere eng zusammengehörige Konfigurationswerte übergeben werden,
verwendet das Projekt ein Objekt:

```js
new Enemy({
    x,
    y,
    type,
    width,
    height,
    damage,
    health,
    movement
});
```

Dadurch bleibt die Reihenfolge zahlreicher Einzelparameter nachvollziehbar.

## Standardparameter

Optionale Argumente erhalten sichere Standardwerte.

```js
constructor(config = {}) {}

update(player = null, visibleBounds = null) {}

constructor(audioManager = null) {}
```

Die Methode bleibt dadurch auch in isolierten Tests verwendbar.

## Optional Chaining

Optionale Abhängigkeiten werden mit `?.` angesprochen, wenn ihr Fehlen erlaubt
ist.

```js
this.audioManager?.playSound('bossIntro');
this.level.endboss?.isIntroducing;
```

Optionale Abhängigkeiten dürfen keine Laufzeitfehler verursachen.

## Konfiguration statt Magic Numbers

Wiederverwendbare Spielwerte werden nicht verteilt in Klassen hinterlegt.

Sie gehören in:

- `GAME_CONFIG`
- `LEVEL_CONFIG`
- `ASSET_CONFIG`

Beispiel:

```js
this.speed = GAME_CONFIG.playerSpeed;
```

Levelabhängige Unterschiede gehören in `LEVEL_CONFIG`, nicht in allgemeine
Entity-Klassen.

## Zustandskonstanten

Geschlossene Zustandsmengen werden als unveränderliche Konstanten definiert.

```js
const END_BOSS_STATES = Object.freeze({
    IDLE: 'idle',
    INTRODUCE: 'introduce',
    CHASE: 'chase',
    ATTACK: 'attack',
    HURT: 'hurt',
    RETURN: 'return',
    DEAD: 'dead'
});
```

Dies reduziert Tippfehler und macht erlaubte Zustände sichtbar.

## JSDoc

Alle produktiven JavaScript-Dateien enthalten mindestens einen JSDoc-Block.

JSDoc wird verwendet für:

- Klassen
- öffentliche oder relevante Methoden
- Funktionen
- Parameter
- Rückgabewerte
- optionale Standardwerte
- Vererbung
- Fehlerfälle
- globale Konstanten

### Klassendokumentation

```js
/**
 * Represents an animated enemy with movement, combat, status, and rendering
 * behavior shared by regular enemies and the end boss.
 *
 * @extends AnimatedDrawableObject
 */
class Enemy extends AnimatedDrawableObject {}
```

### Methodendokumentation

```js
/**
 * @param {number} damage - Damage points to subtract.
 * @returns {void}
 */
takeDamage(damage) {}
```

### Rückgabewerte

```js
/**
 * @returns {boolean} Whether the player has remaining health.
 */
isAlive() {}
```

### Optionale Parameter

```js
/**
 * @param {AudioManager|null} [audioManager=null] - Game audio controller.
 */
constructor(audioManager = null) {}
```

### Konfigurationsobjekte

```js
/**
 * @param {Object} config - Attack configuration.
 * @param {number} config.x - Initial horizontal position.
 * @param {number} config.y - Initial vertical position.
 */
```

### Fehler

```js
/**
 * @throws {Error} When the requested enemy type is unknown.
 */
```

## JSDoc-Regeln

- Beschreibungen werden auf Englisch geschrieben.
- Die Beschreibung erklärt Zweck oder Verhalten.
- Parameternamen entsprechen exakt der Methodensignatur.
- Rückgabewerte erhalten `@returns`.
- Vererbung wird mit `@extends` dokumentiert.
- optionale Werte werden mit eckigen Klammern angegeben.
- Defaultwerte werden sichtbar dokumentiert.
- `null` wird in Typangaben berücksichtigt, wenn es erlaubt ist.
- geworfene Fehler werden mit `@throws` dokumentiert.
- triviale Kommentare ersetzen keine verständlichen Methodennamen.

Ein vorhandener JSDoc-Block allein garantiert keine vollständige oder fachlich
korrekte Dokumentation. Änderungen an Signaturen müssen deshalb zusammen mit
dem JSDoc aktualisiert werden.

## Kommentare

Kommentare sollen erklären:

- warum eine Entscheidung notwendig ist
- welche Einschränkung berücksichtigt wird
- welcher fachliche Zweck erfüllt wird

Nicht sinnvoll sind Kommentare, die nur den folgenden Code wiederholen.

Weniger hilfreich:

```js
// Sets isPaused to true
this.isPaused = true;
```

Besser:

```js
/** Freezes game time only after a valid pause transition. */
```

Historische, auskommentierte Implementierungen sollen nicht im
Produktionscode verbleiben.

## Fehlerbehandlung

Erwartbare Browserfehler werden kontrolliert behandelt.

Beispiele:

- blockierter Local Storage
- abgelehnte Audiowiedergabe
- nicht unterstützte Fullscreen API
- nicht unterstützte Speech API
- fehlende optionale DOM-Elemente

Fehler dürfen nicht durch leere globale Catch-Blöcke versteckt werden, wenn sie
auf eine ungültige Projektkonfiguration hinweisen.

Konfigurationsfehler werden deshalb ausdrücklich geworfen:

```js
throw new Error(`[LEVEL_CONFIG] ${message}`);
```

## DOM-Zugriff

DOM-Zugriff verbleibt in:

- `main.js`
- Input-Controllern
- UI-Controllern

Spielentities und Fachsysteme sollen keine Menüelemente direkt verändern.

Elemente werden bevorzugt über:

- eindeutige IDs
- `data-*`-Attribute
- semantische Selektoren

angesprochen.

Beispiele:

```js
document.getElementById('gameCanvas');

document.querySelectorAll('[data-upgrade]');

document.querySelectorAll('[data-display-action]');
```

## Eventregistrierung

Inline-Eventhandler im HTML werden vermieden.

Listener werden über JavaScript gebunden:

```js
button.addEventListener('click', callback);
```

`UiEventBinder` bündelt die Registrierung der Interfaceaktionen. Die
ausgeführte Fachaktion wird an `UiController` delegiert.

## Datenattribute

Wiederverwendbare UI-Aktionen werden über `data-*` beschrieben.

Beispiele:

```html
data-start-level="1"
data-main-panel="settingsPanel"
data-upgrade="speedBoost"
data-mobile-action="slap"
data-display-action="fullscreen"
```

Der HTML-Code beschreibt damit die Aktion, während JavaScript die Verarbeitung
übernimmt.

## Abhängigkeiten

Abhängigkeiten werden nach Möglichkeit über Konstruktoren übergeben.

Beispiele:

```js
new Game(canvas, keyboard, statusCallback, audioManager);

new CollisionManager(audioManager);

new UiController(
    game,
    audioManager,
    storyNarrator,
    screenManager
);
```

Das verbessert:

- Testbarkeit
- Austauschbarkeit
- sichtbare Verantwortlichkeiten

Globale Konfigurationen und die gemeinsame Spieluhr bleiben aufgrund der
klassischen Scriptarchitektur global verfügbar.

## Scriptreihenfolge

Das Projekt verwendet keine ES-Module für den Browsercode.

Die Reihenfolge in `index.html` ist deshalb verbindlich:

```text
Konfigurationen
    ↓
Basisklassen
    ↓
Entities
    ↓
Systeme
    ↓
Level
    ↓
Game
    ↓
UI und main.js
```

Eine Klasse darf nicht vor ihrer Basisklasse oder benötigten Konfiguration
geladen werden.

Neue Dateien müssen:

1. an der fachlich richtigen Stelle eingebunden werden
2. durch `npm run validate` geprüft werden
3. im Browser ohne Referenzfehler starten

## Keine produktiven Konsolenausgaben

Produktive Dateien enthalten keine Aufrufe von:

```text
console.log
console.debug
console.info
console.warn
console.error
```

Der aktuelle geprüfte Stand enthält keine solchen Aufrufe.

Debugdaten werden stattdessen kontrolliert über den optionalen
Canvas-Debugmodus dargestellt.

## Tests

Tests verwenden:

- `node:test`
- `node:assert/strict`
- `.test.mjs`
- beschreibende englische Testnamen

Beispiel:

```js
test('restart prepares the current level without reloading the page', () => {
    // Testaufbau und Erwartungen
});
```

Tests werden nach dem geprüften Fachbereich benannt und nicht nach internen
Zwischenschritten.

Gemeinsam verwendete Testlogik liegt in:

```text
tests/test-helpers.mjs
```

## CSS-Konventionen

CSS-Dateien sind nach ihrer Verantwortung getrennt:

```text
base.css
main-menu.css
layout.css
game.css
components.css
responsive.css
orientation.css
menu-screen.css
```

CSS-Klassen verwenden `kebab-case`.

```css
.mobile-controls {}
.ingame-control-rail {}
.orientation-notice {}
```

Zustandsklassen verwenden sprechende Namen:

```css
.hidden {}
.is-active {}
.is-fullscreen {}
.has-touch-controls {}
```

Globale Farben, Abstände und wiederverwendbare Werte werden über
CSS-Custom-Properties gepflegt.

## HTML-Konventionen

HTML verwendet:

- semantische Strukturelemente
- echte Buttons für Aktionen
- echte Links für Navigation
- IDs für eindeutige Controllerziele
- `data-*` für wiederverwendbare Aktionen
- `aria-label` für Iconbuttons und Gruppen
- `aria-pressed` für Umschaltzustände
- beschreibende Alternativtexte
- dekorative Bilder mit leerem `alt`

Ein Button darf nicht durch ein nicht semantisches Element mit Click-Handler
ersetzt werden.

## Dokumentationskonventionen

Technische Dokumente verwenden:

- beschreibende Dateinamen
- eine H1-Überschrift pro Datei
- relative Repository-Links
- Tabellen für exakte Zuordnungen
- Codeblöcke für Befehle und Strukturen
- Mermaid nur für wichtige Abläufe und Beziehungen
- bekannte Grenzen statt erfundener Vollständigkeit
- Querverweise auf zuständige Fachdokumente

Historische Arbeitsnotizen gehören nicht in die finale technische
Dokumentation.

## Qualitätsprüfung

Vor einem Commit oder Push werden mindestens ausgeführt:

```bash
npm run check
git diff --check
git status --short
```

Die Prüfungen ersetzen keine manuelle Kontrolle der Konventionen.

Zusätzlich zu prüfen sind:

- verständliche Benennung
- aktuelle JSDoc-Kommentare
- Methodengröße
- Dateigröße
- klare Verantwortlichkeit
- keine auskommentierten Altimplementierungen
- keine unnötigen globalen Zustände
- korrekte Scriptreihenfolge

## Bekannte Grenzen

- Es existiert aktuell keine ESLint-Konfiguration.
- Es existiert kein automatischer Formatierungsbefehl.
- JSDoc wird nicht durch einen Typechecker validiert.
- Methodengrößen werden nicht automatisiert gemessen.
- Der 400-Zeilen-Grenzwert wird nicht durch `npm run check` erzwungen.
- `audio-manager.class.js` liegt aktuell bei 404 physischen Zeilen.
- Browsercode verwendet globale Klassen statt ES-Module.
- Scriptabhängigkeiten werden manuell über `index.html` geordnet.
- Konventionen benötigen deshalb weiterhin bewusste Code-Reviews.

## Weiterführende Dokumentation

- [Anwendungsarchitektur](../architecture/application.md)
- [Tests und Projektvalidierung](testing-validation.md)
- [Styling und Barrierefreiheit](styling-accessibility.md)
- [Entwicklungsworkflow](../operations/development-workflow.md)
- [Deployment](../operations/deployment.md)