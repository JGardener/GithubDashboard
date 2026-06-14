import { Routes, Route, Navigate } from 'react-router-dom'
import { ComparePage } from './pages/ComparePage'
import { UserPage } from './pages/UserPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/compare" replace />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/user/:username" element={<UserPage />} />
    </Routes>
  )
}

export default App
