# Lokale Entwicklung

Für die Entwicklung wird derselbe statische Projektordner ausgeliefert wie für die gehostete Anwendung. JavaScript und Stylesheets werden direkt vom Browser geladen. Der lokale Start unter Windows, Linux und macOS ist im [Quickstart](../../README.md#quickstart) beschrieben.

## Einstiegspunkte

| Änderung | Ausgangspunkt | Beobachtbares Ergebnis |
| --- | --- | --- |
| Reichweite des Flossenschlags | [Spielkonfiguration](../../js/config/game-config.js) und [FinSlap](../../js/entities/attacks/fin-slap.class.js) | Kontaktfenster und Reichweite in beiden Blickrichtungen |
| Mehr Begegnungen in einem Riff | [Levelkonfiguration](../../js/config/level-config.js) und [Spawner](../../js/systems/enemy-spawner.class.js) | Startpopulation, aktive Anzahl und Nachschub vor der Bosszone |
| Andere Schaltflächenanordnung | [index.html](../../index.html), [Menülayout](../../styles/menu-screen.css) und [responsive Regeln](../../styles/responsive.css) | Breites Desktopfenster, schmales Fenster und Touchgerät |
| Neue Spritefolge | [Assetkonfiguration](../../js/config/asset-config.js) und zuständige Entität | Reihenfolge, Takt und Ende der Animation |

Zusätzliche Klassen werden vor ihren Aufrufern in `index.html` eingebunden. Bei einer fehlenden Klasse lässt sich im Netzwerk-Tab unterscheiden, ob eine Datei fehlt oder erst nach ihrer Verwendung geladen wird. Bei Assets sind Schreibweise und relative Pfade besonders relevant, da einige übernommene Dateinamen Leerzeichen enthalten.

## Einen Spielzustand untersuchen

Unter [localhost mit Debugansicht](http://127.0.0.1:8000/?debug=true) werden zusätzliche Informationen eingeblendet. Bei einem versetzten Treffer lassen sich die Körperfläche und das aktuelle Angriffsfenster während der Animation vergleichen. Für die Beurteilung des Spielgefühls wird derselbe Ablauf anschließend ohne URL-Parameter gespielt. [Rendering und Debug-Ebene](../architecture/rendering-assets.md)

Bei einem fehlenden Ton kann zuerst ein echter Bedienimpuls ausgelöst und der Zustand von Musik, Effekten und Mute in den Einstellungen kontrolliert werden. Danach lässt sich im Netzwerk-Tab prüfen, ob die betreffende Audiodatei geladen wurde. [Audiowiedergabe](../features/audio-display-settings.md)

## Versionskontrolle

Ich fasse zusammengehörige Änderungen in einem Commit zusammen. `git status --short --branch` zeigt den Ausgangsstand, `git diff` die Änderungen im Arbeitsverzeichnis. Nach dem gezielten Vormerken mit `git add` zeigt `git diff --cached` den tatsächlichen Commitinhalt. Vor dem Commit können mit `git diff --cached --check` zusätzlich Leerraumfehler im vorgemerkten Stand erkannt werden.

Die Commitnachrichten benennen Bereich und Wirkung, beispielsweise `fix(responsive): keep desktop game in windowed mode`. Für eine Änderung an der Spielmechanik gehören die zugehörigen Werte und ihre fachliche Beschreibung zusammen. Bei Bedarf können mit `npm test` oder `npm run check` die vorhandenen Prüfungen ausgeführt werden.

[Codekonventionen](../engineering/conventions.md) · [Prüfumfang](../engineering/testing-validation.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
