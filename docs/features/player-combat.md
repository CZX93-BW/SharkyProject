# Sharky und das Kampfsystem

Für den Kampf werden drei Größen getrennt behandelt. Sharkys Position bestimmt, wo er schwimmt. Der Spriteausschnitt bestimmt, welcher Teil des Bildes gezeichnet wird. Der Trefferbereich bestimmt, ob ein Angriff ein Ziel erreicht.

## Bewegung, Felsen und Animation

Sharky startet mit 100 Lebenspunkten und einem Schwimmtempo von 4 Weltpixeln pro Simulationsschritt. Bei diagonaler Eingabe werden beide Geschwindigkeitskomponenten mit 0,7071 multipliziert. Dadurch bleibt die zurückgelegte Strecke etwa so groß wie bei einer Bewegung entlang einer einzigen Achse.

Nach dem Bewegen wird die Spielfigur auf die Weltgrenzen begrenzt. Bei einer Überschneidung mit einer festen Fläche wird anhand der vorherigen Position ermittelt, von welcher Seite Sharky eingedrungen ist. Er wird an die entsprechende Felskante gesetzt und die Geschwindigkeit auf dieser Achse auf null gestellt. Für Felsen werden die Kollisionsflächen aus den um transparente Bildränder verkleinerten Rechtecken gebildet. [Character](../../js/entities/player/character.class.js) · [CollisionManager](../../js/systems/collision-manager.class.js)

Bei der Animation hat der Tod Vorrang vor Verletzung, Angriff und normaler Bewegung. Nach einem Treffer gilt eine Unverwundbarkeit von 900 ms. Ohne Bewegung oder Angriff wird zunächst die Ruheanimation und nach 15 Sekunden die Schlafanimation abgespielt. Bewegung oder Angriff setzen den Ruhezeitpunkt zurück.

## Vom Tastendruck zum Angriff

Im [AttackManager](../../js/systems/attack-manager.class.js) werden die Eingaben des aktuellen und des vorigen Schritts verglichen. Ein Angriff wird beim Wechsel von losgelassen zu gedrückt ausgelöst. Für jeden Angriff wird ein eigener letzter Auslösezeitpunkt gespeichert. Bei Gift wird zusätzlich der Flaschenvorrat geprüft. Die gemeinsame Basis [AttackObject](../../js/entities/attacks/attack-object.class.js) verwaltet den aktiven Zustand und bereits getroffene Ziele.

| Angriff | Abklingzeit | Wirkung |
| --- | ---: | --- |
| Flossenschlag | 480 ms | 28 Schaden je erreichtem Ziel im aktiven Schwung |
| Giftangriff | 650 ms | 10 direkter Schaden und 8 je Giftschadenstakt im Abstand von 700 ms, für bis zu 3600 ms |
| Blasenfalle | 850 ms | Fängt einen normalen Gegner 3200 ms lang. Währenddessen entfällt sein Berührungsschaden. |

## Trefferbereich des Flossenschlags

Der Angriff folgt während des Schwungs der aktuellen Spielerposition. Beim Blick nach rechts beginnt sein Rechteck 14 Weltpixel links vom rechten Körperrand und endet 32 Weltpixel rechts davon. Beim Blick nach links wird dieselbe Geometrie am linken Rand gespiegelt. Der Bereich ist 24 Weltpixel hoch und beginnt bei `player.y + 9`.

Erst die Animationsbilder 5 bis 7 geben den Kontakt frei. Geprüft wird eine Überlappung mit `enemy.getCombatBounds()`. Dieses Rechteck berücksichtigt seitliche, obere und untere Einzüge des jeweiligen Gegnertyps. Beim aufgeblähten Kugelfisch wird der untere Einzug verkleinert. Ein Ziel kann bereits mit kurzem Abstand vor Sharky getroffen werden. Die Trefferregistrierung verhindert einen zweiten Schaden am selben Ziel während desselben Schwungs. [FinSlap](../../js/entities/attacks/fin-slap.class.js) · [Spielkonfiguration](../../js/config/game-config.js)

## Projektile und Sammelobjekte

[PoisonShot](../../js/entities/attacks/poison-shot.class.js) bewegt sich mit 8 Weltpixeln pro Schritt und verfällt nach spätestens 1500 ms. Die [Blasenfalle](../../js/entities/attacks/bubble-trap.class.js) bewegt sich mit 6 und verfällt nach 1600 ms. Feste Flächen werden vor den Zielen geprüft. Nach einem Kontakt wird das Projektil verbraucht. Bei der Blase wird vorher `canBeTrapped()` abgefragt. Der Boss kann daher eine Blase abfangen, ohne gefangen zu werden.

Beim Einsammeln werden der Sitzungswert erhöht und das Objekt als eingesammelt markiert. Bei voller Gifttasche bleibt die Flasche im Level. Beim Schuss wird eine Flasche direkt beim Erzeugen des Projektils abgezogen. Ein späterer Fehlschuss erstattet sie nicht. Die aktuelle Taschenkapazität wird auch für die Giftleiste verwendet.

[Shop und Inventar](enemies-levels.md#shop) · [Spieleranzeigen](../architecture/rendering-assets.md#statusleisten-und-debugansicht) · [Tastenbelegung](../../README.md#steuerung)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
