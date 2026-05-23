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

- [x] Lebensanzeige einbauen
- [x] Coin-Anzeige weiter ausbauen
- [x] Coins im Level platzieren
- [x] Coins über Leveldaten verwalten
- [x] Coins relativ zur Kamera anzeigen
- [x] Coins einsammelbar machen
- [x] Giftflaschen als Ressource vorbereiten
- [x] Anzeige für Giftflaschen vorbereiten
- [x] Blasenangriff im UI berücksichtigen
- [x] Spielstatus vorbereiten
- [x] Startscreen optisch verbessern
- [x] Game Over Screen vorbereiten
- [x] Win Screen vorbereiten
- [x] Neustart vorbereiten
- [x] UI lesbar und sauber gestalten
- [x] Prüfen, ob die UI nicht vom Spiel ablenkt
- [ ] Startscreen mit Levelauswahl und Storytext verfeinern

### Tagesergebnis

- [x] Leben wird angezeigt
- [x] Coins können gesammelt werden
- [x] Giftflaschen sind als Ressource vorbereitet
- [x] Bubble- und Giftangriff sind im UI berücksichtigt
- [x] Start, Sieg und Niederlage sind vorbereitet
- [x] Spieler bekommt klare Rückmeldung
- [x] Das Spiel hat eine erkennbare Struktur

---

## Tag 6 – Level 1 fertigstellen

### Ziel des Tages

Level 1 soll vollständig spielbar werden.  
Heute geht es darum, aus der Technik ein echtes kleines Spielerlebnis zu machen.

### Aufgaben

- [x] Level 1 final aufbauen
- [x] Hintergrund und Levelobjekte passend platzieren
- [x] Gegner sinnvoll platzieren
- [x] Coins sinnvoll platzieren
- [x] Giftflaschen sinnvoll platzieren
- [x] Ziel / Levelende definieren
- [x] Endboss für Level 1 vorbereiten
- [x] Endboss in Level 1 platzieren
- [x] Siegbedingung über Endboss oder Levelende definieren
- [x] Schwierigkeit testen
- [x] Spielfluss prüfen
- [x] Kleinere Bugs beheben
- [x] Performance prüfen
- [x] Code bei Bedarf aufteilen
- [x] Level 1 mehrfach durchspielen
- [ ] Sharky-Animationen verbessern
- [ ] Gegner-Animationen grob vorbereiten

### Tagesergebnis

- [x] Level 1 ist komplett spielbar
- [x] Man kann Level 1 gewinnen
- [x] Man kann in Level 1 verlieren
- [x] Endboss für Level 1 ist vorbereitet oder spielbar
- [ ] Schwierigkeit fühlt sich fair an
- [x] Keine offensichtlichen Bugs im ersten Level

---

## Tag 7 – Level 2, Shop und kleine Lore

### Ziel des Tages

Das Spiel soll größer und runder wirken.  
Ein zweites Level, eine kleine Story und ein einfacher Shop geben dem Projekt mehr Charakter, ohne es unnötig aufzublasen.

### Aufgaben

- [x] Level 2 erstellen
- [x] Level 2 etwas anders gestalten als Level 1
- [x] Schwierigkeit leicht steigern
- [x] Gegnerplatzierung für Level 2 testen
- [x] Coins sinnvoll verteilen
- [x] Giftflaschen sinnvoll verteilen
- [x] Levelwechsel einbauen
- [x] Shop zwischen Level 1 und Level 2 vorbereiten
- [x] Einfache Upgrades definieren
- [x] Coins als Kaufressource nutzen
- [x] Gekaufte Upgrades während der Spielsession anwenden
- [x] Level 2 Endboss vorbereiten
- [x] Kleine Lore / Story einbauen
- [x] Spieltexte auf Deutsch sauber formulieren
- [x] Level 2 testweise durchspielen
- [x] Prüfen, ob Level 2 nicht zu groß oder zu schwer wird

### Tagesergebnis

- [x] Level 2 ist spielbar
- [x] Levelwechsel funktioniert
- [x] Shop zwischen den Leveln ist vorbereitet
- [x] Erste Upgrades sind vorbereitet oder nutzbar
- [x] Kleine Story ist eingebaut
- [x] Das Spiel wirkt vollständiger
- [x] Beide Level passen vom Stil zusammen

---

## Tag 8 – Mobile Steuerung und Responsive Design

### Ziel des Tages

Das Spiel soll auch auf kleineren Geräten funktionieren.  
Die mobile Steuerung muss benutzbar sein und das Layout darf nicht auseinanderfallen.

### Aufgaben

- [x] Mobile-Control-Bereich finalisieren
- [x] Bewegung per mobilem Cursor oder Joystick einbauen
- [x] Touch Events umsetzen
- [x] Bewegung nach links per Touch testen
- [x] Bewegung nach rechts per Touch testen
- [x] Bewegung nach oben per Touch testen
- [x] Bewegung nach unten per Touch testen
- [x] Blasenangriff per Touch testen
- [x] Giftangriff per Touch testen
- [x] Angriffbuttons für linke und rechte Hand gut erreichbar platzieren
- [x] Canvas responsiv machen
- [x] Startscreen mobil prüfen
- [x] Pause-Menü mobil prüfen
- [x] Game Over Screen mobil prüfen
- [x] Win Screen mobil prüfen
- [x] Shop mobil prüfen
- [x] Querformat prüfen
- [x] Kleine Displays testen
- [x] CSS aufräumen
- [x] Buttons groß genug und gut erreichbar machen

### Tagesergebnis

- [ ] Mobile Steuerung funktioniert
- [ ] Sharky kann mobil in vier Richtungen bewegt werden
- [ ] Bubble- und Giftangriff funktionieren per Touch
- [ ] Spiel ist auf kleinen Displays nutzbar
- [ ] UI bleibt lesbar
- [ ] Touch Buttons fühlen sich nicht fummelig an
- [ ] Responsive Darstellung wirkt sauber

---

## Tag 8.25 – Sharky-Angriffssystem

### Ziel des Tages

Sharky bekommt seine grundlegenden Angriffsmöglichkeiten.  
Bevor Grafiken und Layer eingebaut werden, müssen Fin Slap, Poison Shot und Bubble Trap technisch sauber funktionieren.

### Aufgaben

- [x] Fin Slap als Nahkampfangriff vorbereiten
- [x] Fin Slap gegen normale Gegner ermöglichen
- [x] Fin Slap gegen Bossgegner ermöglichen
- [x] Poison Shot als Projektil vorbereiten
- [x] Poison Shot gegen normale Gegner ermöglichen
- [x] Poison Shot gegen Bossgegner ermöglichen
- [x] Poison Damage over Time vorbereiten
- [x] Giftflaschen als Ressource für Poison Shot verwenden
- [x] Bubble Trap als Blasen-Projektil vorbereiten
- [x] Bubble Trap gegen kleine normale Gegner ermöglichen
- [x] Bubble Trap gegen Bossgegner blockieren
- [x] Gefangene Gegner bewegungsunfähig machen
- [x] Gefangene Gegner am Kontaktschaden hindern
- [x] Angriff-Cooldowns vorbereiten
- [x] Angriff-Hitboxen im Debug-Modus anzeigen
- [x] Mobile Angriffbuttons anbinden
- [x] Angriffssystem für spätere Attack-Assets vorbereiten

### Tagesergebnis

- [x] Sharky kann aktiv kämpfen
- [x] Normale Gegner können besiegt oder gefangen werden
- [x] Bossgegner können Schaden durch Fin Slap und Poison Shot bekommen
- [x] Bubble Trap funktioniert nur gegen normale Gegner
- [x] Poison Shot verursacht Schaden über Zeit
- [x] Angriffssystem ist vorbereitet für spätere Attack-Assets

---

## Tag 8.5 – Grafik-, Asset- und Layer-Integration

### Ziel des Tages

Das Spiel bekommt seine visuelle Grundlage.  
Alle wichtigen Spielobjekte, Angriffe und Levelbereiche sollen so vorbereitet werden, dass später nur noch die richtigen Bildpfade eingetragen werden müssen.

### Aufgaben

- [ ] Zentrale Asset-Pfade vorbereiten
- [ ] Sharky-Grafikpfad vorbereiten
- [ ] Gegner-Grafikpfad vorbereiten
- [ ] Endboss-Grafikpfad vorbereiten
- [ ] Collectible-Grafikpfade vorbereiten
- [ ] Finish-Grafikpfad vorbereiten
- [ ] Angriffsgrafiken vorbereiten
- [ ] Level-1-Hintergrundlayer vorbereiten
- [ ] Level-2-Hintergrundlayer vorbereiten
- [ ] Parallax-Werte vorbereiten
- [ ] Fallbacks erhalten
- [ ] Spiel ohne echte Pfade weiter lauffähig halten
- [ ] Assets sinnvoll einsortieren
- [ ] Erste echte Bildpfade testweise eintragen
- [ ] Bildpfade einzeln testen
- [ ] Konsole auf 404-Fehler prüfen
- [ ] Spielfeld optisch prüfen
- [ ] Performance grob prüfen

### Tagesergebnis

- [ ] Alle wichtigen Spielobjekte sind bildfähig
- [ ] Alle Angriffseffekte sind bildfähig
- [ ] Beide Level unterstützen mehrere Hintergrundlayer
- [ ] Bildpfade können zentral eingetragen werden
- [ ] Das Spiel bleibt ohne echte Bildpfade stabil
- [ ] Das Spiel wirkt visuell deutlich mehr wie ein echtes Spiel

---

## Tag 9 – Neues Hauptmenü und Startseiten-UX

### Ziel des Tages

Das Spiel bekommt ein echtes Hauptmenü vor dem eigentlichen Spielstart.  
Der Einstieg soll einladend, hochwertig und klar strukturiert wirken.

### Aufgaben

- [ ] Eigenen Startseiten-Bereich vor dem Spiel aufbauen
- [ ] Bisherigen Overlay-Startscreen vom echten Hauptmenü trennen
- [ ] Hero-Bereich mit einladender Gestaltung erstellen
- [ ] Hintergrundbild oder Video-Bereich vorbereiten
- [ ] Optionalen animierten Hintergrund vorbereiten
- [ ] Hauptnavigation anlegen
- [ ] Menüpunkt „Spiel starten“ vorbereiten
- [ ] Menüpunkt „Levelauswahl“ vorbereiten
- [ ] Menüpunkt „Einstellungen“ vorbereiten
- [ ] Menüpunkt „Anleitung“ vorbereiten
- [ ] Menüpunkt „Geschichte / Lore“ vorbereiten
- [ ] Menüpunkt „Impressum“ einbinden
- [ ] Start-Button logisch mit Level 1 verbinden
- [ ] Levelauswahl sauber öffnen und schließen
- [ ] Level 2 als Test- oder freigeschaltete Option klar darstellen
- [ ] Menüführung auf Desktop prüfen
- [ ] Menüführung auf Mobile prüfen
- [ ] Texte freundlich und verständlich formulieren
- [ ] UI/UX freundlich und einladend gestalten
- [ ] Konsole auf Fehler prüfen

### Tagesergebnis

- [ ] Das Spiel hat ein echtes Hauptmenü
- [ ] Der Einstieg wirkt professioneller und einladender
- [ ] Spieler können klar zwischen Start, Levelauswahl, Anleitung, Einstellungen und Lore wählen
- [ ] Das eigentliche Spiel startet sauber aus dem Hauptmenü
- [ ] Der alte Startscreen wirkt nicht mehr wie ein Pause-Menü

---

## Tag 10 – Ingame-UI, Schnellbuttons und Dialoge

### Ziel des Tages

Das Spiel bekommt eine komfortable Ingame-Bedienung.  
Wichtige Funktionen sollen direkt am rechten Rand erreichbar sein, ohne das Spielgefühl zu stören.

### Aufgaben

- [ ] Rechtes Ingame-Button-Menü aufbauen
- [ ] Musik-Button vorbereiten
- [ ] Einstellungs-Zahnrad vorbereiten
- [ ] Pause / Play Button vorbereiten
- [ ] Pause / Play Button abhängig vom Spielzustand umschalten
- [ ] Kleines Einstellungs-Dialogfenster im Spiel einbauen
- [ ] Einstellungsdialog öffnen und schließen
- [ ] Spiel bei geöffnetem Einstellungsdialog pausieren oder kontrolliert weiterlaufen lassen
- [ ] Musikstatus im UI anzeigen
- [ ] Pause-Status im UI anzeigen
- [ ] Bestehendes Pause-Menü mit neuer Ingame-Logik abstimmen
- [ ] Dialoge klar vom Hauptmenü trennen
- [ ] Dialoge klar vom Shop trennen
- [ ] Mobile Nutzbarkeit prüfen
- [ ] Desktop Nutzbarkeit prüfen
- [ ] Buttons groß genug und gut erreichbar machen
- [ ] Konsole auf Fehler prüfen

### Tagesergebnis

- [ ] Im Spiel gibt es eine kleine Bedienleiste am rechten Rand
- [ ] Musik kann über ein Icon vorbereitet gesteuert werden
- [ ] Einstellungen können im kleinen Dialog geöffnet werden
- [ ] Pause und Weiterlaufen funktionieren über einen klaren Button
- [ ] Die Ingame-UI wirkt moderner und praktischer

---

## Tag 11 – Audio-System vorbereiten und integrieren

### Ziel des Tages

Das Spiel bekommt eine saubere technische Basis für Musik und Soundeffekte.  
Audio soll steuerbar sein und später einfach erweitert werden können.

### Aufgaben

- [ ] Audio-Manager planen
- [ ] Audio-Manager als eigene Klasse oder eigenes Modul aufbauen
- [ ] Hintergrundmusik technisch vorbereiten
- [ ] Soundeffekte-Struktur vorbereiten
- [ ] Musik an/aus mit UI verbinden
- [ ] Soundeffekte an/aus vorbereiten
- [ ] Browser-Autoplay-Regeln berücksichtigen
- [ ] Audio erst nach Nutzerinteraktion starten
- [ ] Lautstärke-Grundwerte vorbereiten
- [ ] Audio-Status im Einstellungsdialog anzeigen
- [ ] Soundeffekte für Coin vorbereiten
- [ ] Soundeffekte für Schaden vorbereiten
- [ ] Soundeffekte für Fin Slap vorbereiten
- [ ] Soundeffekte für Poison Shot vorbereiten
- [ ] Soundeffekte für Bubble Trap vorbereiten
- [ ] Soundeffekte für Sieg und Game Over vorbereiten
- [ ] Audio-Dateipfade zentral vorbereiten
- [ ] Spiel ohne Audiodateien stabil halten
- [ ] Konsole auf Audio-Fehler prüfen

### Tagesergebnis

- [ ] Audio-System ist technisch vorbereitet
- [ ] Musik kann aktiviert und deaktiviert werden
- [ ] Soundeffekte sind strukturell vorbereitet
- [ ] Audio lässt sich später leicht mit echten Dateien füllen
- [ ] Das Spiel wirkt technisch vollständiger

---

## Tag 12 – Anleitung, Lore und Story-Bereich

### Ziel des Tages

Das Spiel bekommt mehr Atmosphäre und bessere Orientierung.  
Spieler sollen verstehen, wie das Spiel funktioniert und warum Sharky unterwegs ist.

### Aufgaben

- [ ] Anleitung-Bereich im Hauptmenü aufbauen
- [ ] Steuerung für Desktop erklären
- [ ] Steuerung für Mobile erklären
- [ ] Fin Slap erklären
- [ ] Poison Shot erklären
- [ ] Bubble Trap erklären
- [ ] Coins und Giftflaschen erklären
- [ ] Shop und Upgrades erklären
- [ ] Lore-Bereich im Hauptmenü aufbauen
- [ ] Geschichte von Sharky sauber formulieren
- [ ] Story angenehm lesbar gestalten
- [ ] Story-Fenster oder Story-Screen öffnen und schließen
- [ ] Zurück-Navigation zum Hauptmenü einbauen
- [ ] Optionalen Vorlesen-Button vorbereiten
- [ ] Browser Speech Synthesis grob prüfen
- [ ] Vorlesen später optional aktivierbar machen
- [ ] Mobile Darstellung prüfen
- [ ] Desktop Darstellung prüfen
- [ ] Texte auf Deutsch sauber und sympathisch formulieren

### Tagesergebnis

- [ ] Anleitung ist sauber erreichbar
- [ ] Spieler verstehen Steuerung und Spielziel besser
- [ ] Lore ist als eigener Bereich eingebunden
- [ ] Das Spiel wirkt atmosphärischer
- [ ] Story-Vorlesen ist technisch vorbereitet oder als späteres Feature eingeplant

---

## Tag 13 – Menü-Polish, UI/UX und Audio-Feinschliff

### Ziel des Tages

Die neuen Menü-, UI- und Audio-Bereiche werden zusammengeführt und verbessert.  
Alles soll sich wie ein geschlossenes Spielsystem anfühlen.

### Aufgaben

- [ ] Hauptmenü final prüfen
- [ ] Hero-Bereich optisch polieren
- [ ] Hintergrundbild oder Video-Hintergrund prüfen
- [ ] Levelauswahl final prüfen
- [ ] Einstellungen final prüfen
- [ ] Anleitung final prüfen
- [ ] Lore final prüfen
- [ ] Ingame-Buttons final prüfen
- [ ] Pause / Play final prüfen
- [ ] Musik-Toggle final prüfen
- [ ] Audio-Manager final grob prüfen
- [ ] Shop-Darstellung prüfen
- [ ] Game Over Screen prüfen
- [ ] Win Screen prüfen
- [ ] Mobile Menüs prüfen
- [ ] Desktop Menüs prüfen
- [ ] Kleine Displays testen
- [ ] Querformat testen
- [ ] UI-Texte vereinheitlichen
- [ ] Buttons und Abstände polieren
- [ ] Konsole auf Fehler prüfen

### Tagesergebnis

- [ ] Das Menüsystem wirkt geschlossen und professionell
- [ ] UI und UX sind deutlich verbessert
- [ ] Audio-Grundstruktur ist integriert
- [ ] Hauptmenü und Ingame-UI fühlen sich klar getrennt an
- [ ] Das Projekt wirkt deutlich portfolio-stärker

---

## Tag 14 – Polishing, Debugging und Tests

### Ziel des Tages

Heute wird das Projekt technisch sauber gemacht.  
Alles, was wackelt, soll stabil werden. Alles, was unfertig wirkt, soll aufgeräumt werden.

### Aufgaben

- [ ] Bewegungsgefühl verbessern
- [ ] Unterwasserbewegung feinjustieren
- [ ] Diagonale Bewegung final prüfen
- [ ] Kamera-Verhalten prüfen
- [ ] Levelgrenzen prüfen
- [ ] Kollisionen gezielt testen
- [ ] Gegnerverhalten testen
- [ ] Endboss-Verhalten testen
- [ ] Fin Slap testen
- [ ] Poison Shot testen
- [ ] Poison Damage over Time testen
- [ ] Bubble Trap testen
- [ ] Bubble Trap gegen Bossgegner testen
- [ ] Gefangene Gegner auf Kontaktschaden testen
- [ ] Coin-Sammlung testen
- [ ] Giftflaschen-Sammlung testen
- [ ] Shop testen
- [ ] Upgrades testen
- [ ] Levelwechsel testen
- [ ] Game Over testen
- [ ] Win Screen testen
- [ ] Pause testen
- [ ] Ingame-Settings testen
- [ ] Audio-Toggle testen
- [ ] Mobile Steuerung testen
- [ ] Desktop Steuerung testen
- [ ] Debug-Modus final prüfen
- [ ] Hitboxen prüfen
- [ ] FPS-Anzeige prüfen
- [ ] Kamera- und Levelwerte prüfen
- [ ] Konsole auf Fehler prüfen
- [ ] Ladezeiten grob prüfen
- [ ] Performance grob prüfen
- [ ] Unnötigen Code entfernen
- [ ] Doppelte Logik reduzieren
- [ ] Dateien auf sinnvolle Länge prüfen
- [ ] Code bei Bedarf weiter aufteilen
- [ ] JSDoc für fertige JavaScript-Dateien ergänzen
- [ ] CSS und HTML auf saubere Struktur prüfen

### Tagesergebnis

- [ ] Spiel läuft stabil
- [ ] Debugging-Hilfen sind vorhanden und geprüft
- [ ] Keine offensichtlichen Konsolenfehler
- [ ] Code wirkt sauber und wartbar
- [ ] Spielgefühl ist flüssig
- [ ] Mobile Steuerung ist brauchbar
- [ ] Kampfmechanik funktioniert zuverlässig
- [ ] Das Spiel wirkt deutlich polierter

---

## Tag 15 – Finale Prüfung und Abgabevorbereitung

### Ziel des Tages

Heute wird nichts mehr wild umgebaut.  
Der Fokus liegt auf finaler Prüfung, Dokumentation und sauberer Abgabe.

### Aufgaben

- [ ] Komplette Projektcheckliste durchgehen
- [ ] Alle Muss-Kriterien prüfen
- [ ] Alle eigenen Projektregeln prüfen
- [ ] README erstellen
- [ ] Projektbeschreibung schreiben
- [ ] Steuerung dokumentieren
- [ ] Kampfmechanik dokumentieren
- [ ] Fin Slap dokumentieren
- [ ] Poison Shot dokumentieren
- [ ] Bubble Trap dokumentieren
- [ ] Shop und Upgrades dokumentieren
- [ ] Audio-System dokumentieren
- [ ] Debug-Modus dokumentieren
- [ ] Menüstruktur dokumentieren
- [ ] Lore / Story kurz dokumentieren
- [ ] Asset-Herkunft oder bereitgestelltes Grafikpaket erwähnen
- [ ] Keine externen Assets ohne klare Nutzungsrechte verwenden
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
- [ ] Git-Historie grob prüfen
- [ ] Projekt für Abgabe vorbereiten

### Tagesergebnis

- [ ] Projekt ist abgabebereit
- [ ] README ist vorhanden
- [ ] Impressum ist vorhanden
- [ ] Spiel läuft stabil
- [ ] Projektstruktur ist sauber
- [ ] Code ist nachvollziehbar
- [ ] Spiel wirkt wie ein vollständiges kleines Browsergame
- [ ] Das Projekt kann guten Gewissens ins Portfolio

---

## Puffer-Regel 

Wenn ein Bereich größer wird als geplant, wird er nicht hektisch reingedrückt.  
Dann wird er sauber als eigener Zwischentag ergänzt.

Priorität bleibt:

- erst spielbar machen
- dann sauber strukturieren
- dann visuell aufwerten
- dann Audio und Atmosphäre ergänzen
- dann testen und dokumentieren

Kein Feature ist wichtiger als ein stabiles Grundspiel.

---

## Eigene Erinnerung

Nicht verzetteln.  
Nicht alles gleichzeitig perfekt machen.  
Lieber ein sauberes, spielbares und atmosphärisches Sharky-Spiel als ein überladenes Projekt mit Baustellen überall.

Das Hauptmenü, die Ingame-UI, Sounds und Lore sollen das Spiel stärker machen, aber nicht die technische Basis gefährden.

Erst der Hai, dann der Hype.