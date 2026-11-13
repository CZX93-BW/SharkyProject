# Menüs und Eingaben

Tastatur und Touch werden auf denselben Satz von Bewegungs- und Angriffsaktionen abgebildet. Dadurch können im Kampf identische Regeln für Abklingzeit, Ressourcen und Treffer verwendet werden.

## Tastatur

In [Keyboard](../../js/input/keyboard.class.js) werden gedrückte Tasten über `KeyboardEvent.code` gespeichert. Pfeiltasten und WASD steuern die Richtungen. E, Leertaste und F stehen für Flosse, Blase und Gift. Die Auswertung erfolgt nur während des Spiels. Bedienelemente wie Buttons, Links oder Eingabefelder behalten ihre Tastaturbedienung. Kombinationen mit Alt, Strg oder der Meta-Taste werden ausgenommen.

Beim Loslassen wird der Tastenstatus gelöscht. Bei Fokusverlust des Fensters und beim Ausblenden des Dokuments werden aktive Eingaben zurückgesetzt. So bleibt nach dem Zurückwechseln keine Bewegung hängen, auch wenn das ursprüngliche Key-up-Ereignis außerhalb des Spiels erfolgt ist.

## Touch und Joystick

Über [MobileControls](../../js/input/mobile-controls.class.js) wird die Klasse `has-touch-controls` gesetzt. Aktiviert wird sie bei einem groben primären Zeigegerät oder bei erkannten Touchpunkten bis 1180 Pixel Fensterbreite. Für die tatsächliche Anzeige werden außerdem Spielansicht und Ausrichtung im CSS berücksichtigt. Eine reine Verkleinerung am Desktop genügt für die Symbolnavigation, aktiviert für sich allein aber keinen Joystick.

Beim Aufsetzen auf den Joystick wird die Pointer-ID gespeichert und mit Pointer Capture gebunden. Aus der Position relativ zur Mitte werden zwei Achsen berechnet. Der Verschiebeweg wird auf den verfügbaren Radius und höchstens 42 Pixel begrenzt. Durch Division durch den Maximalweg entstehen normierte Achsenwerte. Erst oberhalb der Richtungsschwelle von 0,22 wird eine Bewegung erkannt. Beim Loslassen oder Abbruch werden Achsen und Knopfstellung zurückgesetzt.

Für die drei Angriffstasten werden separate Pointer-Ereignisse verwendet. Damit kann während einer Bewegung gleichzeitig geschossen werden. Das Kontextmenü ist für die Touchsteuerung unterdrückt.

## Menüs, Fokus und Statuswechsel

| Bestandteil | Zuständigkeit |
| --- | --- |
| [UiEventBinder](../../js/ui/ui-event-binder.class.js) | Bindet HTML-Aktionen, Hintergrundklicks, Esc und zyklische Tab-Navigation an den sichtbaren Dialog. |
| [UiController](../../js/ui/ui-controller.class.js) | Übersetzt eine Bedienaktion in Start, Pause, Fortsetzen, Kauf oder Rückkehr. Koordiniert Spiel, Audio und Bildschirmwechsel. |
| [ScreenManager](../../js/ui/screen-manager.class.js) | Schaltet vorhandene HTML-Bereiche sichtbar oder verborgen. Bei geöffneten Dialogen werden Hintergrundteile über `inert` aus der Interaktion genommen. |
| [UiStatusController](../../js/ui/ui-status-controller.class.js) | Synchronisiert Statuswerte, Kaufzustände und Endbildschirme mit dem Spielzustand. |

Beim Öffnen eines Dialogs wird ein Bedienelement im Dialog fokussiert. Tab und Umschalt+Tab wechseln zwischen den erreichbaren Elementen. Beim Schließen der Hauptmenü-Panels wird der Auslöser wieder fokussiert. Nach Spielstart oder Fortsetzen erhält das Canvas mit `tabindex="-1"` den Fokus.

Beim Drehen eines Touchgeräts ins Hochformat pausiert ein laufendes Spiel. Nach der Rückkehr ins Querformat wird mit **Weiter** fortgesetzt. Beim Eintritt in Shop, Niederlage oder Sieg wird die Hauptaktion des Dialogs fokussiert.

In der Spielansicht bleibt die Pause unterhalb der Bossleiste erreichbar. Aus den Spieleinstellungen führt Esc zurück zur Pause und von dort weiter ins Spiel. Bei aktivem Browser-Vollbild wird die Behandlung von Esc dem Browser überlassen. Ein Klick auf den Hintergrund schließt das jeweils dafür vorgesehene Panel. Ein Klick auf Inhalte innerhalb der Karte zählt dabei nicht als Hintergrundklick.

## Hauptmenü und Geschichte

Die primäre Aktion startet Level 1. Levelauswahl, Anleitung und Geschichte werden auf derselben Seite geöffnet. Die untere Menüleiste führt zu Einstellungen, Farbschema, Vollbild und Rechtliches. Für die Mausbewegung im Hauptmenü werden die Parallax-Koordinaten auf einen angeforderten Animationsframe gebündelt. Die optionale Vorlesefunktion verwendet die Sprachsynthese des Browsers. [MainMenuController](../../js/ui/main-menu-controller.class.js) · [StoryNarrator](../../js/ui/story-narrator.class.js)

[Layout und Zugänglichkeit](../engineering/styling-accessibility.md) · [Tastenbelegung](../../README.md#steuerung)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
