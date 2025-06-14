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

      // ✅ CustomOverlay 클래스 정의
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

      // ✅ 장소 목록 불러오기
      let places = [];
      try {
        const res = await fetch(`${API_URL}/places`);
        places = await res.json();
      } catch (err) {
        console.error('장소 목록 오류:', err);
      }

                                                                                                        // ✅ 개발용 기본 마커 추가
      {/*const defaultPlace = {
        _id: 'default-static-place',
        name: '기본 테스트 장소',
        summary: '이 마커는 항상 존재합니다.',
        detail: '애견 동반 가능. 음식 없음.',
        description: '이곳은 개발용으로 생성된 기본 장소입니다.이곳은 개발용으로 생성된 기본 장소입니다.',
        category: '기타',
        address: '경기도 용인시 어디쯤',
        hours: '00:00~24:00;항상 열려 있음',
        photos: ['/default.jpg'],
        naverUrl: 'https://map.naver.com/',
        instagram: 'https://instagram.com/',
        coordinates: { lat: 37.2855, lng: 127.0130 },
      };
      places.unshift(defaultPlace);
      */}

      // ✅ 마커 및 오버레이 생성
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
            <div class="bg-[#2B1D18B2] text-white rounded-xl px-[20px] py-[12px] text-sm leading-relaxed shadow-md">
              <div class="font-bold text-base">${place.name}</div>
              <div>${place.summary || place.detail || '정보 없음'}</div>
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-8 border-r-8 border-t-[10px] 
                        border-l-transparent border-r-transparent border-t-[#2B1D18B2]"></div>
          </div>
        `;

        const overlay = new CustomOverlay(latLng, overlayContent);
        markersRef.current.push({ marker, overlay });

        const showPlaceDetail = async () => {
          if (mapRef.current) {
            const map = mapRef.current;
            const original = place.coordinates;

            const offsetLat = original.lat -0.0003;
            const targetLatLng = new naver.maps.LatLng(offsetLat, original.lng);

            const targetZoom = 19;
            map.morph(targetLatLng, targetZoom, true);
          }

          setSelectedPlace(place);
          setIsExpanded(true);

                                                                                                          // 개발용 기본 마커는 fetch 생략
          // if (place._id === 'default-static-place') return;

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

      // ✅ 줌 이벤트에 따른 마커/오버레이 전환
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
    };
  }, []);

  return (
    <div className="relative w-screen h-[100dvh] overflow-y-hidden">
      <div id="map" className="w-full h-full" />

      {map && <CurrentPosition map={map} />}
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
