# Use-Case-Beschreibung: UC-02 – Lernzettel generieren

| Feld                         | Inhalt                                                                                                    |
|------------------------------|-----------------------------------------------------------------------------------------------------------|
| **Use-Case-ID**              | UC-02                                                                                                     |
| **Name**                     | Lernzettel generieren                                                                                     |
| **Akteur(e)**                | Nutzer, Azure OpenAI (externes System), LaTeX-Compiler (externes System)                                  |
| **Kurzbeschreibung**         | Der Nutzer lässt aus einem bereits hochgeladenen Vorlesungsdokument automatisch einen strukturierten Lernzettel als PDF erstellen. Das System nutzt dafür die Azure OpenAI API (GPT-4.1) und rendert das Ergebnis via LaTeX. |
| **Auslöser**                 | Nutzer klickt in der Detailansicht eines Dokuments auf „Lernzettel als PDF generieren"                    |
| **Vorbedingungen**           | 1. Die Webanwendung ist gestartet.<br>2. Mindestens ein Dokument wurde bereits hochgeladen (UC-01).<br>3. Das Backend ist konfiguriert: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT` und `AZURE_OPENAI_API_VERSION` sind in der `.env` gesetzt.<br>4. Ein LaTeX-Compiler (pdflatex, tectonic oder xelatex) ist auf dem Server installiert. |
| **Nachbedingungen (Erfolg)** | 1. Ein PDF-Lernzettel wurde generiert und im `uploads/`-Verzeichnis gespeichert.<br>2. Das Dokument im Store enthält `notes_pdf_path`.<br>3. Der Browser des Nutzers lädt die PDF-Datei automatisch herunter.<br>4. Die Fortschrittsanzeige in der Bibliothek aktualisiert sich auf 50 %. |
| **Nachbedingungen (Misserfolg)** | 1. Kein PDF wurde generiert.<br>2. Eine Fehlermeldung informiert den Nutzer über die Ursache.<br>3. Der Dokumentstatus bleibt unverändert. |

---

## Normalablauf

| Schritt | Akteur         | Aktion                                                                                                 |
|---------|----------------|--------------------------------------------------------------------------------------------------------|
| 1       | Nutzer         | Navigiert zur Detailansicht eines hochgeladenen Dokuments.                                             |
| 2       | Nutzer         | Wählt den Tab „Lernzettel" und klickt auf „Lernzettel als PDF generieren".                             |
| 3       | System         | Sendet `POST /api/generate/notes/{doc_id}` an das Backend.                                             |
| 4       | System         | Das Backend prüft, ob Azure OpenAI konfiguriert ist (`azure_openai_configured()`).                     |
| 5       | System         | Das Backend lädt den Markdown-Text des Dokuments aus dem In-Memory-Store.                              |
| 6       | System         | Der Text wird auf maximal 6 000 Zeichen gekürzt (mit Hinweis `[Inhalt gekürzt...]` am Ende).           |
| 7       | System         | Das Backend sendet eine Chat-Completion-Anfrage an Azure OpenAI mit System-Prompt (Lernzettel-Formatierung) und Vorlesungsinhalt. |
| 8       | Azure OpenAI   | Gibt einen strukturierten Markdown-Lernzettel mit Überschriften, Bullet Points, Formeln und WICHTIG-Boxen zurück. |
| 9       | System         | Das Backend ruft `markdown_to_latex_and_pdf()` auf: Markdown wird in LaTeX konvertiert.                |
| 10      | System         | Der LaTeX-Compiler (tectonic / pdflatex / xelatex) kompiliert die `.tex`-Datei zu einer `.pdf`-Datei. |
| 11      | System         | Die PDF-Bytes werden im `uploads/`-Verzeichnis gespeichert, `notes_pdf_path` im Store aktualisiert.   |
| 12      | System         | Backend antwortet mit `{notes_pdf: true}`.                                                             |
| 13      | System         | Das Frontend sendet sofort `GET /api/documents/{doc_id}/notes-pdf`.                                    |
| 14      | System         | Das Backend gibt die PDF-Datei als `FileResponse` zurück.                                              |
| 15      | System         | Das Frontend erstellt eine Blob-URL und löst den automatischen Download aus.                           |
| 16      | System         | Toast-Meldung „Lernzettel erfolgreich generiert und heruntergeladen" wird angezeigt.                   |

---

## Alternativablauf

### A1 – Lernzettel bereits vorhanden (Neu generieren)
| Schritt | Akteur | Aktion                                                                       |
|---------|--------|------------------------------------------------------------------------------|
| 2a      | Nutzer | Klickt auf „Lernzettel neu generieren".                                      |
| –       | –      | Weiter mit Schritt 3 des Normalablaufs. Bestehender PDF-Pfad wird überschrieben. |

### A2 – Text länger als 6 000 Zeichen
| Schritt | Akteur | Aktion                                                                         |
|---------|--------|--------------------------------------------------------------------------------|
| 6a      | System | Text wird auf 6 000 Zeichen gekürzt, `[Inhalt gekürzt...]` wird angehängt.    |
| –       | –      | Weiter mit Schritt 7. Nutzer sieht keine direkte Meldung, Lernzettel deckt ggf. nicht den gesamten Inhalt ab. |

---

## Ausnahmen / Fehlerfälle

| ID  | Fehlerfall                                        | Reaktion des Systems                                                                          |
|-----|---------------------------------------------------|-----------------------------------------------------------------------------------------------|
| E1  | Azure OpenAI nicht konfiguriert                   | HTTP 503: „Azure OpenAI ist nicht konfiguriert." Toast-Fehlermeldung im Frontend.             |
| E2  | Dokument nicht im Store (ungültige `doc_id`)      | HTTP 404: „Dokument nicht gefunden."                                                          |
| E3  | Azure OpenAI API gibt Fehler zurück (Rate Limit, Timeout) | HTTP 500: „Generierung fehlgeschlagen: …". Fehlermeldung enthält API-Fehlertext.          |
| E4  | LaTeX-Kompilierung schlägt fehl                   | HTTP 500 mit LaTeX-Fehlerlog (erste 3 Fehlerzeilen). Temp-Verzeichnis wird aufgeräumt.        |
| E5  | Kein LaTeX-Compiler gefunden                      | RuntimeError: „Kein LaTeX-Compiler gefunden (tectonic / pdflatex / xelatex)."               |
| E6  | PDF-Datei nicht im Dateisystem                    | HTTP 404 beim Download: „PDF-Datei nicht gefunden."                                           |

---

## Spezielle Anforderungen

- Die gesamte Generierung (KI + LaTeX) soll innerhalb von 60 Sekunden abgeschlossen sein.
- Der Lernzettel muss mathematische Formeln korrekt in LaTeX-Notation rendern (`$...$`, `$$...$$`).
- Wichtige Hinweise des Nutzers werden als farbige `tcolorbox` dargestellt (Indigo für Hinweise, Orange für WICHTIG).
- Sonderzeichen im Dateinamen werden beim LaTeX-Export korrekt escaped.

---

## Beziehungen zu anderen Use Cases

| Beziehung    | Use Case                             |
|--------------|--------------------------------------|
| `<<include>>` | UC-01 Vorlesung hochladen (muss vorher abgeschlossen sein) |
| `<<extend>>`  | UC-02a Lernzettel herunterladen      |
| `<<extend>>`  | UC-02b Lernzettel neu generieren     |
