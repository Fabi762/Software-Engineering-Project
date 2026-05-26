import { useState } from 'react'
import { I } from './icons'

const SEMESTERS = [
  'Wintersemester 2024/25',
  'Sommersemester 2025',
  'Wintersemester 2025/26',
  'Sommersemester 2026',
  'Wintersemester 2026/27',
]

function CourseCard({ course, onSelect, onDelete }) {
  return (
    <article className="course-card" onClick={() => onSelect(course)}>
      <div className="course-card-color" style={{ background: course.color }} />
      <div className="course-card-body">
        <div className="course-card-semester">{course.semester}</div>
        <h3 className="course-card-name">{course.name}</h3>
        <div className="course-card-meta">
          {course.docCount ?? 0} Vorlesung{course.docCount !== 1 ? 'en' : ''}
        </div>
      </div>
      <button
        className="course-card-delete"
        title="Kurs löschen"
        onClick={e => { e.stopPropagation(); onDelete(course.id) }}
      >
        <I.Trash size={13} />
      </button>
    </article>
  )
}

const COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
]

function CourseSelect({ courses, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(false)
  const [name, setName]         = useState('')
  const [semester, setSemester] = useState(SEMESTERS[3])
  const [color, setColor]       = useState(COLORS[0])

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate({ name: name.trim(), semester, color })
    setName('')
    setSemester(SEMESTERS[3])
    setColor(COLORS[0])
    setCreating(false)
  }

  return (
    <div className="course-select fade-in">
      <header className="course-select-head">
        <h1 className="course-select-title">Meine Kurse</h1>
        <p className="course-select-sub">Wähle einen Kurs oder erstelle einen neuen.</p>
      </header>

      <div className="course-grid">
        {courses.map(c => (
          <CourseCard
            key={c.id}
            course={c}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}

        {creating ? (
          <div className="course-card course-card--form">
            <div className="course-form-colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`color-dot ${color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <input
              className="course-form-input"
              placeholder="Kursname (z.B. Mathematik 1)"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <select
              className="course-form-select"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            >
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="course-form-actions">
              <button className="btn btn-accent btn-sm" onClick={handleCreate} disabled={!name.trim()}>
                Erstellen
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setCreating(false); setName('') }}>
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button className="course-card course-card--new" onClick={() => setCreating(true)}>
            <I.Plus size={28} stroke={1.5} />
            <span>Neuen Kurs erstellen</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseSelect
