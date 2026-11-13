# Layout und Zugänglichkeit

Für das Layout werden drei Entscheidungen getrennt getroffen. Die Fensterbreite bestimmt die Anordnung des Menüs. Das Eingabegerät bestimmt die Verfügbarkeit der Touchsteuerung. Der Browser entscheidet über echten Vollbildbetrieb.

## Stylesheets und Typografie

| Datei | Zuständigkeit |
| --- | --- |
| [base.css](../../styles/base.css) | Lokale Schrift, Grundgrößen, Farbvariablen, Hell- und Dunkeldarstellung |
| [main-menu.css](../../styles/main-menu.css) und [menu-screen.css](../../styles/menu-screen.css) | Menüszene, Startaktionen, Navigationsleiste und kompakte Darstellung |
| [layout.css](../../styles/layout.css) und [game.css](../../styles/game.css) | Seitenaufbau, Spielkarte, Canvas und Spielelemente |
| [components.css](../../styles/components.css) | Wiederverwendete Bedienelemente, Dialoge und Interaktionszustände |
| [responsive.css](../../styles/responsive.css) und [orientation.css](../../styles/orientation.css) | Anpassungen an Breite und Höhe, Touch-Querformat und Hochformathinweis |
| [legal.css](../../styles/legal.css) | Lesebreite, Navigation und Scrollverhalten der Seite Rechtliches |

Die Wurzelschriftgröße ist über `max(16px, 100%)` abgesichert. Für die markanten Überschriften wird Luckiest Guy lokal über `@font-face` geladen. Für längere Texte wird eine Systemschrift verwendet. Bei wenig Platz werden Texte umbrochen oder die Navigation wird auf Symbole umgestellt.

## Fenster, Touch und Ausrichtung

- Bis einschließlich 1024 CSS-Pixel Breite zeigt die untere Menüleiste Symbole. Der zugehörige Text wird visuell verborgen und steht als zugängliche Beschriftung weiter zur Verfügung. Diese Regel greift auch an einem Desktopfenster mit Maus.
- Im Querformat mit grobem primären Zeigegerät werden Spielansicht und logische Canvasbreite an das Fenster angepasst. Für geringe Höhe bestehen zusätzliche Regeln bei 620 und 430 CSS-Pixeln. Pause und Touchsteuerung erhalten eigene Positionen.
- Im Hochformat wird der Drehhinweis bei aktivierter Touchsteuerung eingeblendet. Der Rechtstext behält sein eigenes Leselayout und die Rücklinks an Anfang und Ende der Seite.
- Auf einem kleinen Desktop ist ein begrenzter Dialogbereich scrollbar, wenn der Inhalt bei wenig Höhe oder Browserzoom andernfalls abgeschnitten würde. Auf Touchgeräten wird die Scrollleiste der Dialogflächen visuell ausgeblendet. Der Inhalt bleibt per Wischbewegung erreichbar.

[Erkennung der Eingabegeräte](../features/interface-controls.md#touch-und-joystick) · [Logische Canvasgröße](../architecture/rendering-assets.md#kamera-und-logische-auflösung)

## Tastatur, Bewegung und Grenzen

Bedienbare Elemente erhalten einen sichtbaren Tastaturfokus. Die Symbole für Farbschema und Vollbild werden mit dem Zustand der zugehörigen Schaltfläche synchronisiert. Beim Öffnen einer modalen Ansicht werden nicht bedienbare Hintergrundbereiche über `inert` aus der Fokusreihenfolge genommen. Erst beim Schließen wird der Fokus zurückgegeben. [Dialogsteuerung](../features/interface-controls.md#menüs-fokus-und-statuswechsel)

Über `prefers-reduced-motion` werden dekorative Bewegungen der Oberfläche reduziert. Die animierte Drehhilfe kann so als ruhendes Symbol angezeigt werden. Menüs lassen sich mit der Tastatur bedienen. Das Erkennen räumlicher Hindernisse und beweglicher Gegner im Canvas erfordert weiterhin eine visuelle Spielansicht.

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
