import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MapContainer from './components/MapContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer';
import SMMapUIContainer from './components/SMMapUI/MapUIContainer';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';
import MyPage from './components/MyPage';
import ArchivePage from './components/ArchivePage';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showLoading, setShowLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [userData, setUserData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowMyPage(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowMyPage(false);
    setUserData(null);
  };

  useEffect(() => {
    if (!showMyPage) return;

    fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error('사용자 정보 불러오기 실패:', err);
        handleLogout();
      });
  }, [showMyPage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (showLoading) return <LoadingPage />;

  if (showLogin)
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setShowLogin(false)}
      />
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {isMobile ? (
                <SMMapUIContainer
                  isLoggedIn={isLoggedIn}
                  onLoginClick={() => setShowLogin(true)}
                  onMyPageClick={() => setShowMyPage(true)}
                />
              ) : (
                <PCMapUIContainer
                  isLoggedIn={isLoggedIn}
                  onLoginClick={() => setShowLogin(true)}
                  onMyPageClick={() => setShowMyPage(true)}
                />
              )}

              <MapContainer />

              <MyPage
                visible={showMyPage}
                onClose={() => setShowMyPage(false)}
                onLogout={handleLogout}
                userData={userData}
              />
            </div>
          }
        />

        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </Router>
  );
}

export default App;
