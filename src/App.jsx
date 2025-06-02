import { useEffect, useState } from 'react'
import MapContainer from './components/MapContainer';
import MapUIContainer from './components/PCMapUI/MapUIContainer';
import PCMapUIContainer from './components/PCMapUI/MapUIContainer'
import SMMapUIContainer from './components/SMMapUI/MapUIContainer'

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      {isMobile ? <SMMapUIContainer /> : <PCMapUIContainer />}
      <MapContainer />
    </div>
  );
}

export default App;
