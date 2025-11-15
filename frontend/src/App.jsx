import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import HousingInput from './pages/HousingInput'
import MapView from './pages/MapView'
import LandingPage from './pages/LandingPage'
import Portfolio from './pages/Portfolio'

function App() {
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    const quiz = localStorage.getItem('quizCompleted')
    setQuizCompleted(!!quiz)
  }, [])

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizCompleted')
    setQuizCompleted(false)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/quiz"
            element={<Quiz setQuizCompleted={setQuizCompleted} />}
          />
          <Route
            path="/housing"
            element={
              !quizCompleted ?
                <Navigate to="/quiz" /> :
                <HousingInput />
            }
          />
          <Route
            path="/map"
            element={<MapView />}
          />
          <Route
            path="/portfolio"
            element={
              !quizCompleted ?
                <Navigate to="/quiz" /> :
                <Portfolio onRetakeQuiz={handleRetakeQuiz} />
            }
          />
          <Route
            path="/"
            element={
              <LandingPage
                quizCompleted={quizCompleted}
                onRetakeQuiz={handleRetakeQuiz}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
