import { useEffect, useState } from 'react';
import MapContainer from './components/MapContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer';
import SMMapUIContainer from './components/SMMapUI/MapUIContainer';
import LoadingPage from './components/LoadingPage';
import LoginPage from './components/LoginPage';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);           // 초기 렌더링 완료
  const [showLoading, setShowLoading] = useState(false); // 로딩화면 보이기
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 여부

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 로그인 성공 → 로딩화면 띄우기 → 메인화면 전환
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setReady(true);
    }, 2000); // 로딩 페이지 2초 후 메인화면으로
  };

  if (!isLoggedIn) return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  if (showLoading || !ready) return <LoadingPage />;

  return (
    <div>
      {isMobile ? <SMMapUIContainer /> : <PCMapUIContainer />}
      <MapContainer />
    </div>
  );
}

export default App;
