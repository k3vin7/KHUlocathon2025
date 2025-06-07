import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton'; // 위치 초기화 버튼

export default function MapContainer() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); // 사이드 패널용
  const [openInfoWindow, setOpenInfoWindow] = useState(null); // InfoWindow 추적용

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
        const res = await fetch('http://localhost:5000/places'); // 전체 장소 목록
        const places = await res.json();

        places.forEach((place) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(
              place.coordinates.lat,
              place.coordinates.lng
            ),
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
              <div style="padding:8px;min-width:150px;">
                <b>${place.name}</b><br/>
                ${place.description ?? ''}<br/>
                <small>${place.address ?? ''}</small>
              </div>
            `,
          });

          window.naver.maps.Event.addListener(marker, 'click', async () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(mapInstance, marker);
            setOpenInfoWindow(infoWindow);

            // 같은 마커를 다시 누르면 토글로 패널 닫기
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
  }, []);

  return (
    <div className="relative w-screen h-[100dvh]">
      <div id="map" className="w-full h-full" />
      {map && <LocateButton map={map} />}
      {selectedPlace && (
        <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-10">
          <h2 className="text-xl font-bold mb-2">{selectedPlace.name}</h2>
          <p className="text-sm text-gray-600">{selectedPlace.address}</p>
          <p className="text-sm mt-2">{selectedPlace.description}</p>
          {selectedPlace.photoUrl && (
            <img
              src={selectedPlace.photoUrl}
              alt={selectedPlace.name}
              className="mt-2 w-full h-auto rounded"
            />
          )}
          <button
            onClick={() => setSelectedPlace(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
