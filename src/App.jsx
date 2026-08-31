import { Routes, Route, useLocation } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { SmartwatchProvider } from './context/SmartwatchContext'
import LandingPage from './pages/LandingPage'
import PaymentPage from './pages/PaymentPage'
import SetupPage from './pages/caregiver/SetupPage'
import CaregiverDashboard from './pages/caregiver/CaregiverDashboard'
import PatientDashboard from './pages/patient/PatientDashboard'
import GameDashboard from './pages/patient/GameDashboard'
import MemoryAlbum from './pages/patient/games/MemoryAlbum'
import MemoryTray from './pages/patient/games/MemoryTray'
import FamilyFaceMatch from './pages/patient/games/FamilyFaceMatch'
import RoutineSequencer from './pages/patient/games/RoutineSequencer'
import WhatChanged from './pages/patient/games/WhatChanged'
import LocalCultureMatch from './pages/patient/games/LocalCultureMatch'

function AppRoutes() {
  const location = useLocation()
  return (
    <LanguageProvider location={location.pathname}>
    <DataProvider>
    <SmartwatchProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/caregiver" element={<CaregiverDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/games" element={<GameDashboard />} />
        <Route path="/games/1" element={<MemoryAlbum />} />
        <Route path="/games/2" element={<MemoryTray />} />
        <Route path="/games/3" element={<FamilyFaceMatch />} />
        <Route path="/games/4" element={<RoutineSequencer />} />
        <Route path="/games/5" element={<WhatChanged />} />
        <Route path="/games/6" element={<LocalCultureMatch />} />
      </Routes>
    </SmartwatchProvider>
    </DataProvider>
    </LanguageProvider>
  )
}

export default function App() {
  return <AppRoutes />
}
