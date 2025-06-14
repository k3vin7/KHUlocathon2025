import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton';
import MyPage from './MyPage';
import PlaceDetailPanel from './PlaceDetailPanel';
import CurrentPosition from './CurrentPosition';

export default function MapContainer({ showMyPage, setShowMyPage, userData, onLogout }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const markersRef = useRef([]);
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
        zoom: isMobile ? 16 : 18,
      });

      mapRef.current = mapInstance;
      setMap(mapInstance);

      window.naver.maps.Event.addListener(mapInstance, 'click', () => {
        setIsExpanded(false);
      });

      // ✅ CustomOverlay 정의
      class CustomOverlay extends window.naver.maps.OverlayView {
        constructor(position, content) {
          super();
          this.position = position;
          this._element = content;
        }
        onAdd() {
          const pane = this.getPanes().overlayLayer;
          pane.appendChild(this._element);
        }
        draw() {
          const projection = this.getProjection();
          const point = projection.fromCoordToOffset(this.position);
          if (!point) return;
          this._element.style.position = 'absolute';
          this._element.style.left = `${point.x - this._element.offsetWidth / 2}px`;
          this._element.style.top = `${point.y - this._element.offsetHeight}px`;
        }
        onRemove() {
          if (this._element?.parentNode) {
            this._element.parentNode.removeChild(this._element);
          }
        }
      }

      // ✅ 장소 마커 불러오기
      try {
        const res = await fetch(`${API_URL}/places`);
        const places = await res.json();

        places.forEach((place) => {
          if (!place.coordinates) return;

          const latLng = new window.naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng);

          const marker = new window.naver.maps.Marker({
            position: latLng,
            map: mapInstance,
            icon: {
              url: '/marker.png',
              size: new naver.maps.Size(40, 40),
              scaledSize: new naver.maps.Size(40, 40),
            },
            title: place.name,
          });

          const overlayContent = document.createElement('div');
          overlayContent.innerHTML = `
            <div class="relative w-max max-w-[200px]">
              <div class="bg-[#2B1D18B2] text-white rounded-xl px-4 py-2 text-sm leading-relaxed shadow-md">
                <div class="font-bold text-base">${place.name}</div>
                <div>${place.summary || place.detail || '정보 없음'}</div>
                <div class="text-xs text-gray-300">${place.address || ''}</div>
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 
                          border-l-8 border-r-8 border-t-[10px] 
                          border-l-transparent border-r-transparent border-t-[#2B1D18B2]"></div>
            </div>
          `;
          const overlay = new CustomOverlay(latLng, overlayContent);
          markersRef.current.push({ marker, overlay });

          const showPlaceDetail = async () => {
            setSelectedPlace(place);
            setIsExpanded(true);
            try {
              const res = await fetch(`${API_URL}/places/${place._id}`);
              const detailedPlace = await res.json();
              setSelectedPlace(detailedPlace);
            } catch (err) {
              console.error('장소 상세 정보 오류:', err);
            }
          };

          window.naver.maps.Event.addListener(marker, 'click', showPlaceDetail);
          overlayContent.addEventListener('click', showPlaceDetail);
        });

        // 줌 이벤트에 따른 마커/오버레이 전환
        window.naver.maps.Event.addListener(mapInstance, 'zoom_changed', () => {
          const zoom = mapInstance.getZoom();
          markersRef.current.forEach(({ marker, overlay }) => {
            if (zoom >= 19) {
              marker.setMap(null);
              overlay.setMap(mapInstance);
            } else {
              overlay.setMap(null);
              marker.setMap(mapInstance);
            }
          });
        });
      } catch (err) {
        console.error('장소 목록 오류:', err);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-[100dvh]">
      <div id="map" className="w-full h-full" />

      {/* ✅ 현재 위치 마커 표시 */}
      {map && <CurrentPosition map={map} />}

      {/* ✅ 현위치 버튼 */}
      {map && <LocateButton map={map} />}

      {selectedPlace && (
        <PlaceDetailPanel
          place={selectedPlace}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          API_URL={API_URL}
        />
      )}

      <MyPage
        userData={userData}
        onClose={() => setShowMyPage(false)}
        onLogout={onLogout}
        visible={showMyPage}
      />
    </div>
  );
}
