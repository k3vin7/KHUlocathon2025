import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton'; // 경로에 맞게 수정

export default function MapContainer() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_KEY_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const mapInstance = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(37.2850, 127.0130),
        zoom: isMobile ? 16 : 17,
      });

      mapRef.current = mapInstance;
      setMap(mapInstance);

      const markerData = [
        { lat: 37.2860, lng: 127.0146, title: '행궁동 중심' },
        { lat: 37.2875, lng: 127.0131, title: '카페 마로' },
        { lat: 37.2850, lng: 127.0160, title: '컴투레스트' },
      ];

      markerData.forEach(({ lat, lng, title }) => {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map: mapInstance,
          icon: {
            url: '/marker.png',
            size: new naver.maps.Size(40, 40),
            scaledSize: new naver.maps.Size(40, 40),
          },
          title,
        });
      });
    };
  }, []);

  return (
    <div className="relative w-screen h-[100dvh]">
      <div id="map" className="w-full h-full" />
      {map && <LocateButton map={map} />}
    </div>
  );
}
