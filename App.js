import React, { Fragment, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Suspensor from './components/Suspensor';
import Topbar from './components/topbar/Topbar';
const Homepage = React.lazy(() =>import('./pages/Homepage'));
const EventoPage = React.lazy(() =>import('./pages/EventoPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MyProfilePage = React.lazy(() => import('./pages/MyProfile'));
const CrearEventoPage = React.lazy(() => import('./pages/CrearEventoPage'));
const EditarEventoPage = React.lazy(() => import('./pages/EditarEventoPage'));
const DesktopFallback = React.lazy(() => import('./pages/DesktopFallback'));
function App() {
  const isMobile = (window.matchMedia('(max-width: 660px)')).matches;

  if (!isMobile) {
      return  <Suspense fallback={<Suspensor />}><DesktopFallback /> </Suspense>
  }
  return (
    <Fragment>
      <Topbar />
      <main>
        <Suspense fallback={<Suspensor />}>
          <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/evento/:eventoId" element={<EventoPage />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/myprofile" element={<MyProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/crear-evento" element={<CrearEventoPage />} />
            <Route path="/edit/:eventoId" element={<EditarEventoPage />} />
          </Routes>
        </Suspense>
      </main>
    </Fragment>
  );
}

export default App;
