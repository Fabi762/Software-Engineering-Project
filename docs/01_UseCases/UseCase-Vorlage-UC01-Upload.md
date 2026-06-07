# Use-Case-Beschreibung: UC-01 – Vorlesung hochladen

| Feld                         | Inhalt                                                                                                    |
|------------------------------|-----------------------------------------------------------------------------------------------------------|
| **Use-Case-ID**              | UC-01                                                                                                     |
| **Name**                     | Vorlesung hochladen                                                                                       |
| **Akteur(e)**                | Nutzer                                                                                                    |
| **Kurzbeschreibung**         | Der Nutzer lädt eine Vorlesungsdatei (PDF, PPTX, DOCX etc.) hoch. Das System extrahiert den Textinhalt und speichert das Dokument für die spätere Lernzettel-Generierung. |
| **Auslöser**                 | Nutzer klickt auf „Neu" im Header oder navigiert zur Upload-Ansicht                                       |
| **Vorbedingungen**           | 1. Die Webanwendung ist gestartet und im Browser geöffnet.<br>2. Ein Kurs wurde bereits erstellt oder der Nutzer wählt einen Kurs während des Uploads. |
| **Nachbedingungen (Erfolg)** | 1. Die Datei ist im Backend gespeichert.<br>2. Der extrahierte Text liegt als Markdown im In-Memory-Store vor.<br>3. Das Dokument erscheint in der Bibliotheksansicht.<br>4. Eine Erfolgs-Toast-Meldung wird angezeigt. |
| **Nachbedingungen (Misserfolg)** | 1. Die Datei wurde nicht gespeichert.<br>2. Eine Fehlermeldung (Toast) informiert den Nutzer über die Ursache. |

---

## Normalablauf

| Schritt | Akteur   | Aktion                                                                                  |
|---------|----------|-----------------------------------------------------------------------------------------|
| 1       | Nutzer   | Öffnet die Upload-Ansicht über den „Neu"-Button im Header.                              |
| 2       | Nutzer   | Wählt eine Datei per Klick auf „Datei auswählen" oder per Drag & Drop.                  |
| 3       | System   | Validiert das Dateiformat (PDF, PPTX, DOCX, XLSX, HTML, Markdown, Bild) und die Dateigröße (max. 50 MB). |
| 4       | Nutzer   | Klickt auf „Hochladen".                                                                 |
| 5       | System   | Sendet `POST /api/upload` mit der Datei als Multipart-Request an das Backend.           |
| 6       | System   | Das Backend generiert eine UUID, benennt die Datei um und speichert sie im `uploads/`-Verzeichnis. |
| 7       | System   | Das Backend extrahiert den Text: Bei PDFs via `PdfReader.extract_text()`, bei allen anderen Formaten via `open().read()`. |
| 8       | System   | Das Dokument (ID, Dateiname, Zeitstempel, Markdown) wird im In-Memory-Store gespeichert. |
| 9       | System   | Das Backend antwortet mit `{id, filename, uploaded_at, markdown}`.                      |
| 10      | System   | Das Frontend hängt die `courseId` an und aktualisiert den lokalen `documents[]`-State.  |
| 11      | System   | Der Nutzer wird automatisch zur Detailansicht des hochgeladenen Dokuments weitergeleitet. |
| 12      | System   | Toast-Meldung „Erfolgreich verarbeitet" wird angezeigt.                                  |

---

## Alternativablauf

### A1 – Datei ist kein unterstütztes Format
| Schritt | Akteur | Aktion                                                                 |
|---------|--------|------------------------------------------------------------------------|
| 3a      | System | Erkennt ungültiges Dateiformat, zeigt Fehlermeldung im Upload-Dialog.  |
| –       | –      | Use Case endet ohne Upload.                                            |

### A2 – Datei überschreitet 50 MB
| Schritt | Akteur | Aktion                                                                       |
|---------|--------|------------------------------------------------------------------------------|
| 3b      | System | Erkennt Dateigröße > 50 MB, zeigt Toast-Fehlermeldung „Datei zu groß (max. 50 MB)". |
| –       | –      | Use Case endet ohne Upload.                                                  |

---

## Ausnahmen / Fehlerfälle

| ID  | Fehlerfall                          | Reaktion des Systems                                                                 |
|-----|-------------------------------------|--------------------------------------------------------------------------------------|
| E1  | Backend nicht erreichbar            | Frontend zeigt Toast „Server nicht erreichbar. Bitte Backend starten."               |
| E2  | Textextraktion schlägt fehl         | Backend gibt HTTP 500 zurück. Hochgeladene Datei wird wieder gelöscht. Frontend zeigt Fehlermeldung. |
| E3  | PDF ist passwortgeschützt           | `PdfReader` wirft Exception. Backend antwortet mit HTTP 500, Datei wird gelöscht.    |
| E4  | Dateiname enthält Sonderzeichen     | System ersetzt Leerzeichen durch `_`, andere Sonderzeichen bleiben erhalten.         |

---

## Spezielle Anforderungen

- Die Verarbeitung (Upload + Textextraktion) soll in unter 10 Sekunden abgeschlossen sein.
- Unterstützte Formate: `.pdf`, `.pptx`, `.docx`, `.xlsx`, `.html`, `.md`, `.txt` sowie gängige Bildformate.
- Die maximale Dateigröße beträgt 50 MB.
- Dateinamen werden durch UUID-Prefix eindeutig gemacht, um Kollisionen zu vermeiden.

---

## Beziehungen zu anderen Use Cases

| Beziehung   | Use Case                   |
|-------------|----------------------------|
| `<<extend>>` | UC-02 Lernzettel generieren (kann nach dem Upload gestartet werden) |
| `<<extend>>` | UC-03 Vorlesung löschen    |
