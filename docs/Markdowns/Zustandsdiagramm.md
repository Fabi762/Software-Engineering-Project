# Zustandsdiagramm – Dokument-Lebenszyklus

Das Zustandsdiagramm beschreibt, welche Zustände ein hochgeladenes Dokument innerhalb von StudyBuddy durchläuft.  
Der vollständige PlantUML-Quellcode befindet sich in `docs/plantuml_Code_ZD`.

---

```mermaid
stateDiagram-v2
    [*] --> Hochgeladen : POST /api/upload\n(Datei gespeichert, Text extrahiert)

    Hochgeladen --> TextExtrahiert : Textextraktion erfolgreich

    TextExtrahiert --> LernzettelGeneriert : POST /api/generate/notes\n[Azure OpenAI + LaTeX OK]
    TextExtrahiert --> KarteikartGeneriert : POST /api/generate/flashcards\n[Azure OpenAI OK]
    TextExtrahiert --> QuizGeneriert : POST /api/generate/quiz\n[Azure OpenAI OK]

    LernzettelGeneriert --> KarteikartGeneriert : POST /api/generate/flashcards
    LernzettelGeneriert --> QuizGeneriert : POST /api/generate/quiz
    KarteikartGeneriert --> QuizGeneriert : POST /api/generate/quiz

    state LernzettelGeneriert {
        [*] --> PDFGespeichert
        PDFGespeichert --> PDFNeuGeneriert : Nutzer klickt "Neu generieren"
        PDFNeuGeneriert --> PDFGespeichert : Neues PDF gespeichert
    }

    Hochgeladen --> [*] : DELETE /api/documents/{id}
    TextExtrahiert --> [*] : DELETE /api/documents/{id}
    LernzettelGeneriert --> [*] : DELETE (auch PDF-Datei gelöscht)
    KarteikartGeneriert --> [*] : DELETE /api/documents/{id}
    QuizGeneriert --> [*] : DELETE /api/documents/{id}
```

---

## Zustandsbeschreibungen

| Zustand               | Beschreibung                                                                                     |
|-----------------------|--------------------------------------------------------------------------------------------------|
| **Hochgeladen**       | Datei wurde auf den Server übertragen und im `uploads/`-Verzeichnis gespeichert. Textextraktion läuft. |
| **TextExtrahiert**    | Markdown-Text liegt im `documents_store` vor. Noch kein Lernmaterial generiert.                 |
| **LernzettelGeneriert** | `notes_pdf_path` ist gesetzt. PDF-Lernzettel liegt im `uploads/`-Verzeichnis. Status in UI: 50 %. |
| **KarteikartGeneriert** | `flashcards[]` ist im Store gespeichert. Karteikarten können in der App durchgegangen werden.  |
| **QuizGeneriert**     | `quiz[]` mit Multiple-Choice-Fragen ist im Store. Vollständig verarbeitetes Dokument.            |

## Übergangsbedingungen

| Von → Nach                       | Auslöser                                      | Bedingung                               |
|----------------------------------|-----------------------------------------------|-----------------------------------------|
| Hochgeladen → TextExtrahiert     | Upload abgeschlossen                          | Textextraktion ohne Fehler              |
| TextExtrahiert → LernzettelGeneriert | Nutzer klickt "Lernzettel generieren"    | Azure OpenAI + LaTeX konfiguriert und verfügbar |
| LernzettelGeneriert → PDFNeuGeneriert | Nutzer klickt "Neu generieren"          | Azure OpenAI + LaTeX verfügbar          |
| Beliebig → [Gelöscht]            | Nutzer klickt "Löschen" in Detailansicht      | Keine                                   |
