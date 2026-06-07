# Testplan – StudyBuddy

**Projekt:** StudyBuddy – KI-gestützter Lernassistent  
**Version:** 1.0  
**Stand:** Juni 2026  
**Team:** Leon, Mario, Fabian  

---

## 1. Teststrategie

Ziel des Testplans ist die systematische Verifikation der Backend-Logik durch Äquivalenzklassen-Tests (Unit-Tests) sowie die Integration aller Systemkomponenten durch einen strukturierten Integrationstestplan.

**Testmethoden:**
- **Äquivalenzklassenanalyse** für Unit-Tests (Black-Box-Methode)
- **Grenzwertanalyse** zur Ergänzung der Äquivalenzklassen
- **Bottom-Up-Integration** für den Integrationstestplan
- **Regressionsverfahren:** Selektive Regression (risikoorientiert)

---

## 2. Unit-Testplan

### 2.1 Methode 1: `_document_stem(filename: str) -> str`

**Speicherort:** `backend/main.py`, Zeile 51–58  
**Zweck:** Extrahiert den Basis-Dateinamen ohne bekannte Erweiterungen (iterativ, bis keine bekannte Endung mehr entfernt werden kann).  
**Bekannte Endungen:** `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.txt`, `.md`, `.html`

#### Äquivalenzklassentabelle

| EK-ID | Klasse      | Beschreibung                                    | Repräsentativer Testwert    | Erwartete Ausgabe       |
|-------|-------------|------------------------------------------------|-----------------------------|-------------------------|
| EK1   | Gültig      | Dateiname mit einer bekannten Endung           | `"Vorlesung.pdf"`           | `"Vorlesung"`           |
| EK2   | Gültig      | Dateiname mit mehrfachen bekannten Endungen    | `"Skript.md.pdf"`           | `"Skript"`              |
| EK3   | Gültig      | Dateiname ohne Endung                          | `"MeineVorlesung"`          | `"MeineVorlesung"`      |
| EK4   | Gültig      | Dateiname mit unbekannter Endung               | `"Bild.jpg"`                | `"Bild.jpg"`            |
| EK5   | Gültig      | Pfadangabe mit Verzeichnissen                  | `"/home/user/Vorlesung.pdf"`| `"Vorlesung"`           |
| EK6   | Ungültig    | Leerer String                                  | `""`                        | `"Lernzettel"` (Fallback)|
| EK7   | Grenzwert   | Nur Erweiterung, kein eigentlicher Name        | `".pdf"`                    | `".pdf"`                |
| EK8   | Grenzwert   | Dateiname mit Leerzeichen                      | `"Meine Vorlesung.pdf"`     | `"Meine Vorlesung"`     |
| EK9   | Grenzwert   | Alle bekannten Endungen kombiniert             | `"notes.docx.pptx.pdf"`     | `"notes"`               |

#### Testfälle

| TC-ID | EK    | Eingabe                        | Erwartete Ausgabe       | Ergebnis |
|-------|-------|--------------------------------|-------------------------|----------|
| TC1.1 | EK1   | `"Vorlesung.pdf"`              | `"Vorlesung"`           | ✅ OK    |
| TC1.2 | EK2   | `"Skript.md.pdf"`              | `"Skript"`              | ✅ OK    |
| TC1.3 | EK3   | `"MeineVorlesung"`             | `"MeineVorlesung"`      | ✅ OK    |
| TC1.4 | EK4   | `"Bild.jpg"`                   | `"Bild.jpg"`            | ✅ OK    |
| TC1.5 | EK5   | `"/home/user/Vorlesung.pdf"`   | `"Vorlesung"`           | ✅ OK    |
| TC1.6 | EK6   | `""`                           | `"Lernzettel"`          | ✅ OK    |
| TC1.7 | EK7   | `".pdf"`                       | `".pdf"`                | ✅ OK    |
| TC1.8 | EK8   | `"Meine Vorlesung.pdf"`        | `"Meine Vorlesung"`     | ✅ OK    |
| TC1.9 | EK9   | `"notes.docx.pptx.pdf"`       | `"notes"`               | ✅ OK    |

#### Begründung der Äquivalenzklassen

- **EK1/EK2:** Normalfall – Funktion soll eine oder mehrere bekannte Endungen zuverlässig entfernen. Beide bilden die Hauptfunktionalität ab.
- **EK3/EK4:** Dateien ohne oder mit unbekannter Endung sollen unverändert zurückgegeben werden.
- **EK5:** Pfade dürfen die Funktion nicht verwirren – `os.path.basename()` muss korrekt wirken.
- **EK6:** Robustheit gegen leere Eingabe (Fallback-Wert „Lernzettel").
- **EK7/EK8/EK9:** Grenzwerte für Edge Cases, die im regulären Betrieb auftreten können.

---

### 2.2 Methode 2: `_build_notes_filename(source_filename: str) -> str`

**Speicherort:** `backend/main.py`, Zeile 61–65  
**Zweck:** Erzeugt den Ausgabe-Dateinamen für den PDF-Lernzettel. Verhindert doppelten „Lernzettel_"-Prefix und ersetzt Leerzeichen durch Unterstriche.

```python
def _build_notes_filename(source_filename: str) -> str:
    stem = _document_stem(source_filename).replace(" ", "_")
    if stem.lower().startswith("lernzettel_"):
        return f"{stem}.pdf"
    return f"Lernzettel_{stem}.pdf"
```

#### Äquivalenzklassentabelle

| EK-ID | Klasse    | Beschreibung                                                       | Repräsentativer Testwert          | Erwartete Ausgabe                    |
|-------|-----------|--------------------------------------------------------------------|-----------------------------------|--------------------------------------|
| EK1   | Gültig    | Normaler Dateiname → Prefix „Lernzettel_" wird vorangestellt       | `"Vorlesung.pdf"`                 | `"Lernzettel_Vorlesung.pdf"`         |
| EK2   | Gültig    | Stem beginnt bereits mit „Lernzettel_" (Großschreibung)            | `"Lernzettel_Mathe.pdf"`          | `"Lernzettel_Mathe.pdf"`             |
| EK3   | Gültig    | Stem beginnt mit „lernzettel_" (Kleinschreibung, case-insensitive) | `"lernzettel_Physik.pdf"`         | `"lernzettel_Physik.pdf"`            |
| EK4   | Gültig    | Dateiname mit Leerzeichen → Leerzeichen werden zu Unterstrichen    | `"Meine Vorlesung.pdf"`           | `"Lernzettel_Meine_Vorlesung.pdf"`   |
| EK5   | Ungültig  | Leerer String → Fallback „Lernzettel" aus `_document_stem`         | `""`                              | `"Lernzettel_Lernzettel.pdf"`        |
| EK6   | Grenzwert | Dateiname ist exakt „Lernzettel" (ohne Endung)                     | `"Lernzettel"`                    | `"Lernzettel_Lernzettel.pdf"`        |
| EK7   | Grenzwert | Dateiname mit unbekannter Endung                                   | `"Folie.ppt"`                     | `"Lernzettel_Folie.ppt.pdf"`         |
| EK8   | Grenzwert | Dateiname beginnt mit „LERNZETTEL_" (Großbuchstaben, case check)   | `"LERNZETTEL_Info.pdf"`           | `"LERNZETTEL_Info.pdf"`              |

#### Testfälle

| TC-ID | EK    | Eingabe                        | Erwartete Ausgabe                    | Ergebnis |
|-------|-------|--------------------------------|--------------------------------------|----------|
| TC2.1 | EK1   | `"Vorlesung.pdf"`              | `"Lernzettel_Vorlesung.pdf"`         | ✅ OK    |
| TC2.2 | EK2   | `"Lernzettel_Mathe.pdf"`       | `"Lernzettel_Mathe.pdf"`             | ✅ OK    |
| TC2.3 | EK3   | `"lernzettel_Physik.pdf"`      | `"lernzettel_Physik.pdf"`            | ✅ OK    |
| TC2.4 | EK4   | `"Meine Vorlesung.pdf"`        | `"Lernzettel_Meine_Vorlesung.pdf"`   | ✅ OK    |
| TC2.5 | EK5   | `""`                           | `"Lernzettel_Lernzettel.pdf"`        | ✅ OK    |
| TC2.6 | EK6   | `"Lernzettel"`                 | `"Lernzettel_Lernzettel.pdf"`        | ✅ OK    |
| TC2.7 | EK7   | `"Folie.ppt"`                  | `"Lernzettel_Folie.ppt.pdf"`         | ✅ OK    |
| TC2.8 | EK8   | `"LERNZETTEL_Info.pdf"`        | `"LERNZETTEL_Info.pdf"`              | ✅ OK    |

#### Begründung der Äquivalenzklassen

- **EK1:** Hauptfall – fast alle Uploads laufen hierüber.
- **EK2/EK3/EK8:** Verhindern des doppelten Prefixes; case-insensitiver Check über `.lower().startswith(...)` muss alle Varianten abfangen.
- **EK4:** Leerzeichen in Dateinamen sind häufig (z. B. Upload vom Desktop). PDF-Dateiname muss sauber sein.
- **EK5/EK6:** Robustheit gegen Randfälle; Funktion darf nie abstürzen.
- **EK7:** Unbekannte Endungen sollen nicht doppelt behandelt werden.

---

### 2.3 Beispiel-Testcode (pytest)

```python
# backend/tests/test_utils.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import _document_stem, _build_notes_filename
import pytest

class TestDocumentStem:
    def test_ek1_single_known_extension(self):
        assert _document_stem("Vorlesung.pdf") == "Vorlesung"

    def test_ek2_multiple_known_extensions(self):
        assert _document_stem("Skript.md.pdf") == "Skript"

    def test_ek3_no_extension(self):
        assert _document_stem("MeineVorlesung") == "MeineVorlesung"

    def test_ek4_unknown_extension(self):
        assert _document_stem("Bild.jpg") == "Bild.jpg"

    def test_ek5_path_with_directories(self):
        assert _document_stem("/home/user/Vorlesung.pdf") == "Vorlesung"

    def test_ek6_empty_string(self):
        assert _document_stem("") == "Lernzettel"

    def test_ek7_only_extension(self):
        assert _document_stem(".pdf") == ".pdf"

    def test_ek8_filename_with_spaces(self):
        assert _document_stem("Meine Vorlesung.pdf") == "Meine Vorlesung"

    def test_ek9_all_known_extensions_chained(self):
        assert _document_stem("notes.docx.pptx.pdf") == "notes"


class TestBuildNotesFilename:
    def test_ek1_normal_filename(self):
        assert _build_notes_filename("Vorlesung.pdf") == "Lernzettel_Vorlesung.pdf"

    def test_ek2_already_prefixed_uppercase(self):
        assert _build_notes_filename("Lernzettel_Mathe.pdf") == "Lernzettel_Mathe.pdf"

    def test_ek3_already_prefixed_lowercase(self):
        assert _build_notes_filename("lernzettel_Physik.pdf") == "lernzettel_Physik.pdf"

    def test_ek4_filename_with_spaces(self):
        assert _build_notes_filename("Meine Vorlesung.pdf") == "Lernzettel_Meine_Vorlesung.pdf"

    def test_ek5_empty_string(self):
        assert _build_notes_filename("") == "Lernzettel_Lernzettel.pdf"

    def test_ek6_stem_equals_lernzettel(self):
        assert _build_notes_filename("Lernzettel") == "Lernzettel_Lernzettel.pdf"

    def test_ek8_all_caps_prefix(self):
        assert _build_notes_filename("LERNZETTEL_Info.pdf") == "LERNZETTEL_Info.pdf"
```

**Ausführen:** `cd backend && python -m pytest tests/test_utils.py -v`

---

## 3. Integrationstestplan

### 3.1 Vorgehensweise: Bottom-Up-Integration

Die Integration erfolgt von den innersten Modulen (reine Funktionen) nach außen (API-Endpoints) bis hin zum vollständigen System.

```
Stufe 1: Unit-Tests (isolierte Funktionen)
    ↓
Stufe 2: Backend-API ohne KI (In-Memory-Tests)
    ↓
Stufe 3: Backend + Azure OpenAI (KI-Integration)
    ↓
Stufe 4: Backend + LaTeX-Compiler (PDF-Generierung)
    ↓
Stufe 5: Frontend + Backend (End-to-End)
```

---

### 3.2 Integrationsstufen

#### Stufe 1 – Unit-Tests (Funktionen isoliert)

| TC-ID | Komponente             | Testfall                                        | Erwartetes Ergebnis                |
|-------|------------------------|-------------------------------------------------|------------------------------------|
| IT1.1 | `_document_stem`       | Alle EK-Tests aus Abschnitt 2.1                 | Alle Assertions grün               |
| IT1.2 | `_build_notes_filename`| Alle EK-Tests aus Abschnitt 2.2                 | Alle Assertions grün               |
| IT1.3 | `azure_openai_configured` | Alle 4 Env-Variablen gesetzt → `True`        | `True`                             |
| IT1.4 | `azure_openai_configured` | Eine Env-Variable fehlt → `False`            | `False`                            |

---

#### Stufe 2 – Backend-API ohne KI-Integration

**Werkzeug:** `httpx.AsyncClient` mit FastAPI `TestClient` oder `pytest-asyncio`

| TC-ID | Endpoint                   | Testfall                                          | Erwartetes Ergebnis                       |
|-------|----------------------------|---------------------------------------------------|-------------------------------------------|
| IT2.1 | `GET /api/health`          | Backend gestartet                                  | `{"status": "ok", ...}`                   |
| IT2.2 | `POST /api/upload`         | Valide PDF-Datei hochladen                         | HTTP 200, `id`, `filename`, `markdown` vorhanden |
| IT2.3 | `POST /api/upload`         | Leere Datei hochladen                              | HTTP 200 oder HTTP 500 (keine Exception) |
| IT2.4 | `GET /api/documents`       | Nach Upload: Dokumentliste                          | Liste enthält 1 Dokument               |
| IT2.5 | `GET /api/documents/{id}`  | Valide ID                                          | HTTP 200 + Dokument-JSON               |
| IT2.6 | `GET /api/documents/{id}`  | Ungültige ID                                       | HTTP 404                               |
| IT2.7 | `DELETE /api/documents/{id}` | Valide ID                                        | HTTP 200, Datei von Dateisystem entfernt |
| IT2.8 | `DELETE /api/documents/{id}` | Bereits gelöschte ID                             | HTTP 404                               |

---

#### Stufe 3 – Backend + Azure OpenAI

> **Hinweis:** Diese Tests erfordern eine gültige `.env` mit Azure-Zugangsdaten oder einen HTTP-Mock (z. B. `respx`).

| TC-ID | Endpoint                           | Testfall                                              | Erwartetes Ergebnis                                     |
|-------|------------------------------------|-------------------------------------------------------|---------------------------------------------------------|
| IT3.1 | `POST /api/generate/notes/{id}`    | Konfiguriertes Backend + Dokument vorhanden            | HTTP 200, `{"notes_pdf": true}`                         |
| IT3.2 | `POST /api/generate/notes/{id}`    | Azure OpenAI nicht konfiguriert                        | HTTP 503                                               |
| IT3.3 | `POST /api/generate/flashcards/{id}?count=5` | count=5, gültiges Dokument               | HTTP 200, `flashcards` mit 5 Einträgen                  |
| IT3.4 | `POST /api/generate/flashcards/{id}?count=0` | Untergrenze: clamp auf 1                | HTTP 200, `flashcards` mit 1 Eintrag                    |
| IT3.5 | `POST /api/generate/flashcards/{id}?count=99` | Obergrenze: clamp auf 40               | HTTP 200, `flashcards` mit 40 Einträgen                 |
| IT3.6 | `POST /api/generate/quiz/{id}`     | Gültiges Dokument                                     | HTTP 200, `questions` mit 5 Multiple-Choice-Fragen      |

---

#### Stufe 4 – Backend + LaTeX-Compiler (PDF-Generierung)

| TC-ID | Funktion                         | Testfall                                              | Erwartetes Ergebnis                           |
|-------|----------------------------------|-------------------------------------------------------|-----------------------------------------------|
| IT4.1 | `markdown_to_latex_and_pdf()`    | Einfacher Markdown-Text, LaTeX verfügbar              | Gibt nicht-leere `bytes` zurück, gültiges PDF |
| IT4.2 | `markdown_to_latex_and_pdf()`    | Markdown mit `**fett**` und `$Formel$`                | PDF enthält korrektes LaTeX                   |
| IT4.3 | `markdown_to_latex_and_pdf()`    | Sonderzeichen in Dateiname (`&`, `#`, `_`)            | Keine LaTeX-Kompilierungsfehler               |
| IT4.4 | `GET /api/documents/{id}/notes-pdf` | Nach Stufe 3, PDF vorhanden                        | HTTP 200, Content-Type: application/pdf       |
| IT4.5 | `markdown_to_latex_and_pdf()`    | Kein LaTeX-Compiler installiert                       | `RuntimeError` mit verständlicher Fehlermeldung |

---

#### Stufe 5 – Frontend + Backend (End-to-End)

| TC-ID | Szenario                                 | Schritte                                                                 | Erwartetes Ergebnis                                         |
|-------|------------------------------------------|--------------------------------------------------------------------------|-------------------------------------------------------------|
| IT5.1 | Vollständiger Upload-Flow                | App öffnen → Datei hochladen → Dokument erscheint in Bibliothek          | Dokument in Library mit korrektem Dateinamen und Status     |
| IT5.2 | Lernzettel-Generierung und Download      | Dokument auswählen → Lernzettel generieren → PDF wird heruntergeladen    | PDF-Datei im Download-Ordner, Fortschritt 50 % in Bibliothek |
| IT5.3 | Karteikarten-Generierung                 | Dokument → Karteikarten-Tab → 10 Karten erstellen                        | 10 Karteikarten mit Flip-Animation nutzbar                  |
| IT5.4 | Quiz-Modus                               | Dokument → Quiz-Tab → Quiz generieren → alle Fragen beantworten          | Score wird korrekt berechnet, Erklärungen sichtbar          |
| IT5.5 | Dokument löschen                         | Dokument auswählen → Löschen → Bestätigung                               | Dokument aus Bibliothek entfernt, Datei vom Server gelöscht |
| IT5.6 | Dunkel-/Hellmodus-Umschalter             | Dark-Mode-Button klicken                                                 | UI-Theme wechselt korrekt, kein Layout-Bruch                |

---

### 3.3 Regressionsverfahren

**Ansatz:** Selektive Regression (risikoorientiert)

Bei jeder Code-Änderung wird basierend auf den betroffenen Komponenten der minimale Teststufen-Bereich festgelegt:

| Änderungsbereich                          | Zu wiederholende Stufen              |
|-------------------------------------------|--------------------------------------|
| `_document_stem`, `_build_notes_filename` | Stufe 1                              |
| Backend-Endpoints (Upload, Delete, List)  | Stufe 1 + Stufe 2                    |
| Azure-OpenAI-Prompts oder Parsing         | Stufe 1 + Stufe 3                    |
| `markdown_to_latex_and_pdf()`             | Stufe 1 + Stufe 4                    |
| Frontend-Komponenten                      | Stufe 5 (manuell)                    |
| Major Refactoring / Breaking Changes      | **Full Regression** (alle Stufen)    |

**Frequenz:** Nach jedem Merge in den `main`-Branch werden mindestens Stufe 1 und Stufe 2 automatisiert ausgeführt.

---

## 4. Testzusammenfassung

| Testart              | Anzahl Testfälle | Abdeckung                             |
|----------------------|-----------------|---------------------------------------|
| Unit-Tests (EK)      | 17              | `_document_stem`, `_build_notes_filename` |
| Backend-Integration  | 8               | Alle API-Endpoints ohne KI            |
| KI-Integration       | 6               | Notes, Flashcards, Quiz               |
| PDF-Generierung      | 5               | LaTeX-Renderer                        |
| End-to-End           | 6               | Vollständige User-Flows               |
| **Gesamt**           | **42**          |                                       |
