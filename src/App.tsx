import { Routes, Route, Navigate } from 'react-router-dom'
import { ComparePage } from './pages/ComparePage'
import { WelcomeModal } from './components/WelcomeModal'

function App() {
  return (
    <>
      <WelcomeModal />
      <Routes>
        <Route path="/" element={<Navigate to="/compare" replace />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </>
  )
}

export default App
