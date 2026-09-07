import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing.jsx'
import Terms from './pages/terms.jsx'
import Policy from './pages/policy.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/policy" element={<Policy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

