# Level, Gegner und Shop

Die Balance ist in der [Levelkonfiguration](../../js/config/level-config.js) hinterlegt. Die Positionen konkreter Felsen, Sammelobjekte und des Ausgangs werden in [Level 1](../../js/levels/level-one.js) und [Level 2](../../js/levels/level-two.js) festgelegt. Beide Riffe werden in `LEVELS` registriert und über ihre Nummer ausgewählt.

## Aufbau der Riffe

| Merkmal | Level 1 | Level 2 |
| --- | ---: | ---: |
| Weltbreite × Höhe | 4800 × 720 | 5600 × 720 |
| Hintergrundkachelbreite | 2400 | 2800 |
| Münzen / Giftflaschen | 5 / 5 | 5 / 5 |
| Anfangspopulation / gleichzeitig aktive normale Gegner | 4 / max. 5 | 6 / max. 10 |
| Gesamtbudget normaler Gegner pro Versuch | 24 | 54 |
| Spawnintervall | 3200–5200 ms | 1733–2933 ms |
| Mindestabstand zum Spieler / zu anderen Gegnern | 320 / 120 | 300 / 110 |

Bei der Auswertung der Konfiguration werden unter anderem positive Größen, gültige Intervallgrenzen, Bossdistanzen und die Summe der Gegnergewichte geprüft. Der Spawner verwaltet das Gesamtbudget eines Versuchs unabhängig von der Länge der aktuellen Gegnerliste. Entfernte Gegner geben einen aktiven Platz frei. Bereits verbrauchtes Budget bleibt verbraucht.

## Auswahl und Platzierung eines Gegners

1. Der [EnemySpawner](../../js/systems/enemy-spawner.class.js) prüft aktive Anzahl, Gesamtbudget, Zeitpunkt und Bosszone. Zu Beginn wird einmalig bis zur vorgesehenen Startanzahl aufgefüllt, soweit Budget und Platz reichen. Danach wird der nächste Spawntermin gesetzt.
2. Der Typ wird anhand gewichteter Zufallsauswahl bestimmt. Im ersten Riff entfallen 55 % auf Kugelfische und 25 %, 10 %, 10 % auf die drei Quallenvarianten. Im zweiten Riff sind es 40 %, 20 %, 15 %, 25 %. Dies sind Wahrscheinlichkeiten für den zuerst gewählten Typ. Ist für ihn kein Platz frei, werden die übrigen Typen in gemischter Reihenfolge versucht.
3. Im [EnemySpawnPositionFinder](../../js/systems/enemy-spawn-position-finder.class.js) beginnt der Suchbereich rechts des sichtbaren Ausschnitts und endet vor der Bosszone. Bis zu 120 zufällige Kandidaten werden geprüft. Bei Bedarf wird anschließend ein Raster mit versetzten Startpositionen durchsucht.
4. Ein gültiges Rechteck liegt innerhalb des spielbaren Bereichs und hält Abstand zu Sharky, anderen Gegnern, Felsen, Sammelobjekten, Boss und Ziel. Erst mit einem gültigen Platz wird über die [EnemyFactory](../../js/systems/enemy-factory.class.js) ein Gegner hinzugefügt. Bleibt die Suche erfolglos, wird für diesen Versuch kein Gegner gezählt.

## Bewegung und Hindernisse

Kugelfische ziehen in Wellen nach links. In Sharkys Nähe wechseln sie ihre Gestalt und können aufgebläht höheren Kontaktschaden verursachen. Quallen bewegen sich überwiegend vertikal und driften horizontal. Gelbe und pinke Varianten haben eigene Bewegungswerte. Die pinke Qualle besitzt im zweiten Riff 70 Lebenspunkte und verursacht 30 Kontaktschaden.

Bei einem Felsen wird im [EnemyMovementController](../../js/systems/enemy-movement-controller.class.js) ein Ausweichziel über oder unter dem Hindernis gespeichert. Für den unteren Weg müssen Gegnerhöhe und Weltunterkante genügend Platz lassen. Die Ausweichbewegung wird fortgeführt, bis der Felsen passiert ist. Danach gilt wieder das reguläre Bewegungsprofil.

## Endboss

| Bosswert | Level 1 | Level 2 |
| --- | ---: | ---: |
| Leben / Kontaktschaden | 180 / 15 | 240 / 30 |
| Bewegungstempo | 1,1 | 1,45 |
| Distanz für die Einführung | 650 | 720 |
| Angriffsdistanz / Abklingzeit | 180 / 2100 ms | 210 / 1650 ms |
| Maximale Entfernung vom Heimatbereich für die Verfolgung | 720 | 860 |

Der Orca patrouilliert vertikal um seinen Ausgangspunkt. Bei Annäherung wird die Einführung abgespielt. Erst nach der Einführung wird er als Angriffsziel freigegeben. Verfolgung und Angriff richten sich nach Spielerabstand und Abklingzeit. Bei Überschreiten der maximalen Entfernung vom Ausgangspunkt wird in den Heimatbereich zurückgekehrt. `hurt` und `dead` steuern die Darstellung nach einem Treffer und beim Tod. [Endboss](../../js/entities/enemies/endboss.class.js)

Im [BossMovementController](../../js/systems/boss-movement-controller.class.js) wird die Bewegung zum Ziel zunächst auf beiden Achsen versucht. Ist der Weg blockiert, werden horizontale und vertikale Teilbewegungen getrennt probiert. Die zustandsabhängige Entscheidung zum Verfolgen bleibt damit von der Kollisionsauflösung getrennt.

## Shop

Erst nach dem Boss und der Berührung des freigeschalteten Ausgangs wird in Level 1 der Shop geöffnet. Beim Kauf werden Preis, Münzstand und Besitz geprüft. Eine Verbesserung ist je Sitzung einmal kaufbar.

| Verbesserung | Kosten | Wirkung |
| --- | ---: | --- |
| Flossen-Turbo | 2 Münzen | Schwimmtempo +1 Weltpixel pro Schritt |
| Starke Schuppen | 3 Münzen | Maximalleben +25 |
| Gift-Tasche | 2 Münzen | Kapazität +2 Flaschen |

Mit fünf Münzen im ersten Riff ist eine Auswahl nötig. Für alle drei Verbesserungen wären sieben erforderlich. Im zweiten Riff führt der freigeschaltete Ausgang zum Siegbildschirm.

[Versuch und Sitzungsfortschritt](../architecture/game-loop-state.md) · [Kampfregeln](player-combat.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
