# Aktivitätsdiagramme

Die vollständigen PlantUML-Quellcodes befinden sich in `docs/plantuml_Code_AD1` (UC-01) und `docs/plantuml_Code_AD2` (UC-02).  
Die gerenderten PNG-Bilder liegen unter `docs/PlantUML/`.

---

## UC-01 – Vorlesung hochladen

```mermaid
flowchart TD
    A([Start]) --> B[Nutzer klickt 'Neu' im Header]
    B --> C[Upload-Ansicht öffnen]
    C --> D[Nutzer wählt Datei\nper Klick oder Drag & Drop]
    D --> E{Format\nunterstützt?}
    E -- nein --> F[Fehlermeldung: Ungültiges Format]
    F --> Z([Ende])
    E -- ja --> G{Dateigröße\n> 50 MB?}
    G -- ja --> H[Toast: Datei zu groß]
    H --> Z
    G -- nein --> I[Ladeanimation starten]
    I --> J[POST /api/upload multipart]
    J --> K[UUID generieren\nDatei speichern]
    K --> L{PDF-Datei?}
    L -- ja --> M[PdfReader.extract_text\nalle Seiten]
    L -- nein --> N[open.read\nDateiinhalt lesen]
    M --> O{Extraktion\nerfolgreich?}
    N --> O
    O -- nein --> P[Datei löschen\nHTTP 500]
    P --> Q[Toast: Verarbeitung fehlgeschlagen]
    Q --> Z
    O -- ja --> R[Dokument in Store speichern\nid, filename, uploaded_at, markdown]
    R --> S[HTTP 200 + Dokumentdaten]
    S --> T[courseId anhängen\ndocuments-State aktualisieren]
    T --> U[Zur Detailansicht weiterleiten]
    U --> V[Toast: Erfolgreich verarbeitet]
    V --> Z

    style A fill:#4F46E5,color:#fff
    style Z fill:#4F46E5,color:#fff
    style F fill:#fee2e2
    style H fill:#fee2e2
    style P fill:#fee2e2
    style Q fill:#fee2e2
```

**Swimlanes:** Nutzer | Frontend (React) | Backend (FastAPI)

---

## UC-02 – Lernzettel generieren

```mermaid
flowchart TD
    A([Start]) --> B[Nutzer öffnet Detailansicht\neines Dokuments]
    B --> C[Tab 'Lernzettel' wählen]
    C --> D[Klick: 'Lernzettel als PDF generieren']
    D --> E[Ladeanimation starten]
    E --> F[POST /api/generate/notes/doc_id]
    F --> G{Azure OpenAI\nkonfiguriert?}
    G -- nein --> H[HTTP 503: Nicht konfiguriert]
    H --> ERR[Toast: Fehlermeldung]
    ERR --> Z([Ende])
    G -- ja --> I{doc_id\nim Store?}
    I -- nein --> J[HTTP 404: Nicht gefunden]
    J --> ERR
    I -- ja --> K[Markdown aus Store laden]
    K --> L{Text >\n6000 Zeichen?}
    L -- ja --> M[Text kürzen\n+ Hinweis anhängen]
    L -- nein --> N[Text vollständig verwenden]
    M --> O[Chat-Completion an Azure OpenAI\nSystem-Prompt + Vorlesungsinhalt]
    N --> O
    O --> P{API-Antwort\nerhalten?}
    P -- nein --> Q[HTTP 500: Generierung fehlgeschlagen]
    Q --> ERR
    P -- ja --> R[markdown_to_latex_and_pdf aufrufen\nMarkdown → LaTeX-Template]
    R --> S{LaTeX-Compiler\nverfügbar?}
    S -- nein --> T[RuntimeError: Kein Compiler]
    T --> ERR
    S -- ja --> U[pdflatex / tectonic kompilieren\n.tex → .pdf]
    U --> V{Kompilierung\nerfolgreich?}
    V -- nein --> W[HTTP 500 + LaTeX-Fehlerlog]
    W --> ERR
    V -- ja --> X[PDF speichern\nnotes_pdf_path aktualisieren]
    X --> Y[HTTP 200: notes_pdf true]
    Y --> AA[GET /api/.../notes-pdf]
    AA --> AB[FileResponse: PDF zurückgeben]
    AB --> AC[Blob-URL erstellen\nAutomatischer Download]
    AC --> AD[Fortschritt → 50 % in Bibliothek]
    AD --> AE[Toast: Lernzettel heruntergeladen]
    AE --> Z

    style A fill:#4F46E5,color:#fff
    style Z fill:#4F46E5,color:#fff
    style ERR fill:#fee2e2
    style H fill:#fee2e2
    style J fill:#fee2e2
    style Q fill:#fee2e2
    style T fill:#fee2e2
    style W fill:#fee2e2
```

**Swimlanes:** Nutzer | Frontend (React) | Backend (FastAPI) | Azure OpenAI | LaTeX-Compiler
