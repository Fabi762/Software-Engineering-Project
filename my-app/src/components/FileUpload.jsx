import { useState, useRef } from 'react'

const SUPPORTED_FORMATS = ['PDF', 'PPTX', 'DOCX', 'XLSX', 'HTML', 'Markdown', 'Bilder']

function FileUpload({ onUpload, isUploading }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
      e.target.value = ''
    }
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="upload-input"
          onChange={handleFileSelect}
          accept=".pdf,.docx,.pptx,.xlsx,.html,.htm,.md,.adoc,.png,.jpg,.jpeg,.tiff,.bmp"
        />

        {isUploading ? (
          <div className="upload-processing">
            <div className="loading-spinner large" />
            <h3>Vorlesungsfolien werden analysiert...</h3>
            <p>Die KI extrahiert den Inhalt. Dies kann einen Moment dauern.</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="upload-title">Vorlesungsfolien hierher ziehen</h3>
            <p className="upload-subtitle">
              oder <span className="upload-link">Datei auswaehlen</span>
            </p>
            <p className="upload-description">
              Die KI erstellt automatisch Karteikarten und Lernzettel aus deinen Unterlagen
            </p>
            <div className="upload-formats">
              {SUPPORTED_FORMATS.map((format) => (
                <span key={format} className="format-badge">
                  {format}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
