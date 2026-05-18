import { Routes, Route, Navigate } from 'react-router-dom'
import { ComparePage } from './pages/ComparePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/compare" replace />} />
      <Route path="/compare" element={<ComparePage />} />
    </Routes>
  )
}

export default App
