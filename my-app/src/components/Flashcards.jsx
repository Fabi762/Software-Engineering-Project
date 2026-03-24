import { useState } from 'react'

function Flashcards({ flashcards, onGenerate, isGenerating }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (!flashcards && !isGenerating) {
    return (
      <div className="generate-prompt">
        <div className="generate-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h3>Karteikarten generieren</h3>
        <p>
          Die KI erstellt automatisch Frage-Antwort-Karten aus dem Vorlesungsinhalt,
          damit du dein Wissen testen kannst.
        </p>
        <button className="btn-generate" onClick={onGenerate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Karteikarten erstellen
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="generating">
        <div className="loading-spinner large" />
        <h3>Karteikarten werden erstellt...</h3>
        <p>Die KI analysiert den Vorlesungsinhalt</p>
      </div>
    )
  }

  const card = flashcards[currentIndex]

  const goTo = (index) => {
    setCurrentIndex(index)
    setIsFlipped(false)
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-progress">
        <span className="flashcard-counter">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="flashcard-label">FRAGE</span>
            <p className="flashcard-text">{card.question}</p>
            <span className="flashcard-hint">Klicken zum Umdrehen</span>
          </div>
          <div className="flashcard-back">
            <span className="flashcard-label">ANTWORT</span>
            <p className="flashcard-text">{card.answer}</p>
            <span className="flashcard-hint">Klicken zum Umdrehen</span>
          </div>
        </div>
      </div>

      <div className="flashcard-nav">
        <button
          className="btn-nav"
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Zurück
        </button>
        <button
          className="btn-nav"
          onClick={() => goTo(Math.min(flashcards.length - 1, currentIndex + 1))}
          disabled={currentIndex === flashcards.length - 1}
        >
          Weiter
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Flashcards
