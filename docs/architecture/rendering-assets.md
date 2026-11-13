# Kamera, Rendering und Assets

Beim Zeichnen werden Weltkoordinaten, Bildschirmkoordinaten und CSS-Größen getrennt behandelt. Ein Gegner hat eine feste Position im Riff. Dieselbe Position kann durch die Kamerabewegung an unterschiedlichen Stellen auf dem Bildschirm erscheinen.

## Kamera und logische Auflösung

Die logische Standardfläche beträgt 960 × 540 Pixel. Im Touch-Querformat wird die Höhe von 540 beibehalten und die Breite aus dem Verhältnis von Fensterbreite zu Fensterhöhe berechnet. Die CSS-Darstellung und die Größe des Canvas-Zeichenpuffers werden dabei separat gesetzt. [Viewportberechnung](../../js/main.js)

Die Kamera richtet Sharky horizontal bei 38 % und vertikal bei 50 % der sichtbaren Fläche aus, soweit es die Weltgrenzen zulassen. Ihre Position wird je Achse auf den Bereich zwischen null und dem äußersten Kamerapunkt des Levels begrenzt. Mit `getVisibleBounds()` wird derselbe Ausschnitt für die Gegnererzeugung bereitgestellt. [Camera](../../js/game/camera.class.js)

## Zeichenreihenfolge

| Ebene | Verarbeitung im Renderer |
| --- | --- |
| Hintergrund | Nach dem Leeren des Canvas werden die Parallax-Ebenen mit eigenem Kameraversatz gezeichnet. |
| Welt | Der Kontext wird gesichert und um die negative Kameraposition verschoben. Es folgen Ausgang, Barrieren, Sammelobjekte, normale Gegner, Boss, Angriffe und Sharky. |
| HUD | Nach `restore()` werden Spieleranzeigen und Bossleiste in Bildschirmkoordinaten gezeichnet. |
| Debug | Bei aktiviertem Debugmodus werden zusätzliche Geometrien und Diagnosewerte eingeblendet. |

Die Pausenschaltfläche liegt als HTML-Element über der Spielfläche. Ihr Abstand zur Oberkante wird im CSS festgelegt. Die Bossleiste wird dagegen im Canvas verankert. Für ihre Position ist der [Statusrenderer](../../js/game/game-status-renderer.class.js) zuständig. [GameRenderer](../../js/game/game-renderer.class.js)

## Hintergrundkacheln und Parallax

Jede Hintergrundebene besitzt eine Kachelbreite und einen eigenen Scrollfaktor. Für sichtbare Kacheln wird ein passender mittiger Bildausschnitt berechnet. Jede zweite Kachel wird gespiegelt, sodass benachbarte Bildkanten aufeinandertreffen. Der linke Zeichenursprung wird auf ganze Pixel abgerundet. Sobald die rechte Bildschirmkante erreicht ist, endet die Zeichenschleife. So muss bei einer längeren Welt kein entsprechend breites Einzelbild geladen werden. [BackgroundObject und BarrierObject](../../js/entities/world/background-object.class.js)

## Assetpfade, Bildcache und Animation

Die [Assetkonfiguration](../../js/config/asset-config.js) enthält die Pfade und Reihenfolgen der Spritebilder. Angeforderte Bilder werden in [DrawableObject](../../js/core/drawable-object.class.js) anhand des Pfads wiederverwendet. Ist ein Bild noch nicht darstellbar, kann die jeweilige Ersatzgrafik gezeichnet werden. Für Gegner und Boss sind die Zeichenroutinen im [EnemyFallbackRenderer](../../js/game/enemy-fallback-renderer.class.js) zusammengefasst.

In `AnimatedDrawableObject` wird je Animation eine Bildfolge hinterlegt. Beim Wechsel werden Bildindex und Zeitbasis zurückgesetzt. Eine Schleife verwendet den Bildindex modulo Anzahl der Bilder. Eine einmalige Animation hält am letzten Bild an und meldet ihren Abschluss. Beim Spieler werden zusätzlich quellbildabhängige Ausschnitte und die Blickrichtung berücksichtigt. Die dargestellte Spritegröße kann damit von der für Bewegung oder Kampf verwendeten Fläche abweichen. [Animationsbasis](../../js/core/animated-drawable-object.class.js) · [Spielerzeichnung](../../js/entities/player/character.class.js)

## Statusleisten und Debugansicht

Leben wird auf das aktuelle Maximalleben bezogen. Für Münzen gilt die Anzahl der Münzen im Level, für Gift die aktuelle Taschenkapazität. Der Prozentwert wird auf 0 bis 100 begrenzt und in eine der Bildstufen in 20-Prozent-Schritten übersetzt. Die Leisten zeigen dadurch Stufen, während im Spielzustand mit den genauen Werten gerechnet wird.

Die Bossleiste bleibt bis zu seiner Einführung verborgen und wird nach seiner Niederlage ausgeblendet. Ihre horizontale Position wird bei jeder Darstellung aus der Canvasbreite berechnet. Über `?debug=true` lassen sich Treffergeometrie und Zahlenwerte separat einsehen.

[Spieltakt](game-loop-state.md) · [Trefferbereiche](../features/player-combat.md) · [CSS und Skalierung](../engineering/styling-accessibility.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
