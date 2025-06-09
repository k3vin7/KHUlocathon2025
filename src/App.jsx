import { useEffect, useState } from 'react';
import MapContainer from './components/MapContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer';
import SMMapUIContainer from './components/SMMapUI/MapUIContainer';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showLoading, setShowLoading] = useState(false);

  // 로그인 이후 2초간 로딩화면을 보여주는 트리거
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoading(true); // ✅ 먼저 true 설정해서 LoadingPage 렌더링 유도
  };

  // ✅ showLoading이 true로 바뀐 후 2초 뒤에 false로 바꾸는 타이머
  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoading]);

  // 디바이스 판단
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  if (showLoading) return <LoadingPage />;

  return (
    <div>
      {isMobile ? <SMMapUIContainer /> : <PCMapUIContainer />}
      <MapContainer />
    </div>
  );
}

export default App;
