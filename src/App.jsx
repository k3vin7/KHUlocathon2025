import { useEffect, useState } from 'react';
import MapContainer from './components/MapContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer';
import SMMapUIContainer from './components/SMMapUI/MapUIContainer';
import LoadingPage from './components/LoadingPage';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false); // 마운트 완료
  const [showLoading, setShowLoading] = useState(true); // 로딩 화면 보임 여부

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 렌더링 완료를 의미하는 ready 플래그 설정
    setReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ready가 true가 되면 1초 후 로딩 종료
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  if (showLoading) return <LoadingPage />;

  return (
    <div>
      {isMobile ? <SMMapUIContainer /> : <PCMapUIContainer />}
      <MapContainer />
    </div>
  );
}

export default App;
