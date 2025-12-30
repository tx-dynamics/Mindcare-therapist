import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  SignIn,
  ForgotPasswordPage,
  CreatePasswordPage,
  OTPPage,
  ProfileCreation,
  Dashboard,
  TrackAttendence,
  Home,
  MyProfile,
  Appointment,
  SessionHistory
} from "./Pages/PagesList";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/OTPPage" element={<OTPPage />} />
        <Route path="/create-password" element={<CreatePasswordPage />} />
        <Route path="/create-profile" element={<ProfileCreation />} />

        {/* Protected Home Layout with nested routes */}
        <Route path="home" element={<Home />} >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
             <Route path="my-profile" element={<MyProfile />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="session-history" element={<SessionHistory />} />
          <Route path="session history" element={<Navigate to="../session-history" replace />} />
          <Route path="track-attendance" element={<TrackAttendence />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
