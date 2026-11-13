# Spielprüfung und technische Prüfungen

Für die Spielprüfung habe ich drei Wege verwendet. Dabei wurden die Bedienung im Browser, der Zustand nach einem Neustart und der zusammenhängende Spielverlauf über beide Riffe geprüft.

## Manuelle Durchgänge

| Geprüfter Weg | Ergebnis am 13. November 2026 |
| --- | --- |
| Desktop, Niederlage und erneuter Versuch | Nach dem Neustart konnte im selben Riff weitergespielt werden. Münz- und Giftanzeige begannen bei null. Im Durchgang fiel kein Konsolenfehler auf. |
| Handy, Hochformat und anschließendes Spiel im Querformat | Der Drehhinweis und die Touchbedienung funktionierten. Beide Riffe wurden über den Shop bis zum Siegbildschirm durchgespielt. |
| Audio und Vollbild | Die Stummschaltung blieb nach dem Neuladen erhalten. Ein- und Ausstieg aus dem Vollbild einschließlich Esc funktionierten. |

## Reproduzierbare Spielwege

**Nahkampf.** Einem kleinen Gegner von links und von rechts nähern. E einmal in Reichweite und einmal außerhalb auslösen. Ein Treffer wird während des sichtbaren Schwungs kurz vor Sharky erwartet. Mit der Blase lässt sich anschließend prüfen, ob ein gefangener Gegner bei Berührung noch Schaden verursacht. [Treffergeometrie](../features/player-combat.md#trefferbereich-des-flossenschlags)

**Inventar und Shop.** Vor der Niederlage mindestens eine Münze und eine Giftflasche sammeln. Nach dem erneuten Versuch müssen die Anzeigen leer und die Gegenstände wieder einsammelbar sein. Bei einem Neustart in Level 2 bleibt eine zuvor im Shop gekaufte Verbesserung wirksam. Der frische Start vom Siegbildschirm führt dagegen in Level 1. [Zustandswechsel](../architecture/game-loop-state.md)

**Menüs und Spielfläche.** Die Anleitung lässt sich über Tastatur, Schließen-Button oder Hintergrundklick verlassen. Beim Durchlaufen mit Tab soll der Fokus im offenen Dialog bleiben. Für die Layoutprüfung sind die freie Bossleiste, das schmale Desktopfenster, ein kurzes Querformat und die Erreichbarkeit langer Dialogtexte bei Zoom aussagekräftig. Der Spieltakt kann durch Vergleich derselben Strecke bei gleicher Eingabedauer auf Displays mit unterschiedlicher Bildrate beurteilt werden.

## Projektvalidierung

| Befehl | Umfang |
| --- | --- |
| `npm run validate` | Erwartete Dateien, lokale HTML- und CSS-Verweise, doppelte Skripteinbindungen, CSS-Klammern, JS-Syntax, konfigurierte Assets und lokale README-Verweise |
| `npm test` | Regressionstests mit dem Test-Runner von Node.js |
| `npm run check` | Erst Projektvalidierung, dann Tests |

Das [Validierungsskript](../../scripts/validate-project.mjs) löst lokale Verweise relativ zur jeweiligen Datei auf. Ein erfolgreicher Pfadcheck bedeutet, dass die Datei vorhanden ist. Ob ihr Inhalt richtig aussieht oder ihr Ton hörbar abgespielt wird, ergibt sich aus der Browserprüfung.

## Testaufbau und Ergebnis

Die Browserklassen werden in den Tests in getrennten Kontexten des Node-Moduls `node:vm` geladen. Benötigte Browserobjekte können als Testobjekte bereitgestellt werden. So lassen sich etwa eine Spieluhr gezielt fortschalten oder Tastatureingaben simulieren. Die Modulstruktur des produktiven Spiels bleibt dabei dieselbe. [Testhilfen](../../tests/test-helpers.mjs)

| Beispiele | Abgedecktes Verhalten |
| --- | --- |
| [Spieluhr](../../tests/game-clock.test.mjs) und [Lebenszyklus](../../tests/game-lifecycle.test.mjs) | Pause, Neustart und Stillstand nach dem Tod |
| [Spielmechanik](../../tests/review-gameplay.test.mjs) und [Spawner](../../tests/enemy-spawner.test.mjs) | Retry-Inventar, Flossentreffer, Felsen, Projektilkontakt und Gegnerbudget |
| [Touchsteuerung](../../tests/mobile-controls.test.mjs) und [Dialoglayout](../../tests/responsive-dialogs.test.mjs) | Voraussetzungen für Touch, Kontextmenü und Regeln für den sichtbaren Bereich |
| [Audio](../../tests/audio-manager.test.mjs) und [Statusleisten](../../tests/game-status-renderer.test.mjs) | Musikwechsel, Mute und Aktualisierung der grafischen Anzeigen |

Beim Prüflauf auf Codebasis `e16e440` wurden 47 HTML-Skriptreferenzen, 9 Stylesheets und 202 konfigurierte Assets validiert. Die 64 vorhandenen Tests wurden mit Node.js 24.22.1 erfolgreich ausgeführt.

[Lokaler Start](../../README.md#quickstart) · [Betrieb](../operations/deployment.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
