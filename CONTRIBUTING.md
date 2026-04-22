# Mitarbeiten im System-Engineering-Project

Dieses Dokument beschreibt unseren verbindlichen Arbeitsablauf:  
**Wer macht was, bis wann** – und wie wir das auf GitHub sichtbar machen.

---

## 📋 Aufgabenstruktur: Keine Arbeit ohne Issue

Jede Aufgabe – egal wie klein – wird als **GitHub Issue** angelegt, bevor die Arbeit beginnt.

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| Titel | ✅ | Kurz und konkret (z. B. `Task: Login-Seite responsiv machen`) |
| Template | ✅ | Passendes Template auswählen (Task / Bug / User Story) |
| Verantwortlich | ✅ | Genau eine Person als Assignee eintragen |
| Deadline | ✅ | Im Issue-Body und als Milestone eintragen |
| Labels | ✅ | Mindestens Status + Priorität + Bereich |
| Milestone | ✅ | Dem aktuellen Sprint/Milestone zuordnen |

### Issue-Templates

| Template | Wann verwenden |
|----------|---------------|
| 📋 **Aufgabe (Task)** | Konkrete Arbeitsaufgabe mit Deadline & Verantwortlichkeit |
| ✨ **User Story** | Neues Feature aus Nutzerperspektive |
| 🐛 **Bug Report** | Etwas funktioniert nicht wie erwartet |

---

## 🏷️ Labels

Labels machen Status, Priorität und Bereich auf einen Blick sichtbar.  
Importiere alle Labels mit [`github-label-sync`](https://github.com/Financial-Times/github-label-sync) oder manuell:

```bash
npx github-label-sync --access-token <TOKEN> --labels .github/labels.yml Fabi762/System-Engineering-Project
```

**Pflicht-Labels pro Issue:**
- Ein **Status**-Label (z. B. `status: offen`)
- Ein **Priorität**-Label (z. B. `priorität: hoch`)
- Ein **Bereich**-Label (z. B. `bereich: frontend`)

---

## 📊 Project Board

Wir verwenden ein GitHub Project Board mit folgenden Spalten:

```
Backlog → Geplant → In Arbeit → Review → Fertig
```

- Jede neue Aufgabe landet zuerst im **Backlog**.
- In der wöchentlichen Planungsrunde werden Aufgaben nach **Geplant** verschoben und einer Person + Termin zugewiesen.
- Beim Start der Arbeit: Status-Label auf `status: in bearbeitung` setzen und Karte nach **In Arbeit** verschieben.
- Nach dem PR: nach **Review** verschieben.
- Nach dem Merge: nach **Fertig** verschieben und Issue schließen.

---

## 🏁 Milestones (Zeitplanung)

Aufgaben werden immer einem **Milestone** zugeordnet (z. B. Sprint 1, Sprint 2 oder ein konkreter Release).

- Milestone-Name: `Sprint X – YYYY-MM-DD` (Deadline des Sprints als Datum)
- Am Ende jedes Sprints: offene Issues prüfen → entweder abschließen oder in den nächsten Milestone verschieben.

---

## 🔄 Wöchentlicher Ablauf

| Zeitpunkt | Aktivität |
|-----------|-----------|
| **Montag** | Planungsrunde: neue Issues priorisieren, Milestone & Assignee setzen |
| **Laufend** | Status-Labels aktuell halten; Blocker sofort als `status: blockiert` markieren |
| **Freitag** | Kurzer Check: Was wurde fertig? Was ist offen? Board bereinigen. |

---

## 🔀 Pull Requests

1. Erstelle einen Branch: `feature/<issue-nummer>-kurzbeschreibung` oder `fix/<issue-nummer>-kurzbeschreibung`
2. Verknüpfe den PR immer mit dem zugehörigen Issue im PR-Body:
   ```
   Löst Issue: #<Nummer>
   ```
   GitHub schließt das Issue dann automatisch beim Merge.
3. Fülle die **PR-Checkliste** vollständig aus.
4. Mindestens **ein anderes Teammitglied** muss den PR reviewen, bevor er gemergt wird.

---

## 📌 Kurzregeln auf einen Blick

- ✅ Jede Aufgabe zuerst als Issue anlegen.
- ✅ Issue immer mit Deadline, Assignee, Labels und Milestone versehen.
- ✅ PRs immer mit dem Issue verknüpfen (`Löst Issue: #X`).
- ✅ Status-Labels laufend aktuell halten.
- ✅ Kein direkter Push auf `main` – immer über einen PR.
