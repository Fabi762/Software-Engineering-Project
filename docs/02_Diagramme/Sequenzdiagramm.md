# Sequenzdiagramme – StudyBuddy

Der vollständige PlantUML-Quellcode befindet sich in `docs/Plantuml_Code_SD`.  
Das gerenderte PNG liegt unter `docs/PlantUML/Sequenzdigramm.png`.

Das Sequenzdiagramm dokumentiert die vier zentralen Interaktionsszenarien zwischen Nutzer, Frontend (React), Backend (FastAPI), Azure OpenAI und LaTeX-Compiler:

1. **Datei hochladen** – Upload, UUID-Generierung, Textextraktion, Store-Speicherung
2. **Lernzettel generieren** – KI-Anfrage, LaTeX-Kompilierung, PDF-Download
3. **Karteikarten generieren** – KI-Anfrage, JSON-Parsing, State-Update im Frontend
4. **Quiz generieren & auswerten** – KI-Anfrage, Multiple-Choice, Score-Berechnung im Frontend

```mermaid
sequenceDiagram
    actor N as Nutzer
    participant FE as React (App.jsx)
    participant BE as FastAPI (main.py)
    participant KI as Azure OpenAI
    participant DB as documents_store

    rect rgb(240, 248, 255)
        Note over N,DB: Datei hochladen
        N->>FE: Datei auswählen & hochladen
        FE->>BE: POST /api/upload (multipart)
        BE->>BE: UUID generieren, Datei speichern
        alt PDF-Datei
            BE->>BE: PdfReader.extract_text()
        else Text-Datei
            BE->>BE: open().read()
        end
        BE->>DB: Dokument speichern
        BE-->>FE: id, filename, uploaded_at, markdown
        FE-->>N: Toast "Erfolgreich verarbeitet"
    end

    rect rgb(240, 255, 240)
        Note over N,DB: Lernzettel generieren
        N->>FE: "Lernzettel als PDF generieren"
        FE->>BE: POST /api/generate/notes/{doc_id}
        BE->>DB: markdown abrufen
        BE->>KI: Chat Completion (System-Prompt + Inhalt)
        KI-->>BE: Markdown-Lernzettel
        BE->>BE: markdown_to_latex_and_pdf()
        BE-->>FE: notes_pdf true
        FE->>BE: GET /api/documents/{doc_id}/notes-pdf
        BE-->>FE: PDF FileResponse
        FE-->>N: PDF heruntergeladen + Toast
    end
```
