# Audio, Farbschema und Vollbild

Musik und kurze Effekte werden mit HTML-Audioelementen abgespielt. Für Einstellungen werden zwei lokale Speicherschlüssel verwendet. Der Spielfortschritt bleibt im Arbeitsspeicher der laufenden Sitzung.

## Musik und Spielereignisse

Die Dateien für Spielmusik, Bossmusik und Effekte werden in der [Assetkonfiguration](../../js/config/asset-config.js) registriert. Beim ersten Bedienimpuls wird die Wiedergabe freigegeben. Im [AudioManager](../../js/systems/audio-manager.class.js) werden der gewünschte Musiktitel und die erlaubte Wiedergabe getrennt verwaltet. Ein Titel kann damit bereits ausgewählt sein, bevor die Wiedergabe nach Benutzerinteraktion möglich ist.

Beim Levelstart wird die Spielmusik ausgewählt. In der Spielschleife wird der letzte beobachtete Bosszustand gespeichert. Bei Eintritt in die Einführung werden der Introeffekt und die Bossmusik ausgelöst. Beim Tod des Bosses wird auf die Spielmusik zurückgeschaltet. Durch den Vergleich mit dem vorigen Zustand wird der Effekt nur beim Zustandswechsel abgespielt. In der Pause werden Musik und aktive Effekte angehalten. Wird die Musik dort wieder eingeschaltet, wird der gewählte Titel erst beim Fortsetzen weitergespielt. [Audioübergänge in Game](../../js/game/game.class.js)

## Effekte und gespeicherte Werte

Für jeden registrierten Effekt werden vier Audioelemente als Pool vorbereitet. Beim Abspielen wird ein beendetes oder pausiertes Element gewählt. Sind alle belegt, wird das erste erneut verwendet. Dadurch kann derselbe Treffer- oder Sammelsound kurz aufeinanderfolgend ausgelöst werden. Aktive Effekte werden für das gemeinsame Stoppen mitgeführt.

| Schlüssel | Inhalt | Auswertung |
| --- | --- | --- |
| `sharkyAudioSettings` | Aktivierung von Musik und Effekten, Stummschaltung und beide Lautstärken als JSON | Gespeicherte Werte werden beim Start eingelesen. Ohne gespeicherten Wert beträgt die Lautstärke je Bereich 40 %. |
| `sharky-display-theme` | Ausgewähltes Farbschema | Eine gespeicherte Auswahl wird beim nächsten Besuch bevorzugt. Ohne eigene Auswahl gilt die Systempräferenz. |

Die Regleroberfläche arbeitet mit Prozentwerten, die Audioelemente mit Werten zwischen 0 und 1. Der gemeinsame Audioschalter setzt beide Bereiche und den Mute-Zustand zusammen. Getrennte Bedienelemente werden in [UiAudioControls](../../js/ui/ui-audio-controls.class.js) mit dem aktuellen Zustand synchronisiert. Bei nicht verfügbarem lokalem Speicher bleiben die aktuellen Einstellungen für die laufende Seite nutzbar.

## Anzeige und Browser-Vollbild

Im [DisplaySettingsController](../../js/ui/display-settings-controller.class.js) werden Farbschema und Vollbild getrennt behandelt. Für den Wechsel in Vollbild wird `requestFullscreen()` aufgerufen. Zum Beenden wird die Browserfunktion zum Verlassen des Vollbilds verwendet. Über `fullscreenchange` werden die Oberfläche und der Zustand der Schaltfläche auch nach einem Ausstieg per Esc aktualisiert.

Das flächenfüllende Touchlayout entsteht im CSS und durch die logische Canvasbreite. Dadurch kann im Querformat die verfügbare Fläche genutzt werden, auch wenn die Fullscreen-API nicht verfügbar ist. Eine Änderung der Desktopfensterbreite löst keinen Vollbildantrag aus.

[Touch und Fensterbreite](../engineering/styling-accessibility.md) · [Pause und Einstellungen](interface-controls.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
