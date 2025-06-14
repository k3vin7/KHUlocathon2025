import { useEffect, useState } from 'react';

export default function CurrentPosition({ map }) {
  const [position, setPosition] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPos = new window.naver.maps.LatLng(lat, lng);
        setPosition(newPos);

        if (map) {
          if (!marker) {
            const newMarker = new window.naver.maps.Marker({
              position: newPos,
              map,
              icon: {
                url: '/me.png',
                size: new window.naver.maps.Size(30, 30),
                scaledSize: new window.naver.maps.Size(30, 30),
              },
            });
            setMarker(newMarker);
          } else {
            marker.setPosition(newPos);
          }
        }
      },
      (err) => {
        console.error('위치 추적 실패:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, marker]);

  return null; // UI 없고 마커만 표시됨
}
