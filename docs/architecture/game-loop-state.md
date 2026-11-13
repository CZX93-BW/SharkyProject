# Spielschleife und Spielzustand

Für Sharkys Bewegung wird ein fester Simulationstakt von 60 Schritten pro Sekunde verwendet. Die Bildausgabe bleibt an den Browser gekoppelt. Auf einem Display mit 120 Hz wird dadurch häufiger gezeichnet, ohne dass Sharky durch dieselbe Eingabe doppelt so weit schwimmt.

## Ein Browserframe

1. In `Game.runGameLoop(currentTime)` wird der Abstand zum vorherigen Browserframe ermittelt. Aus diesem Abstand wird auch der angezeigte FPS-Wert berechnet.
2. In `advanceSimulation()` wird die verstrichene Zeit zu einem Restbetrag addiert. Pro vollem Intervall von rund 16,67 ms werden die Spieluhr weitergestellt und ein Update ausgeführt. Ein Bruchteil bleibt bis zum nächsten Frame erhalten.
3. Die pro Frame angerechnete Zeit ist auf sechs Schritte begrenzt. Nach einem längeren Stillstand wird deshalb nur ein begrenzter Teil der versäumten Zeit simuliert.
4. Nach den Updates wird der erreichte Zustand einmal gezeichnet und an die Oberfläche gemeldet. Solange das Spiel läuft, wird der nächste Frame angefordert.

In der [GameClock](../../js/core/game-clock.class.js) werden zwei Zeitangaben bereitgestellt. `now()` liefert den Startzeitpunkt zuzüglich aktiver Simulationszeit für Abklingzeiten und Effekte. `animationNow()` liefert die verstrichene Simulationszeit für Bildfolgen. In der Pause werden beide angehalten. Beim Fortsetzen werden Framezeit und Restbetrag zurückgesetzt.

## Reihenfolge innerhalb eines Schritts

| Phase in `updateActiveGame()` | Abhängigkeit |
| --- | --- |
| Spieler | Vor dem Bewegen wird die Position gespeichert. Bei Überschneidung mit einem Felsen lässt sich daraus die Eintrittsseite ableiten. |
| Kamera | Der Ausschnitt wird auf die korrigierte Spielerposition ausgerichtet. Seine Grenzen werden anschließend für Spawns verwendet. |
| Angriffe | Eingaben werden ausgewertet, bestehende Angriffe bewegt und abgelaufene entfernt. |
| Level | Spawner, Gegner, Sammelobjekte und Endboss werden aktualisiert. Ein neuer Bosszustand kann einen Audioübergang auslösen. |
| Kollisionen | Zuerst werden gefährliche Berührungen, danach Sammelobjekte und schließlich Angriffstreffer geprüft. |
| Spielstatus | Nach den Kollisionen wird die Niederlage oder der Übergang am freigegebenen Ausgang ausgelöst. |

Die Reihenfolge ist in [Game](../../js/game/game.class.js) implementiert. Bei einer tödlichen Kollision wird die Geschwindigkeit sofort auf null gesetzt. In den folgenden Schritten wird nur die Todesanimation des Spielers fortgeführt. Erst am Ende wird der Status `gameOver` gesetzt.

## Zustände und Übergänge

| Ausgang | Ereignis | Folgezustand |
| --- | --- | --- |
| `menu` | Direkter Start oder Auswahl eines Riffs | `playing` |
| `playing` | Pause | `paused` |
| `paused` | Fortsetzen | `playing` |
| `playing` | Ende der Todesanimation | `gameOver` |
| `playing` in Level 1 | Boss besiegt und Ausgang erreicht | `shop` |
| `shop` | Weiter zum zweiten Riff | `playing` |
| `playing` in Level 2 | Boss besiegt und Ausgang erreicht | `levelComplete` |

Der Status steuert Spiellogik und Oberfläche. Das Öffnen der Einstellungen innerhalb der Pause ist ein Wechsel der HTML-Ansicht. Dafür wird kein zusätzlicher Spielzustand benötigt.

## Versuch, Levelwechsel und neue Sitzung

Beim Start eines Levels wird eine frische Spielfigur erzeugt. Erworbene Verbesserungen werden angewendet und die Objekte des registrierten Levels zurückgesetzt. Kamera, aktive Angriffe und Eingabestatus werden für den neuen Versuch geleert. Ein noch vorgemerkter Animationsframe wird vor dem erneuten Start abgemeldet.

| Einstieg in GameState | Inventar und Upgrades |
| --- | --- |
| `start(levelNumber)` | Neue Sitzung. Inventar und Kaufstatus werden zurückgesetzt. |
| `startNextLevel(levelNumber)` | Beim Übergang aus dem Shop werden Restinventar und gekaufte Verbesserungen übernommen. |
| `restartCurrentLevel()` | Im aktuellen Riff werden Münzen und Gift geleert. Erworbene Upgrades bleiben erhalten. |
| Neustart vom Siegbildschirm | Über den Startpfad wird eine neue Sitzung in Level 1 begonnen. |

Der Reset erfolgt im [GameState](../../js/game/game-state.class.js) und im [Level](../../js/game/level.class.js). Die Dokumentseite bleibt bei jedem dieser Übergänge geladen.

[Anwendungsaufbau](application.md) · [Shop und Upgrades](../features/enemies-levels.md#shop) · [Spielprüfung](../engineering/testing-validation.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
