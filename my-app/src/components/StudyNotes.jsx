function StudyNotes({ notesPdf, docId, onGenerate, isGenerating }) {
  const handleDownload = async () => {
    const res = await fetch(`/api/documents/${docId}/notes-pdf`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Lernzettel.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!notesPdf && !isGenerating) {
    return (
      <div className="generate-prompt">
        <div className="generate-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h3>Lernzettel erstellen</h3>
        <p>
          Der Vorlesungsinhalt wird zu einem kompakten, strukturierten
          Lernzettel zusammengefasst und als PDF heruntergeladen.
        </p>
        <button className="btn-generate" onClick={onGenerate}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Lernzettel als PDF generieren
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="generating">
        <div className="loading-spinner large" />
        <h3>Lernzettel wird erstellt...</h3>
        <p>Der Vorlesungsinhalt wird zusammengefasst und als PDF formatiert</p>
      </div>
    )
  }

  return (
    <div className="generate-prompt">
      <div className="generate-icon" style={{ background: 'var(--color-success-light)' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3>Lernzettel erstellt</h3>
      <p>
        Dein Lernzettel wurde als PDF erstellt und heruntergeladen.
        Du kannst ihn jederzeit erneut herunterladen.
      </p>
      <button className="btn-generate" onClick={handleDownload}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        PDF erneut herunterladen
      </button>
      <button
        className="btn-nav"
        onClick={onGenerate}
        style={{ marginTop: '8px' }}
      >
        Neu generieren
      </button>
    </div>
  )
}

export default StudyNotes
