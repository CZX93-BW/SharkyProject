# Statische Bereitstellung

Sharky wird als statische Anwendung ausgeliefert. Der Einstieg erfolgt über `index.html`. Die Spielwelt wird im Browser erzeugt, lokale Einstellungen werden dort gespeichert. Am Server genügt die Auslieferung der Dateien über HTTP oder HTTPS.

## Laufzeitdateien

| Pfad im Webverzeichnis | Inhalt |
| --- | --- |
| [index.html](../../index.html) | Einstieg, Menü, Dialoge, Canvas und Skriptreihenfolge |
| [legal.html](../../legal.html) und [robots.txt](../../robots.txt) | Anbieterinformationen mit Rückweg zur Spielseite sowie Regeln für Crawler |
| [js](../../js) und [styles](../../styles) | Browserlogik und Stylesheets |
| [assets](../../assets) | Grafiken, lokale Schrift, Lizenzdatei, Musik und Effekte |

Die Ordnerstruktur bleibt beim Übertragen erhalten. HTML löst Skript- und Bildpfade relativ zur Seite auf. In CSS beziehen sich relative URLs auf den Speicherort des Stylesheets. Gleiches gilt für die Schreibweise der Dateien auf einem Host mit Groß-/Kleinschreibung.

## Release aus einem Commit

Mit Git kann eine ZIP-Datei ausschließlich aus versionierten Laufzeitdateien erstellt werden. Im folgenden Beispiel wird `HEAD` als Release-Stand verwendet und das Archiv außerhalb des Projektordners abgelegt.

```sh
git rev-parse --short HEAD
git archive --format=zip --output=../sharky-release.zip HEAD index.html legal.html robots.txt assets js styles
```

Der erste Befehl gibt den zugehörigen Commit aus. Lokale uncommittete Änderungen sind im Archiv nicht enthalten. Nach dem Entpacken muss die Spielseite direkt im gewählten Webverzeichnis liegen. Für eine Wiederherstellung kann derselbe Befehl mit dem vorherigen Commit anstelle von `HEAD` verwendet werden.

## Zielpfade und Funktionsprüfung

| Ziel | Verzeichnis und Zugriff |
| --- | --- |
| Interner Akademie-Server | Der Inhalt des Archivs gehört direkt in das zugewiesene Projektunterverzeichnis. Beim Aufruf von Rechtliches und beim Rückweg muss dieser Unterpfad erhalten bleiben. |
| Portfolio-Subdomain | Der Inhalt gehört in den Webroot der Subdomain. Der öffentliche Projekteinstieg kann nach erfolgreicher Bereitstellung auf die HTTPS-Adresse verweisen. |

Je Ziel lassen sich Menü, lokal geladene Schrift, erstes Riff und Rücklinks auf Rechtliches direkt prüfen. Bei einem unsichtbaren Sprite wird der angeforderte Pfad im Netzwerk-Tab mit der Datei auf dem Host verglichen. Für Audio ist nach dem Laden ein Bedienimpuls erforderlich. Unter der öffentlichen Adresse kann zusätzlich der Einstieg vom Portfolio auf einem Handy im Querformat geprüft werden.

Für Einstellungen besitzt jede Herkunft ihren eigenen lokalen Speicher. Ein auf der Subdomain gesetzter Mute-Zustand wird deshalb unabhängig von einer Installation unter einem anderen Host geführt.

[Quickstart](../../README.md#quickstart) · [Browserprüfung](../engineering/testing-validation.md)

[Dokumentationsübersicht](../README.md) · [Projekt-README](../../README.md)
