import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ConsultPage from '@/pages/ConsultPage';
import AppointmentPage from '@/pages/AppointmentPage';
import ReportsPage from '@/pages/ReportsPage';
import MyDoctorsPage from '@/pages/MyDoctorsPage';
import FAQPage from '@/pages/FAQPage';
import EmergencyPage from '@/pages/EmergencyPage';
import AIPage from '@/pages/AIPage';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/consult" replace />} />
        <Route path="/consult" element={<ConsultPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/doctors" element={<MyDoctorsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="*" element={<Navigate to="/consult" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
