import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton';
import LoginPage from './LoginPage';

export default function MapContainer() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [lastClickedMarkerId, setLastClickedMarkerId] = useState(null);
  const [showMyPage, setShowMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (showLogin) return;

    const isMobile = window.innerWidth <= 640;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_KEY_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = async () => {
      const mapInstance = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(37.2850, 127.0130),
        zoom: isMobile ? 16 : 17,
      });

      mapRef.current = mapInstance;
      setMap(mapInstance);

      try {
        const res = await fetch('http://localhost:5000/places');
        const places = await res.json();

        places.forEach((place) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng),
            map: mapInstance,
            icon: {
              url: '/marker.png',
              size: new naver.maps.Size(40, 40),
              scaledSize: new naver.maps.Size(40, 40),
            },
            title: place.name,
          });

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `<div style="padding:8px;min-width:150px;"><b>${place.name}</b><br/>${place.description ?? ''}<br/><small>${place.address ?? ''}</small></div>`
          });

          window.naver.maps.Event.addListener(marker, 'click', async () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(mapInstance, marker);
            setOpenInfoWindow(infoWindow);

            if (selectedPlace && selectedPlace._id === place._id) {
              setSelectedPlace(null);
              return;
            }

            try {
              const res = await fetch(`http://localhost:5000/places/${place._id}`);
              const detailedPlace = await res.json();
              setSelectedPlace(detailedPlace);
            } catch (err) {
              console.error('장소 상세 정보를 불러오는 중 오류:', err);
            }
          });
        });
      } catch (err) {
        console.error('장소 목록을 불러오는 중 오류:', err);
      }
    };
  }, [showLogin]);

  const handleMyPageClick = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setUserData(data);
      setShowMyPage(true);
    } catch (err) {
      console.error('사용자 정보 불러오기 실패:', err);
    }
  };

  if (showLogin) {
    return <LoginPage onLoginSuccess={() => setShowLogin(false)} />;
  }

  return (
    <div className="relative w-screen h-[100dvh]">
      <div id="map" className="w-full h-full" />
      {map && <LocateButton map={map} />}

      <button
        onClick={handleMyPageClick}
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow z-30"
      >
        🧑
      </button>

      {selectedPlace && (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 z-20 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
              <p className="text-xs text-gray-400 mt-1">카테고리/분류</p>
            </div>
            <button
              onClick={() => {
                setSelectedPlace(null);
                if (openInfoWindow) openInfoWindow.close();
                setOpenInfoWindow(null);
              }}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          <p className="mt-3 text-sm">{selectedPlace.description}</p>

          <div className="text-xs text-gray-500 mt-4">
            <p className="mb-1"><b>영업시간</b>: 10:00 - 21:00</p>
            <p className="mb-1">테라스 동반 가능</p>
            <p className="mb-1">견종 크기 제한 없음</p>
          </div>

          {selectedPlace.photoUrl && (
            <img
              src={selectedPlace.photoUrl}
              alt="대표 이미지"
              className="w-full h-48 object-cover rounded-md mt-4"
            />
          )}
        </div>
      )}

      {showMyPage && userData && (
        <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-30 transition-all">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">마이페이지</h2>
            <button
              onClick={() => setShowMyPage(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="mt-4">👤 <b>{userData.nickname}</b></p>
          <p className="text-sm text-gray-500">{userData.email}</p>
          <p className="mt-2 text-sm">🎖️ 칭호: {userData.title}</p>
          <p className="mt-2 text-sm">🕓 가입일: {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
