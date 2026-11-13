# Codekonventionen

Ich verwende für den Quellcode englische Namen und für die Spieloberfläche deutsche Begriffe. Die Verzeichnisse sind nach Aufgaben im Spiel gegliedert. So liegt die Regel für ein eingefangenes Ziel beim Gegner und die Berechnung des Blasenflugs beim Projektil.

## Klassen, Dateien und Konfiguration

| Form | Beispiel im Projekt | Bedeutung |
| --- | --- | --- |
| PascalCase | `EnemySpawnPositionFinder` | Klasse mit einer abgegrenzten Zuständigkeit |
| camelCase | `getCombatBounds()`, `poisonBottles` | Methode oder Zustandswert |
| Großbuchstaben mit Unterstrichen | `GAME_CONFIG`, `ASSET_CONFIG` | Gemeinsam verwendete Konfiguration |
| Dateiname mit Fachbegriff und `.class.js` | `collision-manager.class.js` | Klassenimplementierung im zuständigen Fachordner |

Spielwerte werden an der Stelle definiert, an der sie variieren. Die Reichweite des Flossenschlags gilt für beide Riffe und liegt in [game-config.js](../../js/config/game-config.js). Bossleben und Spawnintervalle unterscheiden sich pro Riff und stehen in [level-config.js](../../js/config/level-config.js). Die Position einer konkreten Flasche gehört zum Levelaufbau.

## Methodenumfang und JSDoc

Als Richtwerte verwende ich 14 innere Zeilen pro Funktion und 400 Zeilen pro Datei. Fachlich zusammenhängende Abläufe bleiben erkennbar. In `Game.updateActiveGame()` lässt sich die Reihenfolge der Updates unmittelbar lesen, während die einzelnen Arbeitsschritte in benannten Methoden liegen. Der [AudioManager](../../js/systems/audio-manager.class.js) bündelt die zusammengehörende Verwaltung von Musik, Effekten und gespeicherten Einstellungen.

Im JSDoc werden Parameternamen, Typen, optionale Argumente und relevante Rückgaben festgehalten. Ein Beispiel ist `EnemySpawnPositionFinder.find()`. Als Ergebnis ist auch `null` vorgesehen, wenn kein sicherer Platz gefunden wurde. Diese Angabe erklärt zugleich, weshalb der Aufrufer das Ergebnis vor dem Erzeugen eines Gegners prüft.

## HTML, CSS und Markdown

Die Menüstruktur und die Dialoginhalte stehen im HTML. Für Aktionen werden Buttons, für Seitenwechsel Links verwendet. Zusammengehörige Aktionen können über `data-*`-Attribute gebunden werden. So bedienen die verschiedenen Startbuttons denselben Handler mit einem unterschiedlichen Levelwert.

Das CSS ist nach Oberfläche und Aufgabenbereich aufgeteilt. Gemeinsame Farben und Schriftfamilien sind zentral definiert. Die [.editorconfig](../../.editorconfig) legt unter anderem UTF-8, LF-Zeilenenden und vier Leerzeichen Einrückung für die Projektdateien fest.

Für technische Werte ist die zugehörige Fachseite die zentrale Beschreibung. Aus der README und benachbarten Themen wird mit relativen Pfaden dorthin verlinkt. Spielbegriffe bleiben in der Schreibweise der Oberfläche, Codebezeichner in ihrer originalen Schreibweise.

[Objektbesitz und Verzeichnisse](../architecture/application.md) · [Lokale Entwicklung](../operations/development-workflow.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
