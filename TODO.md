# Sharky Projekt – Tagesplanung ohne Commits

Stand: 18.05.2026  
Zeitrahmen: ca. 10 Tage  
Arbeitszeit: maximal ca. 8 Stunden pro Tag  
Ziel: Ein sauberes, spielbares und portfolio-taugliches Unterwasser-Canvas-Spiel mit Sharky.

---

## Tag 1 – Setup, Struktur und Projektstart

### Ziel des Tages

Das Projekt wird sauber aufgesetzt, damit die spätere Entwicklung nicht im Chaos landet.  
Heute entsteht die technische und strukturelle Basis für das Spiel.

### Aufgaben

- [x] Projektordner erstellen
- [x] Git-Repository initialisieren
- [x] Grundstruktur für das Projekt anlegen
- [x] `index.html` erstellen
- [x] `imprint.html` erstellen
- [x] `styles.css` erstellen
- [x] Erste JavaScript-Dateien anlegen
- [x] Canvas-Grundstruktur in HTML vorbereiten
- [x] Erste Spielfläche sichtbar machen
- [x] Grundlayout für Startscreen vorbereiten
- [x] Grundlayout für Pause-Menü vorbereiten
- [x] Levelauswahl im Startscreen vorbereiten
- [x] HUD mit Level, Münzen und Pause-Button vorbereiten
- [x] Mobile-Control-Bereich als Platzhalter vorbereiten
- [ ] Sharky-Grafiken sichten
- [ ] Assets sinnvoll in den Projektordner einsortieren
- [x] Prüfen, ob das Projekt im Browser sauber startet
- [x] Prüfen, ob keine Fehler in der Konsole auftauchen

### Tagesergebnis

- [x] Projekt startet im Browser
- [x] Canvas ist sichtbar
- [x] Ordnerstruktur ist sauber
- [x] Grundlayout steht
- [x] Startscreen ist vorbereitet
- [x] Pause-Menü ist vorbereitet
- [ ] Erste Assets sind sortiert
- [x] Grundbasis steht

---

## Tag 2 – Game Loop, Sharky-Bewegung und Objektbasis

### Ziel des Tages

Sharky soll sichtbar sein und sich grundsätzlich bewegen können.  
Das Spiel soll sich zum ersten Mal wie ein echtes Spiel anfühlen.  
Da Sharky ein Unterwasser-Spiel ist, wird keine klassische Sprung- und Gravity-Logik verwendet, sondern freie Bewegung in vier Richtungen.

### Aufgaben

- [x] Game Loop aufbauen
- [x] Canvas Rendering vorbereiten
- [x] Sharky auf dem Canvas anzeigen
- [x] Tastatursteuerung einbauen
- [x] Bewegung nach links einbauen
- [x] Bewegung nach rechts einbauen
- [x] Bewegung nach oben einbauen
- [x] Bewegung nach unten einbauen
- [x] Unterwasserbewegung vorbereiten
- [x] Bewegungsgeschwindigkeit abstimmen
- [x] Diagonale Bewegung normalisieren
- [x] Sharky innerhalb der Canvas-Grenzen halten
- [x] Spiel pausierbar machen
- [x] Spiel fortsetzbar machen
- [x] Spiel neustartbar machen
- [x] Rückkehr zum Hauptmenü ermöglichen
- [x] Debug-Modus über URL vorbereiten
- [x] Debug-Hitbox für Sharky vorbereiten
- [x] FPS-Anzeige im Debug-Modus vorbereiten
- [x] `DrawableObject` als Basisklasse vorbereiten
- [x] `MovableObject` als bewegliche Basisklasse vorbereiten
- [x] `Character` als Sharky-Klasse vorbereiten
- [x] Klassendateien nach `name.class.js`-Konvention benennen
- [x] Script-Reihenfolge bereinigen
- [x] Tag-3-Dateien bewusst nicht einbinden
- [x] Code frühzeitig klein und lesbar halten
- [x] Prüfen, ob Fehler in der Konsole auftauchen

### Tagesergebnis

- [x] Sharky ist sichtbar
- [x] Sharky kann sich nach links und rechts bewegen
- [x] Sharky kann sich nach oben und unten bewegen
- [x] Diagonale Bewegung fühlt sich gleichmäßiger an
- [x] Game Loop läuft stabil
- [x] Unterwasserbewegung ist technisch vorbereitet
- [x] Objektarchitektur ist vorbereitet
- [x] Debug-Modus ist vorhanden
- [x] Dateinamen folgen der Projektkonvention
- [x] Keine unnötigen Fehler in der Konsole

---

## Tag 3 – Welt, Kamera und Level-Grundlage

### Ziel des Tages

Die Spielwelt soll entstehen.  
Sharky soll sich nicht mehr nur auf einem leeren Canvas bewegen, sondern in einem echten Level unterwegs sein.  
Die Kamera soll Sharky sinnvoll folgen und die Welt soll breiter als der sichtbare Canvas werden.

### Aufgaben

- [x] Levelbreite definieren
- [x] Levelhöhe definieren
- [x] Levelgrenzen einbauen
- [x] Sharky innerhalb der Levelgrenzen halten
- [x] Kamera / Viewport-Bewegung umsetzen
- [x] Kamera an Sharkys Position koppeln
- [x] Kamera am linken Levelrand stoppen
- [x] Kamera am rechten Levelrand stoppen
- [x] Leveldaten sauber strukturieren
- [x] Erste `Level`-Klasse vorbereiten
- [x] Erste `BackgroundObject`-Klasse vorbereiten
- [x] Level 1 als Datenstruktur anlegen
- [x] Level 2 als spätere Datenstruktur vorbereiten
- [x] Feste Bereiche oder Hinderniszonen vorbereiten
- [x] Bodenlogik durch Unterwasser-Levelgrenzen ersetzen
- [x] Plattformlogik durch Hindernisse oder feste Kollisionsbereiche ersetzen
- [x] Assets sinnvoll über zentrale Konfiguration laden
- [x] Spielfeld optisch prüfen
- [x] Debug-Anzeige um Kamera- und Levelwerte erweitern
- [x] Performance grob prüfen
- [ ] Hintergrundgrafiken einbauen
- [ ] Hintergrund über die Levelbreite darstellen
- [ ] Parallax-Hintergrund vorbereiten oder grob vormerken

### Tagesergebnis

- [x] Erste Spielwelt ist sichtbar
- [x] Level ist breiter als der sichtbare Canvas
- [x] Kamera folgt Sharky sinnvoll
- [x] Kamera bleibt innerhalb der Levelgrenzen
- [x] Sharky bleibt innerhalb der Levelgrenzen
- [x] Levelstruktur ist technisch vorbereitet
- [ ] Hintergrund ist vorbereitet oder sichtbar
- [ ] Projekt wirkt nicht mehr wie ein leerer Testscreen

---

## Tag 4 – Gegner, Kollisionen und erste Gefahren

### Ziel des Tages

Das Spiel braucht Gefahr.  
Gegner sollen im Level erscheinen, sich bewegen und mit Sharky kollidieren können.

### Aufgaben

- [x] `Enemy`-Basisklasse vorbereiten
- [x] Erste Gegnerklasse erstellen
- [x] Gegnerlogik vorbereiten
- [x] Erste Gegner anzeigen
- [x] Gegner über Leveldaten platzieren
- [x] Gegner relativ zur Kamera anzeigen
- [x] Gegnerbewegung einbauen
- [x] Kollisionslogik auslagern
- [x] Kollision zwischen Sharky und Gegnern prüfen
- [x] Kollisionen mit Kamera- und Levelposition testen
- [x] Schaden vorbereiten
- [x] Lebenssystem vorbereiten
- [x] Unverwundbarkeitszeit nach Treffer vorbereiten
- [x] Hitboxen testen
- [x] Kollisionen möglichst einfach und nachvollziehbar halten
- [x] Fehlerfälle testen
- [x] Debug-Modus für Gegner-Hitboxen erweitern

### Tagesergebnis

- [x] Gegner erscheinen im Level
- [x] Gegner werden korrekt in der Welt platziert
- [x] Gegner bewegen sich
- [x] Kollisionen werden erkannt
- [x] Sharky kann Schaden bekommen
- [x] Kollisionscode ist sauber ausgelagert
- [x] Debug-Hitboxen helfen beim Testen

---

## Tag 5 – UI, Leben, Coins, Ressourcen und Spielstatus

### Ziel des Tages

Das Spiel bekommt klare Rückmeldung für den Spieler.  
Man soll sehen, was passiert, wie viel Leben Sharky hat, wie viele Münzen gesammelt wurden und welche Ressourcen verfügbar sind.

### Aufgaben

- [ ] Lebensanzeige einbauen
- [ ] Coin-Anzeige weiter ausbauen
- [ ] Coins im Level platzieren
- [ ] Coins über Leveldaten verwalten
- [ ] Coins relativ zur Kamera anzeigen
- [ ] Coins einsammelbar machen
- [ ] Giftflaschen als Ressource vorbereiten
- [ ] Anzeige für Giftflaschen vorbereiten
- [ ] Blasenangriff im UI berücksichtigen
- [ ] Spielstatus vorbereiten
- [ ] Startscreen optisch verbessern
- [ ] Startscreen mit Levelauswahl und Storytext verfeinern
- [ ] Game Over Screen vorbereiten
- [ ] Win Screen vorbereiten
- [ ] Neustart vorbereiten
- [ ] UI lesbar und sauber gestalten
- [ ] Prüfen, ob die UI nicht vom Spiel ablenkt

### Tagesergebnis

- [ ] Leben wird angezeigt
- [ ] Coins können gesammelt werden
- [ ] Giftflaschen sind als Ressource vorbereitet
- [ ] Bubble- und Giftangriff sind im UI berücksichtigt
- [ ] Start, Sieg und Niederlage sind vorbereitet
- [ ] Spieler bekommt klare Rückmeldung
- [ ] Das Spiel hat eine erkennbare Struktur

---

## Tag 6 – Level 1 fertigstellen

### Ziel des Tages

Level 1 soll vollständig spielbar werden.  
Heute geht es darum, aus der Technik ein echtes kleines Spielerlebnis zu machen.

### Aufgaben

- [ ] Level 1 final aufbauen
- [ ] Hintergrund und Levelobjekte passend platzieren
- [ ] Gegner sinnvoll platzieren
- [ ] Coins sinnvoll platzieren
- [ ] Giftflaschen sinnvoll platzieren
- [ ] Ziel / Levelende definieren
- [ ] Endboss für Level 1 vorbereiten
- [ ] Endboss in Level 1 platzieren
- [ ] Siegbedingung über Endboss oder Levelende definieren
- [ ] Schwierigkeit testen
- [ ] Spielfluss prüfen
- [ ] Sharky-Animationen verbessern
- [ ] Gegner-Animationen grob vorbereiten
- [ ] Kleinere Bugs beheben
- [ ] Performance prüfen
- [ ] Code bei Bedarf aufteilen
- [ ] Level 1 mehrfach durchspielen

### Tagesergebnis

- [ ] Level 1 ist komplett spielbar
- [ ] Man kann Level 1 gewinnen
- [ ] Man kann in Level 1 verlieren
- [ ] Endboss für Level 1 ist vorbereitet oder spielbar
- [ ] Schwierigkeit fühlt sich fair an
- [ ] Keine offensichtlichen Bugs im ersten Level

---

## Tag 7 – Level 2, Shop und kleine Lore

### Ziel des Tages

Das Spiel soll größer und runder wirken.  
Ein zweites Level, eine kleine Story und ein einfacher Shop geben dem Projekt mehr Charakter, ohne es unnötig aufzublasen.

### Aufgaben

- [ ] Level 2 erstellen
- [ ] Level 2 etwas anders gestalten als Level 1
- [ ] Schwierigkeit leicht steigern
- [ ] Gegnerplatzierung für Level 2 testen
- [ ] Coins sinnvoll verteilen
- [ ] Giftflaschen sinnvoll verteilen
- [ ] Levelwechsel einbauen
- [ ] Shop zwischen Level 1 und Level 2 vorbereiten
- [ ] Einfache Upgrades definieren
- [ ] Coins als Kaufressource nutzen
- [ ] Gekaufte Upgrades während der Spielsession anwenden
- [ ] Level 2 Endboss vorbereiten
- [ ] Kleine Lore / Story einbauen
- [ ] Spieltexte auf Deutsch sauber formulieren
- [ ] Level 2 testweise durchspielen
- [ ] Prüfen, ob Level 2 nicht zu groß oder zu schwer wird

### Tagesergebnis

- [ ] Level 2 ist spielbar
- [ ] Levelwechsel funktioniert
- [ ] Shop zwischen den Leveln ist vorbereitet
- [ ] Erste Upgrades sind vorbereitet oder nutzbar
- [ ] Kleine Story ist eingebaut
- [ ] Das Spiel wirkt vollständiger
- [ ] Beide Level passen vom Stil zusammen

---

## Tag 8 – Mobile Steuerung und Responsive Design

### Ziel des Tages

Das Spiel soll auch auf kleineren Geräten funktionieren.  
Die mobile Steuerung muss benutzbar sein und das Layout darf nicht auseinanderfallen.

### Aufgaben

- [ ] Mobile-Control-Bereich finalisieren
- [ ] Bewegung per mobilem Cursor oder Joystick einbauen
- [ ] Touch Events umsetzen
- [ ] Bewegung nach links per Touch testen
- [ ] Bewegung nach rechts per Touch testen
- [ ] Bewegung nach oben per Touch testen
- [ ] Bewegung nach unten per Touch testen
- [ ] Blasenangriff per Touch testen
- [ ] Giftangriff per Touch testen
- [ ] Angriffbuttons für linke und rechte Hand gut erreichbar platzieren
- [ ] Canvas responsiv machen
- [ ] Startscreen mobil prüfen
- [ ] Pause-Menü mobil prüfen
- [ ] Game Over Screen mobil prüfen
- [ ] Win Screen mobil prüfen
- [ ] Shop mobil prüfen
- [ ] Querformat prüfen
- [ ] Kleine Displays testen
- [ ] CSS aufräumen
- [ ] Buttons groß genug und gut erreichbar machen

### Tagesergebnis

- [ ] Mobile Steuerung funktioniert
- [ ] Sharky kann mobil in vier Richtungen bewegt werden
- [ ] Bubble- und Giftangriff funktionieren per Touch
- [ ] Spiel ist auf kleinen Displays nutzbar
- [ ] UI bleibt lesbar
- [ ] Touch Buttons fühlen sich nicht fummelig an
- [ ] Responsive Darstellung wirkt sauber

---

## Tag 9 – Polishing, Debugging und Tests

### Ziel des Tages

Heute wird das Projekt sauber gemacht.  
Alles, was wackelt, soll stabil werden. Alles, was unfertig wirkt, soll aufgeräumt werden.

### Aufgaben

- [ ] Animationen final prüfen
- [ ] Bewegungsgefühl verbessern
- [ ] Unterwasserbewegung feinjustieren
- [ ] Diagonale Bewegung prüfen und bei Bedarf normalisieren
- [ ] Ladezeiten prüfen
- [ ] Performance grob testen
- [ ] Debug-Modus final prüfen
- [ ] Debug-Modus mit Hitboxen, FPS, Kamera und Levelwerten final prüfen
- [ ] Kollisionen gezielt testen
- [ ] Gegnerverhalten testen
- [ ] Coin-Sammlung testen
- [ ] Giftflaschen-Sammlung testen
- [ ] Bubble-Angriff testen
- [ ] Giftangriff testen
- [ ] Shop testen
- [ ] Steuerung testen
- [ ] Mobile Steuerung testen
- [ ] Neustart testen
- [ ] Pause-Menü testen
- [ ] Levelwechsel testen
- [ ] Game Over testen
- [ ] Win Screen testen
- [ ] Konsole auf Fehler prüfen
- [ ] Unnötigen Code entfernen
- [ ] Doppelte Logik reduzieren
- [ ] JSDoc für fertige JS-Dateien ergänzen
- [ ] CSS und HTML auf saubere Struktur prüfen
- [ ] Dateien auf sinnvolle Länge prüfen
- [ ] Code bei Bedarf weiter aufteilen

### Tagesergebnis

- [ ] Spiel läuft stabil
- [ ] Debugging-Hilfen sind vorhanden und geprüft
- [ ] Keine offensichtlichen Konsolenfehler
- [ ] Code wirkt sauber und wartbar
- [ ] Spielgefühl ist flüssig
- [ ] Mobile Steuerung ist brauchbar
- [ ] Das Spiel wirkt deutlich polierter

---

## Tag 10 – Finale Prüfung und Abgabevorbereitung

### Ziel des Tages
 
Der Fokus liegt auf finaler Prüfung, Dokumentation und sauberer Abgabe.

### Aufgaben

- [ ] Komplette Projektcheckliste durchgehen
- [ ] Alle Muss-Kriterien prüfen
- [ ] Alle eigenen Projektregeln prüfen
- [ ] README erstellen
- [ ] Projektbeschreibung schreiben
- [ ] Steuerung dokumentieren
- [ ] Features dokumentieren
- [ ] Debug-Modus dokumentieren
- [ ] Shop und Upgrades dokumentieren
- [ ] Screenshots für Portfolio vorbereiten
- [ ] Kurzen Portfolio-Text vorbereiten
- [ ] `imprint.html` prüfen
- [ ] Keine echten personenbezogenen Daten im Impressum verwenden
- [ ] Responsive Test final durchführen
- [ ] Browser-Test durchführen
- [ ] Performance final grob prüfen
- [ ] Projektstruktur final prüfen
- [ ] Dateinamen und Konventionen final prüfen
- [ ] Kommentare und JSDoc final prüfen
- [ ] Letzte kleine Bugs beheben
- [ ] Projekt für Abgabe vorbereiten

### Tagesergebnis

- [ ] Projekt ist abgabebereit
- [ ] README ist vorhanden
- [ ] Impressum ist vorhanden
- [ ] Spiel läuft stabil
- [ ] Projektstruktur ist sauber
- [ ] Code ist nachvollziehbar
- [ ] Das Projekt kann guten Gewissens ins Portfolio

---

## Puffer-Regel

Wenn an einem Tag etwas nicht fertig wird, wird es nicht hektisch reingedrückt.  
Dann wird es sauber in den nächsten Tag verschoben.

Wichtig bleibt:

- erst spielbar machen
- dann stabil machen
- dann schön machen
- dann dokumentieren

Kein Feature ist wichtiger als ein stabiles Grundspiel.

---

## Eigene Erinnerung

Nicht verzetteln.  
Nicht zu viele Features auf einmal.  
Lieber ein sauberes Spiel mit zwei guten Leveln als ein überladenes Projekt mit Baustellen überall.

Das Projekt soll am Ende zeigen, dass ich strukturiert, sauber und mit Gefühl für Qualität arbeiten kann.

Erst der Hai, dann der Hype.