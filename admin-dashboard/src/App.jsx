import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';

import LoginPage from './pages/login';
import HomePage from './pages/index';
import OrdersPage from './pages/orders';
import UsersPage from './pages/users';
import StatisticsPage from './pages/statistics';

const ADMIN_UID = 'ISI_UID_ADMIN_KAMU'; // Atur berdasarkan Firebase Console

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) return <p>Memeriksa login...</p>;

  if (!user) return <LoginPage />;
  if (user.uid !== ADMIN_UID) return <p>Akses ditolak: Bukan Admin</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
