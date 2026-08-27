# Technische Dokumentation

Diese Dokumentation beschreibt den aktuellen technischen Stand von
**Sharky – Jump and Swim**. Sie richtet sich an Entwickler, Reviewer und
Projektbeteiligte, die Architektur, Spielablauf, Steuerung, Qualitätssicherung
und Bereitstellung des Projekts nachvollziehen möchten.

Sharky ist ein responsives 2D-Unterwasserspiel auf Basis von Vanilla
JavaScript und HTML5 Canvas. Das Projekt verwendet objektorientierte Klassen,
konfigurierbare Level und getrennte Systeme für Rendering, Eingaben,
Kollisionen, Gegner, Angriffe, Audio und Benutzeroberfläche.

Die öffentliche Projektvorstellung mit Funktionsübersicht, Tech-Stack,
Installation und Spielanleitung befindet sich später in der zentralen
[`README.md`](../README.md) des Repositorys.

## Dokumentationsübersicht

### Architektur

| Dokument | Inhalt |
| --- | --- |
| [Anwendungsarchitektur](architecture/application.md) | Projektstruktur, Anwendungsschichten, Verantwortlichkeiten und grundlegender Datenfluss |
| [Game Loop und Spielzustand](architecture/game-loop-state.md) | Hauptschleife, Zeitsteuerung, Statuswechsel, Pause, Restart und Level-Lebenszyklus |
| [Rendering und Assets](architecture/rendering-assets.md) | Canvas-Rendering, Kamera, Zeichenreihenfolge, Statusanzeigen und zentrale Asset-Konfiguration |

### Features

| Dokument | Inhalt |
| --- | --- |
| [Spieler und Kampfsystem](features/player-combat.md) | Charaktersteuerung, Animationen, Lebenssystem, Angriffe, Treffer und Sammelobjekte |
| [Gegner und Levelsystem](features/enemies-levels.md) | Gegnertypen, Endboss, dynamische Spawns, Schwierigkeitswerte und Levelaufbau |
| [Interface und Steuerung](features/interface-controls.md) | Hauptmenü, Dialoge, HUD, Tastatursteuerung, Touch-Steuerung und Orientierungshinweis |
| [Audio und Anzeigeeinstellungen](features/audio-display-settings.md) | Musik, Soundeffekte, Lautstärken, Mute, Vollbild, Farbschema und gespeicherte Einstellungen |

### Engineering

| Dokument | Inhalt |
| --- | --- |
| [Code-Konventionen](engineering/conventions.md) | Benennung, Klassenstruktur, JSDoc, Funktionsaufbau und gemeinsame Entwicklungsstandards |
| [Tests und Projektvalidierung](engineering/testing-validation.md) | Teststruktur, Testbereiche, Validierungsskript und vollständige Prüfkommandos |
| [Styling und Barrierefreiheit](engineering/styling-accessibility.md) | CSS-Struktur, Responsive Design, mobile Ausrichtung, Tastaturbedienung und ARIA |

### Betrieb

| Dokument | Inhalt |
| --- | --- |
| [Entwicklungsworkflow](operations/development-workflow.md) | Branches, Commits, Änderungsprüfung und lokaler Entwicklungsablauf |
| [Deployment](operations/deployment.md) | Voraussetzungen, lokale Bereitstellung, Produktionsprüfung und Veröffentlichung |

## Empfohlene Lesereihenfolge

Für einen vollständigen technischen Einstieg:

1. [Anwendungsarchitektur](architecture/application.md)
2. [Game Loop und Spielzustand](architecture/game-loop-state.md)
3. [Rendering und Assets](architecture/rendering-assets.md)
4. [Spieler und Kampfsystem](features/player-combat.md)
5. [Gegner und Levelsystem](features/enemies-levels.md)
6. Interface-, Engineering- und Betriebsdokumentation nach Bedarf

## Zielgruppen

### Entwickler

Entwickler erhalten einen Überblick über Klassen, Verantwortlichkeiten,
Datenfluss und Erweiterungspunkte des Spiels.

### Reviewer

Reviewer können technische Entscheidungen, Funktionsumfang,
Qualitätssicherung und die Umsetzung der Projektanforderungen nachvollziehen.

### Projektbeteiligte

Projektbeteiligte finden Informationen zum lokalen Start, zur Bedienung,
zum Testen und zur Veröffentlichung des Spiels.

## Dokumentationsgrundsätze

- Die Dokumentation bildet den tatsächlichen Projektstand ab.
- Technische Details werden im jeweils zuständigen Dokument gepflegt.
- Historische Zwischenstände und verworfene Lösungsansätze sind nicht Teil der
  Abschlussdokumentation.
- Pfade und Klassennamen entsprechen der vorhandenen Projektstruktur.
- Relative Links beziehen sich auf das Repository.
- Codebeispiele zeigen die bestehende Architektur und keine alternative
  Neuimplementierung.
- Änderungen an Architektur, Steuerung, Konfiguration oder Tests werden
  zusammen mit dem betroffenen Code dokumentiert.
- Bekannte Grenzen werden offen benannt und nicht als implementierte Funktionen
  dargestellt.

## Technischer Überblick

| Bereich | Umsetzung |
| --- | --- |
| Anwendungstyp | Responsives 2D-Canvas-Spiel |
| Sprache | Vanilla JavaScript |
| Architektur | Objektorientierte Klassen und getrennte Fachsysteme |
| Darstellung | HTML5 Canvas und HTML-Benutzeroberfläche |
| Styling | Modulares CSS |
| Level | Zwei konfigurierbare Riffzonen |
| Eingaben | Tastatur und geräteabhängige Touch-Steuerung |
| Audio | Musik und Soundeffekte über `HTMLAudioElement` |
| Speicherung | Local Storage für ausgewählte Einstellungen |
| Tests | Node.js Test Runner |
| Validierung | Projektspezifisches Node.js-Validierungsskript |
| Build-Schritt | Nicht erforderlich |
| Mindestversion | Node.js 18 |

## Qualitätsstand

Der dokumentierte Projektstand umfasst automatisierte Prüfungen für unter
anderem:

- registrierte Musik- und Sounddateien
- Audiozustand und persistierte Einstellungen
- Bossbewegung und Bossausrichtung
- Long-Idle-Verhalten des Spielers
- Angriffe, Trefferflächen und Sammelobjekte
- Gegnerlimits und dynamische Spawnpositionen
- pausierte Spielzeit
- Game-over- und Restart-Abläufe
- Status- und Bossanzeigen
- benötigte Interface-Elemente
- Tastatur- und Touch-Steuerung
- Levelkonfiguration und Schwierigkeitswerte
- responsive Styles
- unerwünschte Konsolenausgaben

Automatisierte Tests ersetzen keine vollständige manuelle Prüfung in
verschiedenen Browsern und auf realen Touch-Geräten.