# Styling, Responsiveness und Barrierefreiheit

Dieses Dokument beschreibt den Aufbau der CSS-Architektur, die responsiven
Darstellungsregeln und die vorhandenen Maßnahmen zur Barrierefreiheit von
Sharky – Jump and Swim.

Die Oberfläche ist für Desktop, Tablet und mobile Touch-Geräte ausgelegt. Das
eigentliche Spiel verwendet auf mobilen Geräten ausschließlich das Querformat.

## Stylesheet-Struktur

Die Anwendung bindet acht Stylesheets in einer festgelegten Reihenfolge ein:

```html
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/main-menu.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/game.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/responsive.css">
<link rel="stylesheet" href="styles/orientation.css">
<link rel="stylesheet" href="styles/menu-screen.css">
```

| Datei | Verantwortungsbereich |
| --- | --- |
| `base.css` | Fonts, Farbvariablen, Themes und globale Grundeinstellungen |
| `main-menu.css` | Grundaufbau von Startseite, Panels und Navigation |
| `layout.css` | Seitenlayout, Karten, Header und Typografie |
| `game.css` | Canvas, HUD, Ingame-Steuerung und Einstellungsdialog |
| `components.css` | Buttons, Overlays, Shop und mobile Steuerung |
| `responsive.css` | Breakpoints, Querformat und reduzierte Bewegung |
| `orientation.css` | Hinweis für mobile Geräte im Hochformat |
| `menu-screen.css` | Menüanimation, Anleitungsdarstellung und Fokuszustände |

Die Reihenfolge ist relevant. Später eingebundene Dateien können frühere Regeln
für spezielle Viewports oder Komponenten überschreiben.

## CSS-Grundprinzipien

Das Styling verwendet:

- CSS Custom Properties
- Flexbox
- CSS Grid
- responsive `clamp()`-Werte
- `aspect-ratio`
- Viewport-Einheiten
- Media Queries
- attributbasierte Themes
- reduzierte Bewegungen
- Safe-Area-Abstände
- semantische Zustandsklassen

Globale Größenberechnung:

```css
* {
    box-sizing: border-box;
}
```

Damit schließen definierte Breiten und Höhen Padding und Border ein.

## Designvariablen

Die zentralen Designwerte sind in `:root` definiert:

```css
:root {
    color-scheme: dark;
    --color-background: #041923;
    --color-surface: rgba(6, 42, 58, 0.92);
    --color-surface-light: rgba(15, 82, 110, 0.85);
    --color-primary: #29d3ff;
    --color-primary-dark: #049cc2;
    --color-text: #f1fbff;
    --color-muted: #a9d6e5;
    --color-border: rgba(255, 255, 255, 0.16);
    --shadow-card: 0 24px 80px rgba(0, 0, 0, 0.35);
    --border-radius-large: 28px;
    --border-radius-medium: 18px;
    --font-main: Arial, Helvetica, sans-serif;
    --font-display: "Luckiest Guy", Arial, Helvetica, sans-serif;
}
```

Komponenten greifen auf diese Variablen zurück, anstatt zentrale Farben,
Schatten und Rundungen mehrfach zu definieren.

## Lokale Schriftart

Die dekorative Überschriftenschrift wird lokal geladen:

```css
@font-face {
    font-family: "Luckiest Guy";
    src: url("../assets/fonts/luckiest-guy-regular.ttf")
        format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

`font-display: swap` verhindert, dass Texte während des Ladens unsichtbar
bleiben.

Falls die lokale Schriftart nicht geladen werden kann, stehen Arial, Helvetica
und generische Sans-Serif-Schriften als Fallback bereit.

## Dunkel- und Hellmodus

Der Dunkelmodus ist das Standardfarbschema.

Der Hellmodus wird über ein Attribut am Wurzelelement aktiviert:

```html
<html data-theme="light">
```

Die zugehörigen Variablen werden überschrieben:

```css
:root[data-theme="light"] {
    color-scheme: light;
    --color-background: #dff6fc;
    --color-surface: rgba(239, 252, 255, 0.94);
    --color-primary: #006f91;
    --color-text: #082c3a;
    --color-muted: #3c6573;
}
```

Der `DisplaySettingsController` berücksichtigt:

1. eine gespeicherte manuelle Auswahl,
2. die Systempräferenz des Browsers,
3. den Dunkelmodus als sichere Standardauswahl.

Die Systempräferenz wird über folgende Media Query ausgelesen:

```js
window.matchMedia('(prefers-color-scheme: light)');
```

Eine manuelle Auswahl wird unter diesem Schlüssel gespeichert:

```text
sharky-display-theme
```

Die Theme-Buttons werden über `aria-pressed` mit dem Zustand synchronisiert.

```html
<button data-display-action="theme"
    aria-pressed="true">
    Darstellung: Dunkel
</button>
```

## Farbkontrast

Textfarben unterscheiden zwischen normalem und weniger wichtigem Inhalt:

```css
color: var(--color-text);
color: var(--color-muted);
```

Interaktive Elemente verwenden zusätzlich Hintergründe, Border und
Hover-Zustände.

Die verwendeten Farben sind auf gute Lesbarkeit ausgelegt. Eine vollständige
WCAG-Kontrastmessung für jede Kombination wurde jedoch nicht automatisiert
durchgeführt.

Vor der finalen Veröffentlichung sollten insbesondere folgende Kombinationen
manuell gemessen werden:

- gedämpfter Text auf transparenten Karten
- Text auf animiertem Menühintergrund
- deaktivierte Buttons
- mobile Buttons über dem Canvas
- Hellmodus mit transparenten Oberflächen

## Typografie

Überschriften verwenden responsive Größen:

```css
h1 {
    font-size: clamp(2rem, 5vw, 4rem);
}

h2 {
    font-size: clamp(1.7rem, 4vw, 3rem);
}
```

`clamp()` begrenzt die Schriftgröße zwischen einem Mindest- und einem
Maximalwert. Dadurch bleibt der Text auf kleinen Geräten lesbar, ohne auf großen
Bildschirmen unkontrolliert zu wachsen.

Fließtext verwendet:

```css
p {
    color: var(--color-muted);
    line-height: 1.6;
}
```

Die erhöhte Zeilenhöhe verbessert die Lesbarkeit längerer Beschreibungen.

## Layoutsystem

Das zentrale Seitenlayout verwendet Flexbox:

```css
.page-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
}
```

Spiel- und Impressumskarten besitzen eine begrenzte Breite:

```css
.game-card,
.legal-card {
    width: min(100%, 1100px);
}
```

Dadurch füllen sie kleine Viewports aus, werden auf großen Bildschirmen aber
nicht unbegrenzt breit.

## Canvas-Skalierung

Der Canvas besitzt eine interne Auflösung von 960 × 540 Pixeln:

```html
<canvas id="gameCanvas" width="960" height="540">
    Dein Browser unterstützt kein Canvas.
</canvas>
```

Das entspricht einem Seitenverhältnis von 16:9.

Die sichtbare Größe wird durch CSS angepasst:

```css
#gameCanvas {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
}
```

Die interne Spielauflösung bleibt dadurch stabil, während der Canvas passend zum
verfügbaren Platz skaliert wird.

Der Inhalt zwischen den Canvas-Tags dient als Fallback für Browser ohne
Canvas-Unterstützung. Er stellt jedoch keine barrierefreie Alternative zum
gesamten Spielgeschehen dar.

## Responsive Breakpoints

| Bedingung | Zweck |
| --- | --- |
| `max-width: 1180px` | Aktivierung geeigneter Touch-Steuerungen |
| `max-width: 980px` | Einspaltiges Hero-Layout und zweispaltige Navigation |
| `max-width: 900px` | Shop-, Panel- und Anleitungskarten einspaltig |
| `max-width: 760px` | Allgemeines mobiles Seiten- und HUD-Layout |
| `max-width: 520px` | Kleinere Touch-Steuerung und Buttons |
| `max-height: 620px` und Querformat | Kompaktes mobiles Spiellayout |
| `max-height: 430px` und Querformat | Stark reduziertes Layout für niedrige Displays |
| `prefers-reduced-motion: reduce` | Animationen und Übergänge minimieren |

Die Regeln orientieren sich nicht ausschließlich an bestimmten Gerätenamen.
Entscheidend sind der verfügbare Platz, das Seitenverhältnis und die erkannte
Touch-Unterstützung.

## Verhalten bis 980 Pixel

Bis zu einer Breite von 980 Pixeln wechselt das Hauptmenü von zwei Bereichen zu
einem einspaltigen Aufbau:

```css
@media (max-width: 980px) {
    .main-menu-hero {
        grid-template-columns: 1fr;
    }

    .main-menu-navigation {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

Die Navigation bleibt zunächst zweispaltig, während Hero-Inhalt und Navigation
untereinander dargestellt werden.

## Verhalten bis 900 Pixel

Shop, Auswahlkarten und Anleitungen wechseln in eine Spalte:

```css
@media (max-width: 900px) {
    .shop-grid,
    .panel-grid,
    .instruction-grid {
        grid-template-columns: 1fr;
    }
}
```

Dadurch bleiben Karteninhalte lesbar und Buttons erhalten ausreichend Platz.

## Verhalten bis 760 Pixel

Bis zu 760 Pixeln werden unter anderem angepasst:

- Seitenabstände
- Kartenabstände
- Überschriftengrößen
- Headerausrichtung
- HUD-Größe
- Ingame-Schnellzugriff
- Dialogpositionen
- Menüaktionen

Der Spielheader wechselt in eine vertikale Darstellung:

```css
.game-header {
    align-items: flex-start;
    flex-direction: column;
}
```

Die Ingame-Steuerung wird kompakter und zweispaltig:

```css
.ingame-control-rail {
    top: 8px;
    right: 8px;
    grid-template-columns: repeat(2, 38px);
}
```

Der ausführliche Status wird ausgeblendet:

```css
#statusDisplay {
    display: none;
}
```

Leben, Level, Münzen und Gift bleiben weiterhin sichtbar.

## Verhalten bis 520 Pixel

Auf sehr schmalen Geräten werden Joystick und Angriffstasten verkleinert:

```css
.mobile-joystick {
    width: 88px;
    height: 88px;
}

.mobile-action-button {
    min-width: 52px;
    min-height: 46px;
}
```

Der Abstand zum unteren Bildschirmrand berücksichtigt Geräte mit abgerundeten
Displays oder Home-Indikator:

```css
padding: 12px 10px max(
    12px,
    env(safe-area-inset-bottom)
);
```

## Mobiles Querformat

Bei einer Höhe von höchstens 620 Pixeln und aktivem Querformat wird das
Spiel nahezu bildschirmfüllend dargestellt.

```css
@media (max-height: 620px) and (orientation: landscape) {
    .page-layout {
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        padding: 0;
    }

    .game-header {
        display: none;
    }
}
```

Die Spielkarte wird auf das 16:9-Seitenverhältnis begrenzt:

```css
.game-card {
    width: min(100vw, calc(100dvh * 16 / 9));
}
```

HUD, Buttons und Touch-Steuerung liegen direkt über dem Canvas und werden
platzsparend dargestellt.

## Sehr niedrige Querformate

Bei höchstens 430 Pixeln Höhe werden zusätzliche Menüinhalte reduziert:

```css
@media (max-height: 430px) and (orientation: landscape) {
    .hero-feature-list,
    .hero-text {
        display: none;
    }
}
```

Joystick und Angriffstasten werden nochmals verkleinert, damit sie die
Spielfläche nicht übermäßig verdecken.

## Erkennung von Touch-Steuerungen

Die CSS-Regeln allein entscheiden nicht, ob die mobile Steuerung angezeigt wird.

JavaScript ergänzt bei geeigneten Geräten folgende Klasse:

```html
<html class="has-touch-controls">
```

Nur wenn diese Klasse vorhanden ist und die unterstützte Breite nicht
überschritten wird, erscheinen die Touch-Steuerelemente:

```css
@media (max-width: 1180px) {
    html.has-touch-controls .mobile-controls {
        display: flex;
    }

    html:not(.has-touch-controls) .mobile-controls {
        display: none;
    }
}
```

Dadurch bleibt die mobile Steuerung auf normalen Desktopgeräten verborgen.

## Touch-Verhalten

Die mobile Steuerung verhindert unerwünschte Browseraktionen:

```css
.mobile-controls,
.mobile-action-button,
.mobile-joystick {
    touch-action: none;
    user-select: none;
    -webkit-touch-callout: none;
}
```

Damit werden insbesondere reduziert:

- Textmarkierungen
- Kontextmenüs durch langes Drücken
- konkurrierende Scroll- und Zoomgesten
- unerwünschte Browserinteraktionen während der Steuerung

Der äußere Steuerungsbereich verwendet:

```css
pointer-events: none;
```

Joystick und Angriffstasten aktivieren ihre Pointer Events gezielt wieder:

```css
pointer-events: auto;
```

Freie Canvasbereiche bleiben dadurch weiterhin erreichbar.

## Hochformat-Hinweis

Auf geeigneten Touch-Geräten wird das Spiel im Hochformat durch einen Hinweis
überlagert:

```html
<aside id="orientationNotice"
    class="orientation-notice"
    role="alert"
    aria-live="polite">
    <h1>Gerät drehen</h1>
    <p>
        Sharky kann auf Mobilgeräten nur im Querformat gespielt werden.
    </p>
</aside>
```

Die Anzeige wird durch folgende Bedingung aktiviert:

```css
@media (max-width: 1180px) and (orientation: portrait) {
    html.has-touch-controls .orientation-notice {
        display: grid;
    }
}
```

Während der Hinweis sichtbar ist, wird das Scrollen des Body verhindert:

```css
html.has-touch-controls body {
    overflow: hidden;
}
```

`role="alert"` und `aria-live="polite"` ermöglichen unterstützenden
Technologien, den Hinweis wahrzunehmen.

## Reduzierte Bewegung

Die Anwendung berücksichtigt die Betriebssystemeinstellung für reduzierte
Bewegungen:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

Die Rotationsanimation des Orientierungshinweises wird vollständig deaktiviert:

```css
@media (prefers-reduced-motion: reduce) {
    .orientation-device {
        transform: rotate(90deg);
        animation: none;
    }
}
```

Die Information bleibt dadurch sichtbar, ohne eine dauerhafte Bewegung zu
erzwingen.

Die Einstellung betrifft CSS-Animationen und CSS-Übergänge. Canvas-Animationen
müssen bei einer späteren Erweiterung separat bewertet werden.

## Vollbildmodus

Der Vollbildmodus wird über die Browser Fullscreen API gesteuert.

Bei aktivem Vollbild erhält das Wurzelelement folgende Klasse:

```html
<html class="is-fullscreen">
```

Die Seite wird anschließend angepasst:

```css
html.is-fullscreen body {
    overflow: hidden;
}

html.is-fullscreen .page-layout {
    min-height: 100dvh;
    padding: 0;
}

html.is-fullscreen .game-card {
    max-height: 100dvh;
    border-radius: 0;
}
```

Nicht unterstützte Vollbildbuttons werden vom
`DisplaySettingsController` deaktiviert.

Der sichtbare Text, `aria-label` und `aria-pressed` werden bei Änderungen
synchronisiert.

## Semantische HTML-Grundlage

Das Dokument verwendet Deutsch als Inhaltssprache:

```html
<html lang="de">
```

Weitere Metadaten:

```html
<meta name="viewport"
    content="width=device-width, initial-scale=1.0">
<meta name="description"
    content="Sharky ist ein responsives 2D-Unterwasserspiel mit Vanilla JavaScript, OOP und HTML5 Canvas.">
<meta name="color-scheme" content="dark light">
```

Die Oberfläche verwendet unter anderem:

- `main`
- `section`
- `header`
- `nav`
- `aside`
- `article`
- `button`
- `a`
- `label`
- `input`
- `canvas`
- `blockquote`
- Überschriftenhierarchien

Native HTML-Elemente werden bevorzugt, weil sie grundlegende Tastatur- und
Screenreaderfunktionen bereits mitbringen.

## Beschriftungen interaktiver Elemente

Icon-Buttons besitzen verständliche Beschriftungen:

```html
<button id="openSettingsButton"
    aria-label="Einstellungen öffnen">
    ⚙
</button>
```

Weitere Beispiele:

```html
aria-label="Fenster schließen"
aria-label="Audio an oder aus"
aria-label="Vollbild aktivieren"
aria-label="Spiel pausieren oder fortsetzen"
```

Die sichtbaren Symbole sind dadurch nicht die einzige Informationsquelle.

## Zustandsinformationen

Umschaltbare Buttons verwenden `aria-pressed`:

```html
<button data-display-action="theme"
    aria-pressed="true">
    Darstellung: Dunkel
</button>
```

Verwendete Zustände umfassen:

- Audio an oder aus
- Dunkel- oder Hellmodus
- Vollbild an oder aus

JavaScript aktualisiert diese Attribute zusammen mit dem sichtbaren Zustand.

## Formularbeschriftungen

Lautstärkeregler sind über `label` und `for` mit dem jeweiligen Eingabefeld
verbunden:

```html
<label class="range-control"
    for="musicVolumeSlider">
    <span>Musiklautstärke</span>

    <input id="musicVolumeSlider"
        type="range"
        min="0"
        max="100"
        value="40">
</label>
```

Die Beschriftung kann dadurch auch von unterstützenden Technologien zugeordnet
werden.

## Gruppierte Steuerungen

Touch-Steuerelemente sind als zusammengehörende Gruppen ausgezeichnet:

```html
<div class="mobile-controls"
    role="group"
    aria-label="Touch-Steuerung">
```

Die Bewegung und Angriffe besitzen eigene Gruppen:

```html
role="group"
aria-label="Sharky bewegen"
```

```html
role="group"
aria-label="Angriffe"
```

Die Angriffstasten besitzen zusätzlich konkrete Aktionsbeschriftungen.

## Dekorative Elemente

Rein dekorative Menüelemente werden vor Screenreadern verborgen:

```html
<div class="hero-background-image" aria-hidden="true"></div>

<div class="hero-background-effects" aria-hidden="true">
    <!-- Dekorative Blasen -->
</div>
```

Dadurch werden visuelle Hintergrundeffekte nicht als inhaltlich relevante
Elemente vorgelesen.

Dekorative Bilder können außerdem ein leeres `alt`-Attribut verwenden:

```html
<img src="..."
    alt="">
```

## Visuell verborgene Inhalte

Die Klasse `.visually-hidden` blendet Inhalte optisch aus, hält sie aber für
unterstützende Technologien verfügbar:

```css
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

Sie wird beispielsweise verwendet, wenn eine grafische Überschrift zusätzlich
eine semantische Textüberschrift benötigt.

## Tastaturbedienung

Native Buttons und Links sind grundsätzlich per Tastatur erreichbar.

Für wichtige Bereiche des Hauptmenüs sind sichtbare Fokuszustände definiert:

```css
.main-menu-navigation button:focus-visible,
.main-menu-navigation a:focus-visible,
.hero-actions button:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
}
```

Damit bleibt der Tastaturfokus auf dem animierten Hintergrund erkennbar.

Für andere interaktive Komponenten wird teilweise der Browserstandard
verwendet. Ein einheitlicher globaler `:focus-visible`-Stil ist derzeit nicht
vorhanden.

## Hover-, Aktiv- und Deaktivierungszustände

Buttons besitzen sichtbare Hover- und Aktivzustände:

```css
.primary-button:hover {
    background: #75e6ff;
}

.mobile-action-button:active {
    transform: scale(0.94);
}
```

Deaktivierte Buttons werden abgeschwächt dargestellt:

```css
button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}
```

Ein Hover-Zustand allein darf keine notwendige Information vermitteln, da
Touch-Geräte und Tastaturbedienung keinen klassischen Hoverzustand besitzen.

## Barrierefreiheitsgrenzen

Die Anwendung enthält mehrere sinnvolle Accessibility-Maßnahmen, ist aber nicht
als vollständig WCAG-konform zertifiziert.

Aktuelle Grenzen:

- Das Canvas-Spiel besitzt keine vollständige textuelle Alternative.
- Bewegungen und Gegnerpositionen werden nicht durch einen Screenreader
  beschrieben.
- HUD-Werte verwenden derzeit keine eigene Live-Region.
- Menü-Panels besitzen keinen vollständigen modalen Dialogstatus.
- Ein automatisches Focus Trapping in geöffneten Panels ist nicht dokumentiert.
- Der Fokus wird beim Öffnen und Schließen eines Panels nicht vollständig
  automatisiert verwaltet.
- Es existiert kein global einheitlicher `:focus-visible`-Stil.
- Farbkontraste wurden nicht für jede Zustandskombination automatisiert geprüft.
- Touch-Zielgrößen müssen auf echten Geräten geprüft werden.
- Canvas-Animationen werden nicht vollständig durch
  `prefers-reduced-motion` deaktiviert.
- Die gesamte Anwendung wurde nicht mit allen Screenreader- und
  Browserkombinationen getestet.

Diese Punkte sind keine Behauptung über einen konkreten Fehler in jeder
Situation. Sie markieren Bereiche, die für eine höhere
Barrierefreiheitsstufe weiterentwickelt werden müssten.

## Empfohlene spätere Verbesserungen

### Einheitlicher Fokuszustand

```css
:where(
    button,
    a,
    input,
    [tabindex]
):focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 3px;
}
```

Vor einer Übernahme muss geprüft werden, ob der Fokus in Hell- und Dunkelmodus
ausreichend sichtbar bleibt.

### Dialogsemantik

Geöffnete Panels könnten zukünftig ergänzen:

```html
role="dialog"
aria-modal="true"
aria-labelledby="dialogTitle"
```

Dazu gehören dann ebenfalls:

- Fokus auf das geöffnete Panel setzen
- Fokus im Dialog halten
- Schließen mit Escape
- Fokus zum auslösenden Button zurückführen

### Live-Status

Wichtige Statusänderungen könnten über eine kontrollierte Live-Region
bereitgestellt werden:

```html
<div class="visually-hidden"
    aria-live="polite"
    id="gameAnnouncements">
</div>
```

Zu häufige Meldungen müssen vermieden werden, damit Screenreader nicht
überlastet werden.

### Canvas-Alternative

Eine weitergehende Alternative könnte wichtige Ereignisse textuell ausgeben:

- Level gestartet
- Münze gesammelt
- Leben verloren
- Boss erschienen
- Level abgeschlossen
- Game Over

Eine vollständig gleichwertige Bedienung des visuellen Actionspiels wäre damit
noch nicht automatisch erreicht.

## Manuelle Responsive-Prüfung

Folgende Größen sollten mindestens geprüft werden:

| Kategorie | Beispielgröße |
| --- | --- |
| Desktop | 1920 × 1080 |
| Notebook | 1366 × 768 |
| Tablet Querformat | 1180 × 820 |
| Tablet Hochformat | 820 × 1180 |
| Smartphone Querformat | 844 × 390 |
| Kleines Smartphone Querformat | 667 × 375 |
| Smartphone Hochformat | 390 × 844 |

Zusätzlich sollten Zwischenbreiten getestet werden. Fehler entstehen häufig
nicht exakt an einem Breakpoint, sondern zwischen typischen Gerätegrößen.

## Manuelle Accessibility-Prüfung

### Tastatur

- Alle Buttons und Links mit Tab erreichen
- Fokus jederzeit sichtbar
- Reihenfolge nachvollziehbar
- Einstellungen ohne Maus bedienbar
- Panels wieder sicher verlassen
- keine unbeabsichtigte Tastaturfalle
- Angriffe und Bewegung korrekt zugeordnet

### Screenreader

- Seitensprache wird korrekt erkannt
- Hauptnavigation besitzt einen verständlichen Namen
- Icon-Buttons werden verständlich vorgelesen
- Regler besitzen zugeordnete Beschriftungen
- dekorative Elemente werden übersprungen
- Hochformat-Hinweis wird angekündigt
- Buttonzustände werden korrekt ausgegeben
- Überschriften ergeben eine nachvollziehbare Struktur

### Zoom

- Seite bei 200 Prozent Browserzoom prüfen
- Texte dürfen nicht abgeschnitten werden
- Dialoge müssen scrollbar bleiben
- Buttons dürfen sich nicht überlagern
- notwendige Inhalte dürfen nicht verschwinden

### Farben

- Hell- und Dunkelmodus prüfen
- Kontrast mit einem geeigneten Werkzeug messen
- Fokuszustände in beiden Themes prüfen
- Zustände nicht ausschließlich durch Farbe vermitteln
- deaktivierte Elemente erkennbar halten

### Bewegung

- Betriebssystem auf reduzierte Bewegung stellen
- Startmenü prüfen
- Orientierungshinweis prüfen
- Gewinnanimation prüfen
- Canvas-Animationen auf Belastung bewerten

## Automatisierte Abdeckung

Die Tests prüfen bereits, ob:

- die Oberfläche erforderliche Spiel- und Touch-Elemente enthält,
- responsive Regeln für mobile Querformate existieren,
- `prefers-reduced-motion` berücksichtigt wird,
- Touch-Steuerungen auf geeigneten Geräten erscheinen,
- Touch-Steuerungen auf Desktopgeräten verborgen bleiben,
- Touch-Steuerungen oberhalb der unterstützten Breite verborgen bleiben,
- Kontextmenüs auf den Touch-Steuerungen unterdrückt werden.

Die Tests überprüfen nicht die tatsächliche visuelle Qualität oder vollständige
Barrierefreiheit.

## Regeln für neue Styles

Neue Styles sollten:

- vorhandene CSS-Variablen verwenden,
- in der fachlich passenden Datei ergänzt werden,
- keine unnötigen Inline-Styles erzeugen,
- Desktop und mobile Viewports berücksichtigen,
- Hell- und Dunkelmodus prüfen,
- sichtbare Fokuszustände erhalten,
- reduzierte Bewegung respektieren,
- keine wichtigen Informationen ausschließlich über Farbe vermitteln,
- bestehende Breakpoints bevorzugen,
- lokale Assets über korrekte relative Pfade laden.

Neue Breakpoints sollten nur ergänzt werden, wenn die vorhandenen Regeln das
Problem nicht sinnvoll lösen.

## Prüfung nach Stylingänderungen

```bash
npm run check
git diff --check
```

Danach müssen mindestens geprüft werden:

1. Desktopansicht
2. mobile Hochformatansicht
3. mobile Querformatansicht
4. Hellmodus
5. Dunkelmodus
6. Vollbild
7. reduzierte Bewegung
8. Tastaturfokus
9. Browserkonsole

## Weiterführende Dokumentation

- [Dokumentationsübersicht](../README.md)
- [Anwendungsarchitektur](../architecture/application.md)
- [Rendering und Assets](../architecture/rendering-assets.md)
- [Interface und Steuerung](../features/interface-controls.md)
- [Audio und Anzeigeeinstellungen](../features/audio-display-settings.md)
- [Entwicklungskonventionen](conventions.md)
- [Tests und Validierung](testing-validation.md)
- [Entwicklungsworkflow](../operations/development-workflow.md)
- [Deployment](../operations/deployment.md)