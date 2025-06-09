import { useEffect, useState } from 'react';
import MapContainer from './components/MapContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer';
import SMMapUIContainer from './components/SMMapUI/MapUIContainer';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';
import MyPage from './components/MyPage';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showLoading, setShowLoading] = useState(true); // 🔥 앱 시작 시 true
  const [showLogin, setShowLogin] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [userData, setUserData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ 앱 시작 시 로딩 2초 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 로그인 성공 시 처리
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowMyPage(false);
  };

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowMyPage(false);
    setUserData(null);
  };

  // ✅ 마이페이지 열릴 때 사용자 정보 fetch
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

  // ✅ 반응형 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ 로딩 화면만 표시 (앱 전체 차단)
  if (showLoading) return <LoadingPage />;

  // ✅ 로그인 창
  if (showLogin)
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setShowLogin(false)}
      />
    );

  // ✅ 본 앱 UI
  return (
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
  );
}

export default App;
