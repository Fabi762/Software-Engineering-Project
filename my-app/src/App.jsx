import { useState, useEffect } from 'react'
import './App.css'
import Masthead      from './components/Masthead'
import CourseSelect  from './components/CourseSelect'
import Library       from './components/Library'
import Lecture       from './components/Lecture'
import Upload        from './components/Upload'
import Toast         from './components/Toast'

const COURSES_KEY = 'sb-courses'

function loadCourses() {
  try { return JSON.parse(localStorage.getItem(COURSES_KEY)) || [] }
  catch { return [] }
}

function saveCourses(courses) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
}

function App() {
  const [courses,        setCourses]        = useState(loadCourses)
  const [currentCourse,  setCurrentCourse]  = useState(null)
  const [documents,      setDocuments]      = useState([])
  const [view,           setView]           = useState({ name: 'courses', lecture: null })

  const [isUploading,            setIsUploading]            = useState(false)
  const [isGeneratingNotes,      setIsGeneratingNotes]      = useState(false)
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false)
  const [isGeneratingQuiz,       setIsGeneratingQuiz]       = useState(false)
  const [toast,                  setToast]                  = useState(null)
  const [theme,                  setTheme]                  = useState(
    () => localStorage.getItem('sb-theme') || 'paper'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '')
    localStorage.setItem('sb-theme', theme)
  }, [theme])

  const showToast = (text, kind = 'success') => {
    setToast({ text, kind })
    setTimeout(() => setToast(null), 2800)
  }

  const updateDocument = (updatedDoc) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d))
    if (view.lecture?.id === updatedDoc.id) {
      setView(v => ({ ...v, lecture: updatedDoc }))
    }
  }

  // ── Course actions ───────────────────────────────────────────
  const handleSelectCourse = (course) => {
    setCurrentCourse(course)
    setDocuments([])
    setView({ name: 'library', lecture: null })
  }

  const handleCreateCourse = ({ name, semester, color }) => {
    const newCourse = { id: crypto.randomUUID(), name, semester, color, docCount: 0 }
    const updated = [newCourse, ...courses]
    setCourses(updated)
    saveCourses(updated)
    handleSelectCourse(newCourse)
  }

  const handleDeleteCourse = (courseId) => {
    const updated = courses.filter(c => c.id !== courseId)
    setCourses(updated)
    saveCourses(updated)
  }

  const updateCourseDocCount = (courseId, delta) => {
    setCourses(prev => {
      const updated = prev.map(c =>
        c.id === courseId ? { ...c, docCount: Math.max(0, (c.docCount ?? 0) + delta) } : c
      )
      saveCourses(updated)
      return updated
    })
  }

  // ── Navigation ──────────────────────────────────────────────
  const goToCourses = () => { setCurrentCourse(null); setView({ name: 'courses', lecture: null }) }
  const goLibrary   = () => setView({ name: 'library', lecture: null })
  const goUpload    = () => setView({ name: 'upload',  lecture: null })
  const openLecture = (doc) => setView({ name: 'lecture', lecture: doc })

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'paper' : 'dark')

  // ── Docs for current course ──────────────────────────────────
  const courseDocs = currentCourse
    ? documents.filter(d => d.courseId === currentCourse.id)
    : []

  // ── API handlers ────────────────────────────────────────────
  const handleUpload = async (file) => {
    if (!currentCourse) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Upload fehlgeschlagen')
      }
      const doc = await res.json()
      const tagged = { ...doc, courseId: currentCourse.id }
      setDocuments(prev => [tagged, ...prev])
      updateCourseDocCount(currentCourse.id, 1)
      goLibrary()
      showToast(`"${doc.filename}" erfolgreich verarbeitet`)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      setDocuments(prev => prev.filter(d => d.id !== id))
      if (currentCourse) updateCourseDocCount(currentCourse.id, -1)
      goLibrary()
      showToast('Dokument entfernt')
    } catch {
      showToast('Fehler beim Entfernen', 'error')
    }
  }

  const handleGenerateNotes = async () => {
    const doc = view.lecture
    if (!doc) return
    setIsGeneratingNotes(true)
    try {
      const res = await fetch(`/api/generate/notes/${doc.id}`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Generierung fehlgeschlagen')
      }
      const pdfRes = await fetch(`/api/documents/${doc.id}/notes-pdf`)
      const blob   = await pdfRes.blob()
      const disposition = pdfRes.headers.get('content-disposition') || ''
      const match = disposition.match(/filename="?([^";]+)"?/i)
      const downloadName = match?.[1] || `Lernzettel_${doc.filename.replace(/\.[^.]+$/, '')}.pdf`
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href    = url
      a.download = downloadName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      updateDocument({ ...doc, notesPdf: true })
      showToast('Lernzettel als PDF heruntergeladen!')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsGeneratingNotes(false)
    }
  }

  const handleGenerateFlashcards = async (count = 10) => {
    const doc = view.lecture
    if (!doc) return
    setIsGeneratingFlashcards(true)
    try {
      const res = await fetch(`/api/generate/flashcards/${doc.id}?count=${count}`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Karteikarten-Generierung fehlgeschlagen')
      }
      const data = await res.json()
      updateDocument({ ...doc, flashcards: data.flashcards })
      showToast('Karteikarten erfolgreich erstellt!')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsGeneratingFlashcards(false)
    }
  }

  const handleGenerateQuiz = async () => {
    const doc = view.lecture
    if (!doc) return
    setIsGeneratingQuiz(true)
    try {
      const res = await fetch(`/api/generate/quiz/${doc.id}`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Quiz-Generierung fehlgeschlagen')
      }
      const data = await res.json()
      updateDocument({ ...doc, quiz: data.questions })
      showToast('Quiz erfolgreich erstellt!')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  return (
    <div className="app">
      <Masthead
        view={view.name}
        theme={theme}
        currentCourse={currentCourse}
        onGoLibrary={goLibrary}
        onGoUpload={goUpload}
        onGoToCourses={goToCourses}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        {view.name === 'courses' && (
          <CourseSelect
            courses={courses}
            onSelect={handleSelectCourse}
            onCreate={handleCreateCourse}
            onDelete={handleDeleteCourse}
          />
        )}
        {view.name === 'library' && (
          <Library
            documents={courseDocs}
            course={currentCourse}
            onOpen={openLecture}
            onUpload={goUpload}
          />
        )}
        {view.name === 'lecture' && (
          <Lecture
            doc={view.lecture}
            onBack={goLibrary}
            onDelete={() => handleDelete(view.lecture.id)}
            onGenerateNotes={handleGenerateNotes}
            isGeneratingNotes={isGeneratingNotes}
            onGenerateFlashcards={handleGenerateFlashcards}
            isGeneratingFlashcards={isGeneratingFlashcards}
            onGenerateQuiz={handleGenerateQuiz}
            isGeneratingQuiz={isGeneratingQuiz}
          />
        )}
        {view.name === 'upload' && (
          <Upload
            onUpload={handleUpload}
            onCancel={goLibrary}
            isUploading={isUploading}
          />
        )}
      </main>

      {toast && <Toast text={toast.text} kind={toast.kind} />}
    </div>
  )
}

export default App
