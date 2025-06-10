import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton';
import MyPage from './MyPage';
import PlaceDetailPanel from './PlaceDetailPanel';

export default function MapContainer({ showMyPage, setShowMyPage }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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
        const res = await fetch(`${API_URL}/places`);
        const places = await res.json();

        places.forEach((place) => {
          if (!place.coordinates || typeof place.coordinates.lat !== 'number' || typeof place.coordinates.lng !== 'number') {
            console.warn(`Invalid coordinates for place: ${place.name || place._id}`);
            return;
          }

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
            content: `
              <div style="padding:8px;min-width:200px;line-height:1.4;">
                <b>${place.name}</b><br/>
                <span>${place.summary || place.detail || place.description || ''}</span><br/>
                <small style="color:gray;">${place.address ?? ''}</small>
              </div>`
          });

          window.naver.maps.Event.addListener(marker, 'click', async () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(mapInstance, marker);
            setOpenInfoWindow(infoWindow);

            if (selectedPlace && selectedPlace._id === place._id) {
              setSelectedPlace(null);
              setIsExpanded(false);
              return;
            }

            setSelectedPlace(place); // 기본 정보로 먼저 띄움
            setIsExpanded(false);

            try {
              const res = await fetch(`${API_URL}/places/${place._id}`);
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
  }, []);

  useEffect(() => {
    if (!showMyPage) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err);
      }
    };

    fetchUserData();
  }, [showMyPage]);

  return (
    <div className="relative w-screen h-[100dvh]">
      <div id="map" className="w-full h-full" />
      {map && <LocateButton map={map} />}

      {selectedPlace && (
        <PlaceDetailPanel
          place={selectedPlace}
          isExpanded={isExpanded}
          onClose={() => {
            setSelectedPlace(null);
            setIsExpanded(false);
            if (openInfoWindow) openInfoWindow.close();
            setOpenInfoWindow(null);
          }}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          API_URL={API_URL}
        />
      )}

      <MyPage
        userData={userData}
        onClose={() => setShowMyPage(false)}
        visible={showMyPage}
      />
    </div>
  );
}
