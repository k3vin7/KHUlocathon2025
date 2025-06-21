import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton';
import MyPage from './MyPage';
import PlaceDetailPanel from './PlaceDetailPanel';
import CurrentPosition from './CurrentPosition';
import MapUIContainer from './SMMapUI/MapUIContainer';
import TopBar from './SMMapUI/TopBar';

export default function MapContainer({ showMyPage, setShowMyPage, userData, onLogout }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const walkCircleRef = useRef(null);
  const walkMarkersRef = useRef([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [category, setCategory] = useState('전체');
  const markersRef = useRef([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  let currentZIndex = 100;
  const API_URL = import.meta.env.VITE_API_URL;

  const matchesCategory = (place, selected) => {
    const cat = place.category || '';
    if (selected === '전체') return true;
    if (selected === '음식점') return cat.includes('식당');
    if (selected === '카페') return cat.includes('카페');
    if (selected === '상점') return cat.includes('상점');
    if (selected === '동물병원') return cat.includes('동물병원');
    if (selected === '산책코스') return cat.includes('산책코스');
    if (selected === '주점') return cat.includes('펍') || cat.includes('술집');
    return false;
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (walkCircleRef.current) {
      walkCircleRef.current.setMap(null);
      walkCircleRef.current = null;
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth <= 1500;
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

      try {
        const res = await fetch(`${API_URL}/places`);
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error('장소 목록 오류:', err);
      }
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach(({ marker, overlay }) => {
      marker.setMap(null);
      overlay.setMap(null);
    });
    markersRef.current = [];

    const filtered = places.filter((p) => matchesCategory(p, category));

    filtered.forEach((place) => {
      if (!place.coordinates || place.category === '산책코스') return;

      const latLng = new window.naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng);

      const marker = new window.naver.maps.Marker({
        position: latLng,
        map,
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

      const overlay = new CustomOverlay(latLng, overlayContent);
      markersRef.current.push({ marker, overlay });

      const showPlaceDetail = async () => {
        if (walkCircleRef.current) {
          walkCircleRef.current.setMap(null);
          walkCircleRef.current = null;
        }

        markersRef.current.forEach(({ overlay }) => {
          overlay._element.style.zIndex = '100';
        });

        const offsetLat = place.coordinates.lat - 0.00035;
        const targetLatLng = new naver.maps.LatLng(offsetLat, place.coordinates.lng);
        map.morph(targetLatLng, 19, true);
        overlay._element.style.zIndex = '9999';

        try {
          const res = await fetch(`${API_URL}/places/${place._id}`);
          const detailedPlace = await res.json();
          setSelectedPlace(detailedPlace);
        } catch (err) {
          console.error('장소 상세 정보 오류:', err);
        }

        setIsExpanded(true);
      };

      marker.addListener('click', showPlaceDetail);
      overlayContent.addEventListener('click', showPlaceDetail);
    });

    map.addListener('zoom_changed', () => {
      const zoom = map.getZoom();
      markersRef.current.forEach(({ marker, overlay }) => {
        if (zoom >= 19) {
          marker.setMap(null);
          overlay.setMap(map);
        } else {
          overlay.setMap(null);
          marker.setMap(map);
        }
      });
    });
  }, [map, places, category]);

  useEffect(() => {
    if (!map) return;

    walkMarkersRef.current.forEach((marker) => marker.setMap(null));
    walkMarkersRef.current = [];

    const walkPlaces = places.filter((p) => p.category === '산책코스' && p.coordinates);
    if (category !== '전체' && category !== '산책코스') return;

    walkPlaces.forEach((place) => {
      const latLng = new window.naver.maps.LatLng(place.coordinates.lat, place.coordinates.lng);

      const marker = new window.naver.maps.Marker({
        position: latLng,
        map,
        icon: {
          url: '/marker.png',
          size: new naver.maps.Size(40, 40),
          scaledSize: new naver.maps.Size(40, 40),
        },
        title: place.name,
      });

      walkMarkersRef.current.push(marker);

      marker.addListener('click', () => {
        if (walkCircleRef.current) {
          walkCircleRef.current.setMap(null);
          walkCircleRef.current = null;
        }

        map.morph(latLng, 18, true);

        const idleListener = window.naver.maps.Event.addListener(map, 'idle', () => {
          const circle = new window.naver.maps.Circle({
            map,
            center: latLng,
            radius: Number(place.radius) || 300,
            strokeColor: '#FF6600',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#FFB266',
            fillOpacity: 0.3,
            clickable: false,
            zIndex: 1,
          });

          walkCircleRef.current = circle;

          setTimeout(() => {
            setSelectedPlace(place);
            setIsExpanded(true);
          }, 50);

          window.naver.maps.Event.removeListener(idleListener);
        });
      });
    });
  }, [map, places, category]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-y-hidden">
      <TopBar title="댕궁지도" />
      <div id="map" className="w-full h-full absolute" />

      <MapUIContainer
        isLoggedIn={!!userData}
        onLoginClick={() => setShowMyPage(true)}
        category={category}
        setCategory={handleCategoryChange}
      />

      {map && <CurrentPosition map={map} setCurrentPosition={setCurrentPosition} />}
      {map && <LocateButton map={map} currentPosition={currentPosition} />}

      {selectedPlace && (
        <PlaceDetailPanel
          place={selectedPlace}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onClose={() => {
            setIsExpanded(false);
            setSelectedPlace(null);
          }}
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
