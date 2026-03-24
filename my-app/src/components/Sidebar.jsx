function Sidebar({ documents, selectedDoc, onSelect, onDelete, onNewUpload, isUploading }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Gerade eben'
    if (diffMins < 60) return `Vor ${diffMins} Min.`
    if (diffHours < 24) return `Vor ${diffHours} Std.`

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Vorlesungen</h2>
        {documents.length > 0 && <span className="badge">{documents.length}</span>}
      </div>

      <button className="new-upload-btn" onClick={onNewUpload}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Neue Vorlesung
      </button>

      <div className="document-list">
        {isUploading && (
          <div className="document-item loading-item">
            <div className="loading-spinner" />
            <div className="document-info">
              <span className="document-name">Wird verarbeitet...</span>
              <span className="document-date">Bitte warten</span>
            </div>
          </div>
        )}

        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className={`document-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
            onClick={() => onSelect(doc)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="document-type-badge">{getFileExtension(doc.filename)}</div>
            <div className="document-info">
              <span className="document-name" title={doc.filename}>
                {doc.filename}
              </span>
              <span className="document-date">{formatDate(doc.uploaded_at)}</span>
            </div>
            <button
              className="document-delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(doc.id)
              }}
              title="Entfernen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        {documents.length === 0 && !isUploading && (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <p>Noch keine Vorlesungen</p>
            <span>Lade deine Folien hoch</span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
