import { useState } from 'react'
import { I } from './icons'
import { enrichDoc } from './Library'
import Flashcards from './Flashcards'

// ============================================================
//  Overview tab
// ============================================================
function OverviewTab({ doc, onJump }) {
  const l = enrichDoc(doc)
  return (
    <div className="fade-in">
      <div className="overview-grid">
        <article
          className={`feature-card ${l.notesReady ? 'done' : 'pending'}`}
          onClick={() => onJump('notes')}
        >
          <div className="fc-tag">Lernzettel · {l.notesReady ? 'verfügbar' : 'ausstehend'}</div>
          <h3>Strukturierte Zusammenfassung</h3>
          <p>
            Die KI fasst den Stoff zu einem klaren Lernzettel zusammen — mit Definitionen,
            Formeln und Beispielen. Als PDF herunterladbar.
          </p>
          <div className="fc-meta">
            <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>öffnen →</span>
          </div>
        </article>

        <article className="feature-card pending" onClick={() => onJump('cards')}>
          <div className="fc-tag">Karteikarten · ausstehend</div>
          <h3>Frage-Antwort-Karten</h3>
          <p>
            Karteikarten mit Flip-Animation. Bewerte deine Antworten — schwere Karten
            kommen häufiger zurück.
          </p>
          <div className="fc-meta">
            <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>starten →</span>
          </div>
        </article>

        <article className="feature-card pending" onClick={() => onJump('quiz')}>
          <div className="fc-tag">Quiz · ausstehend</div>
          <h3>Wissens-Check</h3>
          <p>
            Multiple-Choice-Fragen mit Erklärung zum Testen deines Wissens.
          </p>
          <div className="fc-meta">
            <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>starten →</span>
          </div>
        </article>

        <article className="feature-card done">
          <div className="fc-tag">Roh-Inhalt · verfügbar</div>
          <h3>Extrahierter Text</h3>
          <p>
            Der vollständige Vorlesungstext nach Parsing. Zum Weiterverarbeiten in eigene
            Notiz-Apps.
          </p>
          <div className="fc-meta">
            <span>{l.format} · {l.pages !== '—' ? `${l.pages} Seiten` : 'verarbeitet'}</span>
          </div>
        </article>
      </div>
    </div>
  )
}

// ============================================================
//  Notes tab
// ============================================================
function NotesTab({ doc, onGenerate, isGenerating }) {
  const handleDownload = async () => {
    const res = await fetch(`/api/documents/${doc.id}/notes-pdf`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Lernzettel_${doc.filename}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isGenerating) {
    return (
      <div className="notes-generating fade-in">
        <div className="spinner" />
        <h3>Lernzettel wird erstellt...</h3>
        <p>Der Vorlesungsinhalt wird zusammengefasst und als PDF formatiert.</p>
      </div>
    )
  }

  if (!doc.notesPdf) {
    return (
      <div className="notes-generate fade-in">
        <div className="notes-generate-icon">
          <I.Spark size={22} stroke={1.5} />
        </div>
        <h3>Lernzettel erstellen</h3>
        <p>
          Der Vorlesungsinhalt wird zu einem kompakten, strukturierten Lernzettel
          zusammengefasst und als PDF heruntergeladen.
        </p>
        <button className="btn btn-accent btn-lg" onClick={onGenerate}>
          <I.Spark size={14} /> Lernzettel als PDF generieren
        </button>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="notes-toolbar">
        <div className="notes-toolbar-left">
          <span>Lernzettel erstellt</span>
          <span>·</span>
          <span>generiert mit KI</span>
        </div>
        <div className="notes-toolbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={onGenerate}>
            <I.Refresh size={13} /> Neu generieren
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownload}>
            <I.Download size={13} /> Als PDF
          </button>
        </div>
      </div>

      <article className="notes-doc">
        <header className="notes-doc-head">
          <div className="notes-meta">
            <span className="mono">{doc.id?.slice(0, 8).toUpperCase()}</span>
            <span>{doc.filename}</span>
          </div>
          <h1>{doc.filename?.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}</h1>
        </header>
        <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
          Der Lernzettel wurde als PDF heruntergeladen. Du kannst ihn oben erneut
          herunterladen oder neu generieren.
        </p>
      </article>
    </div>
  )
}

// ============================================================
//  Flashcards tab
// ============================================================
function FlashcardsTab({ doc, onGenerate, isGenerating }) {
  return (
    <div className="fade-in">
      <Flashcards
        flashcards={doc.flashcards || null}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
      />
    </div>
  )
}

// ============================================================
//  Quiz tab
// ============================================================
function QuizTab({ doc, onGenerate, isGenerating }) {
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const questions = doc.quiz || null

  if (!questions && !isGenerating) {
    return (
      <div className="generate-prompt fade-in">
        <div className="generate-icon">
          <I.Quiz size={40} stroke={1.2} />
        </div>
        <h3>Quiz generieren</h3>
        <p>Die KI erstellt Multiple-Choice-Fragen aus dem Vorlesungsinhalt, damit du dein Wissen testen kannst.</p>
        <button className="btn-generate" onClick={onGenerate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Quiz erstellen
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="generating fade-in">
        <div className="loading-spinner large" />
        <h3>Quiz wird erstellt...</h3>
        <p>Die KI formuliert Multiple-Choice-Fragen</p>
      </div>
    )
  }

  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.correct).length
    : null

  const reset = () => { setSelected({}); setSubmitted(false) }

  return (
    <div className="quiz-container fade-in">
      {submitted && (
        <div className="quiz-result">
          <span className="quiz-score">{score} / {questions.length}</span>
          <span className="quiz-score-label">richtige Antworten</span>
          <button className="btn btn-ghost btn-sm" onClick={reset}>Nochmal versuchen</button>
        </div>
      )}

      {questions.map((q, qi) => {
        const answered = submitted
        const correct = q.correct
        return (
          <div key={qi} className={`quiz-question ${answered ? 'answered' : ''}`}>
            <p className="quiz-q-text"><strong>{qi + 1}.</strong> {q.question}</p>
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                let cls = 'quiz-option'
                if (answered) {
                  if (oi === correct) cls += ' correct'
                  else if (oi === selected[qi] && selected[qi] !== correct) cls += ' wrong'
                } else if (selected[qi] === oi) {
                  cls += ' selected'
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    disabled={answered}
                    onClick={() => setSelected(s => ({ ...s, [qi]: oi }))}
                  >
                    <span className="quiz-option-letter">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && q.explanation && (
              <p className="quiz-explanation">{q.explanation}</p>
            )}
          </div>
        )
      })}

      {!submitted && (
        <button
          className="btn btn-accent btn-lg"
          disabled={Object.keys(selected).length < questions.length}
          onClick={() => setSubmitted(true)}
        >
          Auswerten
        </button>
      )}

      {submitted && (
        <button className="btn btn-ghost btn-sm" onClick={onGenerate}>
          <I.Refresh size={13} /> Neues Quiz
        </button>
      )}
    </div>
  )
}

// ============================================================
//  Lecture page shell
// ============================================================
function Lecture({
  doc,
  onBack,
  onDelete,
  onGenerateNotes,
  isGeneratingNotes,
  onGenerateFlashcards,
  isGeneratingFlashcards,
  onGenerateQuiz,
  isGeneratingQuiz,
}) {
  const [tab, setTab] = useState('notes')
  const l = enrichDoc(doc)

  const tabs = [
    { id: 'overview', label: 'Übersicht' },
    { id: 'notes',    label: 'Lernzettel', dot: l.notesReady },
    { id: 'cards',    label: 'Karteikarten', dot: !!doc.flashcards },
    { id: 'quiz',     label: 'Quiz', dot: !!doc.quiz },
  ]

  return (
    <div className="lecture-page fade-in">
      <nav className="breadcrumb">
        <a onClick={onBack}>Bibliothek</a>
        <span className="sep">/</span>
        <span>{l.course}</span>
        <span className="sep">/</span>
        <span style={{ color: 'var(--ink-2)' }}>{l.title}</span>
      </nav>

      <header className="lecture-head">
        <div className="page-eyebrow">
          {l.courseCode} · {l.chapter !== '—' ? `Vorlesung ${l.chapter}` : l.format}
        </div>
        <h1 className="page-title">{l.title}</h1>
        <div className="lecture-meta-row">
          <span><strong>{l.format}</strong>{l.pages !== '—' ? ` · ${l.pages} Seiten` : ''}</span>
          <span>Hochgeladen <strong>{l.uploadedAbs || l.uploaded}</strong></span>
          <span>Fortschritt <strong>{Math.round(l.progress * 100)}%</strong></span>
          <span style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={onDelete}>
              <I.Trash size={12} /> Entfernen
            </button>
          </span>
        </div>
      </header>

      <nav className="tabs" role="tablist">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            {t.dot && <span className="dot-ok" />}
          </button>
        ))}
      </nav>

      {tab === 'overview' && <OverviewTab doc={doc} onJump={setTab} />}
      {tab === 'notes'    && (
        <NotesTab
          doc={doc}
          onGenerate={onGenerateNotes}
          isGenerating={isGeneratingNotes}
        />
      )}
      {tab === 'cards' && (
        <FlashcardsTab
          doc={doc}
          onGenerate={onGenerateFlashcards}
          isGenerating={isGeneratingFlashcards}
        />
      )}
      {tab === 'quiz' && (
        <QuizTab
          doc={doc}
          onGenerate={onGenerateQuiz}
          isGenerating={isGeneratingQuiz}
        />
      )}
    </div>
  )
}

export default Lecture
