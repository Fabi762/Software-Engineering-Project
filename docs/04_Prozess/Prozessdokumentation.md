# Prozessdokumentation – StudyBuddy

**Projekt:** StudyBuddy – KI-gestützter Lernassistent  
**Zeitraum:** November 2025 – Juni 2026  
**Team:** Leon Adolph, Mario Cubela, Fabian (Nachname)

---

## 1. Vorgehensmodell

Wir haben ein **agiles Vorgehensmodell auf Basis von Scrum** verwendet, angepasst an ein 3-köpfiges Uni-Team. Die wichtigsten Merkmale:

- **Sprints** mit einer Länge von **2–4 Wochen**
- **GitHub Issues** als Product Backlog (User Stories mit Akzeptanzkriterien, Tasks und Story Points)
- **GitHub Milestones** als Sprint-Ziele
- **GitHub Commits** als kontinuierliches Fortschrittsprotokoll
- Keine formalen Daily Stand-ups, stattdessen **asynchrone Kommunikation via GitHub-Kommentare**

---

## 2. Rollen

| Rolle           | Person  | Sprint(s)       |
|-----------------|---------|-----------------|
| Product Owner   | Mario   | Sprint 1–4      |
| Scrum Master    | Leon    | Sprint 1 & 2    |
| Scrum Master    | Fabian  | Sprint 3 & 4    |
| Entwickler      | Alle    | Sprint 1–4      |

**Aufgabenverteilung (grob):**
- **Leon:** Backend-Hauptentwicklung (FastAPI, KI-Integration, LaTeX-PDF-Renderer), Diagrammerstellung, Deployment-Skripte
- **Mario:** Frontend-Entwicklung (React-Komponenten), Product-Owner-Aufgaben (User Story Refinement)
- **Fabian:** Full-Stack-Beiträge (Upload-Flow, Karteikarten/Quiz-Feature), Infrastruktur (Makefile, Start/Stop-Skripte)

---

## 3. Sprint-Planung und -Durchführung

### Sprint 1 – Projektgrundlage aufsetzen
**Zeitraum:** November 2025  
**Milestone:** Projektsetup & Grundarchitektur  
**User Story:** US-1 (SP: 8)

**Ziel:** Technische Basis schaffen – React-Frontend, FastAPI-Backend, lokale Entwicklungsumgebung.

**Durchgeführte Aktivitäten:**
- Sprint Planning: Aufteilung der Aufgaben aus US-1 (6 Tasks)
- Umsetzung: Git-Repository anlegen, React mit Vite einrichten, FastAPI-Backend aufsetzen
- Start/Stop-Skripte erstellen (`start.bat`, `stop.bat`, `Makefile`)
- `.env`-Struktur und `.gitignore` anlegen
- Sprint Review: Anwendung ist lokal startbar, Health-Endpoint `/api/health` liefert `{"status": "ok"}`

**Ergebnis:** ✅ US-1 abgeschlossen, Issue #4 geschlossen.

---

### Sprint 2 – Dokumenten-Upload und -Parsing
**Zeitraum:** Februar – März 2026  
**Milestone:** Dokumenten-Upload & Parsing  
**User Stories:** US-2 (SP: 13)

**Ziel:** Nutzer kann Dateien hochladen, Text wird extrahiert, Bibliotheksansicht zeigt alle Dokumente.

**Durchgeführte Aktivitäten:**
- Sprint Planning: 6 Tasks aus US-2 aufgeteilt (Frontend: Upload.jsx, Library.jsx, Lecture.jsx; Backend: Upload-Endpoint, PyPDF-Integration)
- Umsetzung: Drag & Drop Upload-Komponente, `POST /api/upload` mit UUID-Prefix, PyPDF-Textextraktion, Bibliotheks- und Detailansicht
- Sprint Review: Upload-Flow vollständig, Dokumente erscheinen in Library mit Status-Pills
- Sprint Retrospektive: Teamabsprache zu Code-Konventionen (Dateibenennung, Commit-Messages)

**Ergebnis:** ✅ US-2 abgeschlossen, Issue #9 geschlossen.

---

### Sprint 3 – KI-Integration und Dokumentenverwaltung
**Zeitraum:** April 2026  
**Milestones:** KI-Integration (Lernzettel), Dokumentenverwaltung  
**User Stories:** US-3 (SP: 8), US-4 (SP: 8)

**Ziel:** KI-gestützte Lernzettelgenerierung als PDF sowie verbesserte Dokumentenverwaltung (Löschen, Status, Benachrichtigungen).

**Durchgeführte Aktivitäten:**
- Sprint Planning: Tasks aus US-3 und US-4 in Parallelarbeit aufgeteilt
- Umsetzung US-3: Azure OpenAI-Client (`httpx`), `POST /api/generate/notes/{doc_id}`, Markdown-zu-LaTeX-Renderer, `GET /api/documents/{doc_id}/notes-pdf`
- Umsetzung US-4: Delete-Endpoint und -Button, Status-Pills, Toast-Benachrichtigungssystem, „Neu"-Button im Header
- Zwischenproblem: Erster LaTeX-Ansatz mit `fpdf2` ergab keine sauberen Formeln → Umstieg auf LaTeX-Kompilierung via `pdflatex`/`tectonic` (Commit: `fix(pdf): Implement custom Markdown to PDF renderer`)
- Sprint Review: Lernzettel werden korrekt als PDF heruntergeladen, Toast-Meldungen funktionieren
- GitHub Issue- und PR-Templates angelegt (Commit: `Set up GitHub issue and PR templates`)

**Ergebnis:** ✅ US-3 und US-4 abgeschlossen, Issues #23 und #19 geschlossen.

---

### Sprint 4 – Karteikarten, Quiz und Fertigstellung
**Zeitraum:** April – Mai 2026  
**Milestone:** Karteikarten & UI-Polish  
**User Stories:** US-5 (SP: 13)

**Ziel:** Interaktive Karteikarten mit 3D-Flip-Animation, Multiple-Choice-Quiz, responsives Design.

**Durchgeführte Aktivitäten:**
- Sprint Planning: 8 Tasks aus US-5 verteilt (Backend-Stubs → KI-Generierung → Frontend-UI → UI-Polish)
- Umsetzung: `POST /api/generate/flashcards/{doc_id}`, `POST /api/generate/quiz/{doc_id}`, Flashcards.jsx (Flip-Animation, Navigation, Fortschrittsanzeige), QuizTab (Multiple Choice, Score, Erklärungen), wählbare Karteikarten-Anzahl (1–40)
- UI-Polish: Dark-Mode-Überarbeitung, responsives Design für Mobile, Animationen verfeinert
- Sprint Review: Alle Features der App vollständig und stabil
- Abschlussarbeiten: UML-Diagramme (Klassendiagramm, Use-Case-Diagramm, Sequenzdiagramm) erstellt, Dokumentation vervollständigt

**Ergebnis:** ✅ US-5 abgeschlossen, Issue #24 geschlossen.

---

## 4. Meetings und Kommunikation

| Meeting-Typ          | Frequenz                  | Teilnehmer | Format         |
|----------------------|---------------------------|------------|----------------|
| Sprint Planning      | 1× pro Sprint (zu Beginn) | Alle       | Persönlich/Teams |
| Sprint Review        | 1× pro Sprint (am Ende)   | Alle       | Persönlich/Teams |
| Sprint Retrospektive | 1× pro Sprint (am Ende)   | Alle       | Persönlich/Teams |
| Ad-hoc Abstimmung    | Bei Bedarf                | Alle       | WhatsApp/Teams |
| Code-Review          | Bei Pull Requests         | 2 Personen | GitHub PR-Kommentare |

**Asynchrone Kommunikation:** Hauptsächlich über GitHub-Commits, Issue-Kommentare und WhatsApp.

---

## 5. KanBan-Board (GitHub Milestones als Sprint-Backlog)

Die Aufgabenplanung wurde über **GitHub Issues und Milestones** organisiert, ergänzt durch ein informelles KanBan-Board:

| Spalte      | Bedeutung                              | Realisierung in GitHub                   |
|-------------|----------------------------------------|------------------------------------------|
| **Backlog** | Alle geplanten User Stories            | Offene Issues ohne aktiven Milestone     |
| **To Do**   | Tasks im aktiven Sprint                | Issues des aktuellen Milestone           |
| **In Progress** | Aktive Entwicklung                 | Issues mit Assignee und offenen Tasks    |
| **Done**    | Fertiggestellte Tasks                  | Geschlossene Issues (Checkbox ✅)        |

**Sprint-Übersicht:**

| Milestone                        | Issues           | SP   | Status       |
|----------------------------------|------------------|------|--------------|
| Projektsetup & Grundarchitektur  | #4               | 8    | Abgeschlossen |
| Dokumenten-Upload & Parsing      | #9, #1           | 13   | Abgeschlossen |
| KI-Integration (Lernzettel)      | #23, #19         | 16   | Abgeschlossen |
| Karteikarten & UI-Polish         | #24              | 13   | Abgeschlossen |
| **Gesamt**                       |                  | **50** |             |

---

## 6. Eingesetzte Methoden und Werkzeuge

| Bereich            | Methode / Werkzeug                                     |
|--------------------|--------------------------------------------------------|
| Vorgehensmodell    | Scrum (angepasst für 3-Personen-Team)                  |
| Anforderungen      | User Stories (GitHub Issues) mit Akzeptanzkriterien und Story Points |
| Planung            | GitHub Milestones als Sprint-Ziele, GitHub Issues als Backlog |
| Versionsverwaltung | Git mit GitHub, Feature-Branches + Merge in `main`    |
| Dokumentation      | Markdown in GitHub, PlantUML-Diagramme                 |
| Code-Qualität      | GitHub PR-Templates, Code-Reviews bei Merges           |
| Deployment         | Lokale Entwicklung, Start/Stop-Skripte (`start.bat`, `Makefile`) |
| Kommunikation      | GitHub Issues/Commits, WhatsApp, persönliche Meetings  |

---

## 7. Lessons Learned

| Problem                                  | Lösung / Entscheidung                                                                |
|------------------------------------------|--------------------------------------------------------------------------------------|
| `fpdf2` konnte LaTeX-Formeln nicht rendern | Umstieg auf echte LaTeX-Kompilierung via `pdflatex`/`tectonic` (Sprint 3)           |
| In-Memory-Store verliert Daten bei Neustart | Bekannte Einschränkung, für Uni-Projekt akzeptiert (kein persistentes DB-Layer)     |
| Merge-Konflikte bei paralleler Entwicklung | Klare Dateiaufteilung Frontend/Backend reduzierte Konflikte                          |
| LaTeX-Sonderzeichen aus Dateinamen       | `_escape_latex()`-Funktion im Backend zur sicheren Umwandlung implementiert          |
