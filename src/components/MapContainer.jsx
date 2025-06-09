import { useEffect, useRef, useState } from 'react';
import LocateButton from './LocateButton';
import LoginPage from './LoginPage';

export default function MapContainer() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [showMyPage, setShowMyPage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchReviews = async (placeId) => {
    try {
      const res = await fetch(`${API_URL}/places/${placeId}/reviews`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
      else setReviews([]);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;
    try {
      const res = await fetch(`${API_URL}/places/${selectedPlace._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newReview }),
      });
      if (!res.ok) throw new Error();
      setNewReview('');
      fetchReviews(selectedPlace._id);
    } catch (err) {
      alert('리뷰 작성 실패');
    }
  };

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
        const res = await fetch(`${API_URL}/places`);
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
              setIsExpanded(false);
              return;
            }

            try {
              const res = await fetch(`${API_URL}/places/${place._id}`);
              const detailedPlace = await res.json();
              setSelectedPlace(detailedPlace);
              setIsExpanded(false);
              fetchReviews(place._id);
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
      const res = await fetch(`${API_URL}/auth/me`, {
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
        <div
          className={`
            absolute bottom-0 left-0 w-full bg-white 
            rounded-t-2xl p-4 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
            transition-all duration-300 ease-in-out
            ${isExpanded ? 'h-[80dvh]' : 'h-[35dvh]'}
          `}
        >
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-2 cursor-pointer"
          />

          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
              <p className="text-xs text-gray-400 mt-1">카테고리/분류</p>
            </div>
            <button
              onClick={() => {
                setSelectedPlace(null);
                setIsExpanded(false);
                if (openInfoWindow) openInfoWindow.close();
                setOpenInfoWindow(null);
              }}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          <p className="mt-3 text-sm">{selectedPlace.description}</p>

          {selectedPlace.photoUrl && (
            <img
              src={selectedPlace.photoUrl}
              alt="대표 이미지"
              className="w-full h-48 object-cover rounded-md mt-4"
            />
          )}

          {isExpanded && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">✍️ 리뷰 작성</h4>
              <textarea
                rows={3}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="이 장소에 대해 어떤 생각을 하시나요?"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                onClick={handleReviewSubmit}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                제출
              </button>

              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400">리뷰가 없습니다.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="border-b pb-2">
                      <p className="text-sm"><b>{r.author}</b> · {new Date(r.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm mt-1">{r.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 마이페이지 */}
      <div
        className={`
          fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-30
          transform transition-transform duration-300 ease-in-out
          ${showMyPage ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {userData && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
