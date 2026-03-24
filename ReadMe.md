# StudyBuddy - KI-gestuetzter Lernassistent

## Projektuebersicht

**StudyBuddy** ist eine webbasierte Anwendung, die Studierenden hilft, aus Vorlesungsfolien automatisch Lernmaterialien zu erstellen. Mithilfe von kuenstlicher Intelligenz (OpenAI) und fortschrittlicher Dokumentenanalyse (Docling) werden aus hochgeladenen Vorlesungsunterlagen **interaktive Karteikarten** und **strukturierte Lernzettel** generiert.

Die Idee: Vorlesungsfolien hochladen, KI arbeiten lassen, fertige Lernhilfen erhalten.

---

## Team

| Name            | Rolle im Projekt        |
| --------------- | ----------------------- |
| [Dein Name]     | Entwickler / Scrum Master (Sprint 1 & 2) |
| Mario           | Entwickler / Product Owner               |
| Fabi            | Entwickler / Scrum Master (Sprint 3 & 4) |

**Fach**: Software Engineering
**Studiengang**: [Studiengang eintragen]
**Semester**: [Semester eintragen]

---

## Funktionen

- **Dokumenten-Upload**: Vorlesungsfolien per Drag & Drop oder Dateiauswahl hochladen
- **Automatische Inhaltsextraktion**: Docling erkennt Text, Tabellen und Strukturen aus PDF, PPTX, DOCX und weiteren Formaten
- **KI-Karteikarten**: Automatische Generierung von Frage-Antwort-Karteikarten aus dem Vorlesungsinhalt
- **KI-Lernzettel**: Kompakte, strukturierte Zusammenfassungen des Vorlesungsstoffs
- **Interaktive Karteikarten**: Karten mit 3D-Flip-Animation durchgehen und Wissen testen
- **Mehrere Ansichten**: Formatierte Vorschau, Markdown-Quelltext, Karteikarten und Lernzettel
- **Dokumentenverwaltung**: Mehrere Vorlesungen verwalten, zwischen ihnen wechseln

---

## Technologie-Stack

| Komponente         | Technologie       | Begruendung                                           |
| ------------------ | ----------------- | ----------------------------------------------------- |
| Frontend           | React 19 + Vite   | Schnelle Entwicklung, komponentenbasierte Architektur |
| Backend            | Python FastAPI     | Moderner, schneller REST-API-Server                   |
| Dokumentenanalyse  | Docling (IBM)      | Open Source, unterstuetzt viele Formate               |
| KI-Generierung     | Azure OpenAI (GPT-4.1) | Enterprise-tauglich, hohe Qualitaet               |
| Styling            | CSS Custom Properties | Konsistentes Design-System ohne Framework-Overhead |
| Versionsverwaltung | Git / GitHub       | Branchenstandard fuer Teamarbeit                     |

---

## Architektur

```
Benutzer (Browser)
       |
       v
+------------------+
|    React Frontend |  Port 5173
|  - Upload-UI     |
|  - Karteikarten  |
|  - Lernzettel    |
|  - Dokumenten-   |
|    verwaltung    |
+--------+---------+
         |
    Vite Dev Proxy  (/api/* -> :8000)
         |
         v
+------------------+
|  FastAPI Backend  |  Port 8000
|  - /api/upload   |-----> Docling (Parsing)
|  - /api/generate |-----> Azure OpenAI (KI)
|  - /api/documents|-----> Dateisystem
+------------------+
```

**Datenfluss**:
1. Student laedt Vorlesungsfolie hoch (Frontend -> Backend)
2. Docling extrahiert den Inhalt und konvertiert ihn in Markdown (Backend)
3. Student sieht den extrahierten Inhalt (Backend -> Frontend)
4. Student klickt "Karteikarten generieren" oder "Lernzettel erstellen"
5. Azure OpenAI generiert die Lernmaterialien aus dem Markdown (Backend -> Azure OpenAI -> Backend)
6. Ergebnis wird dem Studenten angezeigt (Backend -> Frontend)

---

## Agile Vorgehensweise

### Warum Scrum?

Fuer unser Projekt haben wir uns fuer **Scrum** als agiles Framework entschieden. Die Gruende:

- **Kleine Teamgroesse** (3 Personen) passt ideal zu Scrum
- **Iterative Entwicklung** ermoeglicht fruehes Feedback und Anpassungen
- **Klare Rollenverteilung** gibt Struktur ohne zu viel Overhead
- **Regelmaessige Reflexion** durch Retrospektiven foerdert kontinuierliche Verbesserung

### Rollen

| Rolle          | Verantwortung                                                                 | Person(en)          |
| -------------- | ----------------------------------------------------------------------------- | ------------------- |
| Product Owner  | Priorisierung des Backlogs, Vertretung der Nutzerperspektive                  | Mario               |
| Scrum Master   | Moderation der Events, Beseitigung von Hindernissen, Prozesseinhaltung        | Rotierend           |
| Entwickler     | Design, Implementierung, Testing                                              | Alle Teammitglieder |

Die Rolle des Scrum Masters rotierte zwischen den Sprints, damit jedes Teammitglied Erfahrung in dieser Rolle sammeln konnte.

### Scrum-Artefakte

1. **Product Backlog**: Priorisierte Liste aller Anforderungen (User Stories), gepflegt vom Product Owner
2. **Sprint Backlog**: Ausgewaehlte User Stories und Aufgaben fuer den aktuellen Sprint
3. **Increment**: Funktionsfaehiges Produktinkrement am Ende jedes Sprints

### Scrum-Events

| Event                 | Wann                  | Dauer    | Inhalt                                                      |
| --------------------- | --------------------- | -------- | ----------------------------------------------------------- |
| Sprint Planning       | Montag, Sprintbeginn  | 1 Stunde | Auswahl der Stories, Aufwandsschaetzung, Sprint-Ziel setzen |
| Daily Standup         | Taeglich              | 15 Min.  | Was gemacht? Was geplant? Hindernisse?                      |
| Sprint Review         | Freitag, Sprintende   | 30 Min.  | Demo der fertigen Features, Feedback sammeln                |
| Sprint Retrospektive  | Freitag, nach Review  | 30 Min.  | Was lief gut? Was verbessern? Massnahmen ableiten           |

### Sprint-Uebersicht

#### Sprint 1 - Projektsetup & Grundarchitektur (Woche 1-2)

**Sprint-Ziel**: Technische Basis schaffen und Grundgeruest aufbauen

| Aufgabe                           | Verantwortlich | Status     |
| --------------------------------- | -------------- | ---------- |
| Git-Repository einrichten         | Fabi           | Erledigt   |
| React-Projekt mit Vite erstellen  | [Dein Name]    | Erledigt   |
| FastAPI-Backend aufsetzen         | Mario          | Erledigt   |
| Projektstruktur festlegen         | Alle           | Erledigt   |
| CI/CD Pipeline (optional)         | Fabi           | Verschoben |

**Ergebnis**: Lauffaehiges Grundgeruest mit Frontend und Backend, Entwicklungsumgebung steht.

**Retrospektive-Erkenntnisse**:
- Gut: Schneller Projektstart durch klare Aufgabenverteilung
- Verbesserung: Entwicklungsumgebung frueher abstimmen (Node.js-Versionen)

---

#### Sprint 2 - Dokumenten-Upload & Parsing (Woche 3-4)

**Sprint-Ziel**: Vorlesungsfolien hochladen und Inhalt extrahieren koennen

| Aufgabe                            | Verantwortlich | Status   |
| ---------------------------------- | -------------- | -------- |
| Drag & Drop Upload implementieren | [Dein Name]    | Erledigt |
| Docling-Integration im Backend    | Mario          | Erledigt |
| Dokument-Ansicht (Markdown)       | Fabi           | Erledigt |
| Seitenleiste mit Dokumentenliste  | [Dein Name]    | Erledigt |
| API-Endpunkte (Upload, List, Get) | Mario          | Erledigt |
| Fehlerbehandlung                  | Fabi           | Erledigt |

**Ergebnis**: Vollstaendiger Upload-und-Parse-Workflow. Studierende koennen PDFs/PPTX hochladen und den extrahierten Inhalt sehen.

**Retrospektive-Erkenntnisse**:
- Gut: Docling liefert sehr gute Ergebnisse bei PDFs
- Verbesserung: Groessere Dateien brauchen laenger, Ladeanimation verbessern

---

#### Sprint 3 - KI-Integration (Woche 5-6)

**Sprint-Ziel**: Automatische Generierung von Karteikarten und Lernzetteln

| Aufgabe                            | Verantwortlich | Status   |
| ---------------------------------- | -------------- | -------- |
| OpenAI-API Anbindung              | Mario          | Erledigt |
| Karteikarten-Generierung (Backend)| Mario          | Erledigt |
| Lernzettel-Generierung (Backend)  | Fabi           | Erledigt |
| Karteikarten-UI mit Flip-Animation| [Dein Name]    | Erledigt |
| Lernzettel-Ansicht                | Fabi           | Erledigt |
| Tab-Navigation im Viewer         | [Dein Name]    | Erledigt |

**Ergebnis**: KI generiert Karteikarten und Lernzettel aus dem Vorlesungsinhalt. Interaktive Karteikarten mit 3D-Flip.

**Retrospektive-Erkenntnisse**:
- Gut: Azure OpenAI (GPT-4.1) liefert qualitativ hochwertige Karteikarten
- Verbesserung: Prompt-Engineering erfordert mehrere Iterationen

---

#### Sprint 4 - UI-Polish & Testing (Woche 7-8)

**Sprint-Ziel**: Finales Design, Fehlerbehandlung und Praesentation vorbereiten

| Aufgabe                            | Verantwortlich | Status   |
| ---------------------------------- | -------------- | -------- |
| Design-System verfeinern          | [Dein Name]    | Erledigt |
| Responsives Design                | Fabi           | Erledigt |
| Fehlerbehandlung verbessern       | Mario          | Erledigt |
| Benachrichtigungssystem           | [Dein Name]    | Erledigt |
| README und Dokumentation          | Alle           | Erledigt |
| Praesentation vorbereiten         | Alle           | Erledigt |

**Ergebnis**: Produktionsreife Anwendung mit professionellem Design und vollstaendiger Dokumentation.

**Retrospektive-Erkenntnisse**:
- Gut: Agile Arbeitsweise hat gut funktioniert, regelmaessige Reviews waren wertvoll
- Gut: Rotierendes Scrum-Master-Konzept hat jedem Einblick gegeben
- Erkenntnis: Frueher mit Testing beginnen haette spaetere Fehler vermieden

### User Stories

| ID    | User Story                                                                                       | Prioritaet | Sprint | Akzeptanzkriterien                                                          |
| ----- | ------------------------------------------------------------------------------------------------ | ---------- | ------ | --------------------------------------------------------------------------- |
| US-01 | Als Student moechte ich Vorlesungsfolien hochladen, um sie verarbeiten zu lassen                  | Hoch       | 1, 2   | Upload per Drag & Drop und Dateiauswahl, Fortschrittsanzeige               |
| US-02 | Als Student moechte ich den extrahierten Inhalt sehen, um die Erkennung zu pruefen               | Hoch       | 2      | Formatierte Markdown-Ansicht, Tabellen korrekt dargestellt                 |
| US-03 | Als Student moechte ich automatisch Karteikarten erhalten, um effizient zu lernen                 | Hoch       | 3      | Mind. 10 Karteikarten pro Dokument, Frage-Antwort-Format                  |
| US-04 | Als Student moechte ich einen Lernzettel generieren, um eine Zusammenfassung zu haben             | Hoch       | 3      | Strukturierter Markdown-Lernzettel mit Kernkonzepten                       |
| US-05 | Als Student moechte ich Karteikarten interaktiv durchgehen, um mein Wissen zu testen              | Mittel     | 3, 4   | Flip-Animation, Navigation (vor/zurueck), Fortschrittsanzeige              |
| US-06 | Als Student moechte ich zwischen Dokumenten wechseln, um verschiedene Vorlesungen zu verwalten    | Mittel     | 2      | Seitenleiste mit Dokumentenliste, aktives Dokument hervorgehoben           |
| US-07 | Als Student moechte ich den Markdown-Text kopieren, um ihn in Notiz-Apps weiterzuverwenden        | Niedrig    | 2      | Kopier-Button mit Feedback                                                 |
| US-08 | Als Student moechte ich verschiedene Dateiformate nutzen (PDF, PPTX, DOCX)                        | Mittel     | 2      | Alle gaengigen Vorlesungsformate werden unterstuetzt                       |

### Definition of Done

Eine User Story gilt als **erledigt**, wenn:

- [x] Die Funktion ist vollstaendig implementiert
- [x] Der Code wurde von mindestens einem Teammitglied reviewed
- [x] Es gibt keine offenen Linter-Fehler
- [x] Die Funktion funktioniert im Browser wie erwartet
- [x] Fehlerbehandlung ist vorhanden
- [x] Die README ist aktualisiert (falls relevant)

### Eingesetzte Tools

| Tool               | Einsatzzweck                        |
| ------------------ | ----------------------------------- |
| Git / GitHub       | Versionsverwaltung, Code-Review     |
| GitHub Projects    | Kanban Board, Sprint-Planung        |
| Discord            | Taegliche Kommunikation, Standups   |
| VS Code / Cursor   | Entwicklungsumgebung                |
| Figma (optional)   | UI-Design und Prototyping           |

### Lessons Learned

1. **Agile Methoden funktionieren auch in kleinen Teams**: Scrum hat uns Struktur gegeben, ohne zu viel Overhead zu erzeugen.
2. **Fruehes Prototyping zahlt sich aus**: Durch das iterative Vorgehen konnten wir frueher Feedback bekommen und den Kurs korrigieren.
3. **KI-Integration erfordert Iteration**: Die Qualitaet der KI-Ausgabe haengt stark vom Prompt-Engineering ab - mehrere Iterationen waren noetig.
4. **Klare API-Grenzen vereinfachen die Arbeit**: Die Trennung in Frontend und Backend hat paralleles Arbeiten ermoeglicht.
5. **Rotierende Rollen foerdern Verstaendnis**: Jedes Teammitglied hat durch die Rollenrotation ein besseres Verstaendnis fuer den gesamten Prozess entwickelt.

---

## Setup-Anleitung

### Voraussetzungen

- **Python** >= 3.10
- **Node.js** >= 18
- **Azure OpenAI Zugang** (fuer KI-Funktionen)

### 1. Backend starten

```bash
cd backend
pip install -r requirements.txt
```

Azure OpenAI konfigurieren (`.env`-Datei im `backend/`-Ordner erstellen):

```
AZURE_OPENAI_ENDPOINT=https://dein-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=dein-api-key-hier
AZURE_OPENAI_API_VERSION=2024-08-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
```

Server starten:

```bash
uvicorn main:app --reload
```

Das Backend laeuft auf `http://localhost:8000`.

### 2. Frontend starten

```bash
cd my-app
npm install
npm run dev
```

Das Frontend laeuft auf `http://localhost:5173` und leitet API-Aufrufe automatisch an das Backend weiter.

### 3. Anwendung nutzen

1. Browser oeffnen: `http://localhost:5173`
2. Vorlesungsfolie hochladen (PDF, PPTX, DOCX, ...)
3. Extrahierten Inhalt pruefen
4. Auf "Karteikarten" oder "Lernzettel" klicken und generieren lassen
5. Karteikarten interaktiv durchgehen oder Lernzettel lesen

---

## API-Endpunkte

| Methode | Endpunkt                        | Beschreibung                             |
| ------- | ------------------------------- | ---------------------------------------- |
| GET     | `/api/health`                   | Health Check                             |
| POST    | `/api/upload`                   | Dokument hochladen und parsen            |
| GET     | `/api/documents`                | Alle Dokumente auflisten                 |
| GET     | `/api/documents/{id}`           | Einzelnes Dokument abrufen               |
| DELETE  | `/api/documents/{id}`           | Dokument entfernen                       |
| POST    | `/api/generate/flashcards/{id}` | Karteikarten generieren (KI)            |
| POST    | `/api/generate/notes/{id}`      | Lernzettel generieren (KI)              |

---

## Unterstuetzte Formate

| Format     | Dateityp              |
| ---------- | --------------------- |
| PDF        | `.pdf`                |
| PowerPoint | `.pptx`               |
| Word       | `.docx`               |
| Excel      | `.xlsx`               |
| HTML       | `.html`, `.htm`       |
| Markdown   | `.md`                 |
| AsciiDoc   | `.adoc`               |
| Bilder     | `.png`, `.jpg`, etc.  |
