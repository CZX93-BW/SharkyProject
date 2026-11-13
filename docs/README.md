# Technische Dokumentation

Ich habe die Dokumentation entlang zweier Fragen gegliedert. Wie kommt eine Eingabe bis zum sichtbaren Spielbild? Und wo werden die Regeln für einen konkreten Angriff, ein Riff oder einen Zustandswechsel festgelegt?

## Architektur

| Fachseite | Inhalt |
| --- | --- |
| [Anwendungsaufbau](architecture/application.md) | Skriptreihenfolge, Verzeichnisse, Klassenmodell, Objektbesitz und Zusammensetzung |
| [Spielschleife und Zustand](architecture/game-loop-state.md) | Fester Simulationstakt, Reihenfolge der Updates, Sitzungsdaten, Pause und Neustart |
| [Kamera, Rendering und Assets](architecture/rendering-assets.md) | Koordinatenräume, Hintergrundkacheln, Spritecache, Animationen, Statusleisten und Debug-Ebene |

## Spiel und Oberfläche

| Fachseite | Inhalt |
| --- | --- |
| [Sharky und Kampfsystem](features/player-combat.md) | Bewegungsauflösung, Trefferprüfung, Angriffsfenster, Projektile und Sammelobjekte |
| [Level, Gegner und Shop](features/enemies-levels.md) | Leveldaten, Spawnpositionen, Bewegungsprofile, Bosszustände und Upgrades |
| [Menüs und Eingaben](features/interface-controls.md) | Tastaturbesitz, Joystick, Angriffstasten, Dialogfokus und UI-Ereignisse |
| [Audio und Anzeige](features/audio-display-settings.md) | Musikwechsel, Effektpools, Stummschaltung, gespeicherte Präferenzen und Vollbild |

## Entwicklung und Betrieb

| Fachseite | Inhalt |
| --- | --- |
| [Codekonventionen](engineering/conventions.md) | Benennung, Verantwortlichkeiten, JSDoc und Aufbau der Projektdateien |
| [Layout und Zugänglichkeit](engineering/styling-accessibility.md) | CSS-Module, Fensterbreite und Eingabegerät, Fokus, Scrollverhalten und reduzierte Bewegung |
| [Prüfung und Ergebnisse](engineering/testing-validation.md) | Manuelle Spielwege, Prüfumfang der Validierung und Testumgebung |
| [Lokale Entwicklung](operations/development-workflow.md) | Reproduzierbarer Einstieg, Debugmodus und Nachverfolgung einer Änderung |
| [Statische Bereitstellung](operations/deployment.md) | Laufzeitdateien, Release aus einem Commit, Unterverzeichnis und Subdomain |

Die Bedienung ist in der [Projekt-README](../README.md#steuerung) zusammengefasst. Der Weg eines Flossenschlags lässt sich vom [Tastendruck](features/interface-controls.md#tastatur) über den [Trefferbereich](features/player-combat.md#trefferbereich-des-flossenschlags) bis zur [Statusleiste](architecture/rendering-assets.md#statusleisten-und-debugansicht) nachvollziehen.

[Zur Projekt-README](../README.md)
