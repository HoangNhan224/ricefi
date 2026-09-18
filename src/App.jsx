import { Navigate, Route, Routes } from 'react-router-dom'
import { getRole, homeForRole, isAuthed } from './lib/auth.js'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import AddFarm from './pages/AddFarm.jsx'
import Verification from './pages/Verification.jsx'
import CarbonResult from './pages/CarbonResult.jsx'
import Marketplace from './pages/Marketplace.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'

// Route bảo vệ: chưa login → về /login
function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />
}

// Trang gốc "/" → theo role hoặc về login
function Root() {
  return <Navigate to={isAuthed() ? homeForRole(getRole()) : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Root />} />

      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer/farms/new" element={<AddFarm />} />
        <Route path="/farmer/verify/:farmId" element={<Verification />} />
        <Route path="/farmer/carbon/:farmId" element={<CarbonResult />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

