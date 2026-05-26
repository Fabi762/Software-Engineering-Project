import { I } from './icons'

function Masthead({ view, theme, currentCourse, onGoLibrary, onGoUpload, onGoToCourses, onToggleTheme }) {
  const inCourse = view === 'library' || view === 'lecture' || view === 'upload'

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="masthead-left">
          <a className="brand" onClick={inCourse ? onGoToCourses : undefined} style={{ cursor: inCourse ? 'pointer' : 'default' }}>
            <span className="brand-mark">S</span>
            <span className="brand-name">CoolSchoolTool</span>
          </a>

          {inCourse && currentCourse && (
            <>
              <span className="masthead-sep">/</span>
              <button className="masthead-course-chip" onClick={onGoLibrary}>
                <span
                  className="masthead-course-dot"
                  style={{ background: currentCourse.color }}
                />
                {currentCourse.name}
              </button>

              <nav className="masthead-nav">
                <button
                  className={view === 'library' || view === 'lecture' ? 'active' : ''}
                  onClick={onGoLibrary}
                >
                  Bibliothek
                </button>
                <button
                  className={view === 'upload' ? 'active' : ''}
                  onClick={onGoUpload}
                >
                  Hochladen
                </button>
              </nav>
            </>
          )}
        </div>

        <div className="masthead-right">
          <button
            className="icon-btn"
            title={theme === 'dark' ? 'Heller Modus' : 'Dunkler Modus'}
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? <I.Sun size={16} /> : <I.Moon size={16} />}
          </button>
          {inCourse && (
            <button className="btn btn-ghost btn-sm" onClick={onGoUpload}>
              <I.Plus size={13} stroke={2} /> Neu
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Masthead
