```mermaid
classDiagram
  class App {
    +courses Course[]
    +currentCourse Course
    +handleUpload()
    +handleGenerateNotes()
  }
  class Library {
    +documents Doc[]
    +filter string
  }
  App --> Library
  App --> Lecture
  App --> CourseSelect
```
