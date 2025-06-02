import { useEffect } from 'react';

export default function MapContainer() {
  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_KEY_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(37.2850, 127.0130),
        zoom: isMobile ? 16 : 17,
      });

      const markerData = [
        { lat: 37.2860, lng: 127.0146, title: '행궁동 중심' },
        { lat: 37.2875, lng: 127.0131, title: '카페 마로' },
        { lat: 37.2850, lng: 127.0160, title: '컴투레스트' },
      ];

      markerData.forEach(({ lat, lng, title }) => {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map,
          icon: {
            url: '/marker.png',
            size: new naver.maps.Size(40, 40),         // 표시 크기
            scaledSize: new naver.maps.Size(40, 40),   // 실제 이미지 스케일도 맞춤
          },
          title,
        });
      });
    };
  }, []);

  return (
    <div
      id="map"
      className='h-[100dvh] w-screen'
    />
  );
}
