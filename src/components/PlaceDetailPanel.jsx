import { useEffect, useState, useRef } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import ImageOverlay from './SMMapUI/ImageOverlay';
import Review from './Review';

export default function PlaceDetailPanel({ place, isExpanded, onClose, onToggleExpand, API_URL }) {
  const [archives, setArchives] = useState([]);
  const [ar2, setAr2] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [tab, setTab] = useState('info');
  const [userInfo, setUserInfo] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // 오버레이 인덱스
  const panelRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const dragging = useRef(false);

  const handleTouchStart = (e) => {
    dragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    if (deltaY > 0) {
      panelRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    const deltaY = currentY.current - startY.current;

    if (isExpanded && deltaY > 50) {
      onToggleExpand();  // 패널 닫기
    } else if(!isExpanded && deltaY < -50){
      onToggleExpand();
    }else if(!isExpanded && deltaY>50){
      panelRef.current.style.transition = 'transform 0.3s ease';
      panelRef.current.style.transform = 'translateY(100%)';
      setTimeout(()=>{
        onClose();  
      }, 300);
      
    }else{
      panelRef.current.style.transform = 'translateY(0)';
    }
  };

  const fetchArchives = async () => {
    try {
      const res = await fetch(`${API_URL}/archives/place/${place._id}`);
      const data = await res.json();
      setArchives(data);
    } catch (err) {
      console.error('아카이빙 조회 실패:', err);
    }
  };


  const fetchArchives2 = async () => {
    try {
      const archiveData = archives

      const placeIds = [...new Set(archiveData.map((item) => item.placeId))];
      const placeMap = {};
      await Promise.all(
        placeIds.map(async (id) => {
          const res = await fetch(`${API_URL}/places/${id}`);
          const data = await res.json();
          placeMap[id] = data.name;
        })
      );

      const enriched = archiveData.map((item) => {
        const dateObj = new Date(item.createdAt);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
        }).replace(/\. /g, '.').replace('.', '.');
        const year = dateObj.getFullYear();
        return {
          ...item,
          date: formattedDate,
          year,
          placeName: placeMap[item.placeId] || '알 수 없음',
        };
      });

      setAr2(enriched);
    } catch (err) {
      console.error('전체 아카이브 불러오기 실패', err);
    }
  };

  useEffect(() => {
      const fetchUserInfo = async () => {
        if (selectedIndex === null) return;
        const userId = archives[selectedIndex]?.userId;
        if (!userId) return;
  
        try {
          const res = await fetch(`${API_URL}/auth/get/${userId}`);
          const data = await res.json();
          setUserInfo(data); // { nickname, title, ... }
        } catch (err) {
          console.error('사용자 정보 불러오기 실패:', err);
          setUserInfo(null);
        }
      };
  
      fetchUserInfo();
    }, [selectedIndex]);
  useEffect(() => {
  if (isExpanded && panelRef.current) {
    panelRef.current.style.transform = 'translateY(0)';
    }
  }, [isExpanded]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('placeId', place._id);
    formData.append('photo', file);

    try {
      const res = await fetch(`${API_URL}/archives/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('업로드 실패');
      setPhotoFile(null);
      fetchArchives();
    } catch (err) {
      console.error('아카이빙 업로드 실패:', err);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchArchives();
      setTab('info');
    }
  }, [isExpanded, place]);
  useEffect(() => {
    if (archives.length > 0) {
      fetchArchives2(); // archives 기반
    }
  }, [archives]);

  useEffect(() => {
      const fetchMyInfo = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
  
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setMyUserId(data._id); // 유저 ID 저장
        } catch (err) {
          console.error('유저 정보 불러오기 실패', err);
        }
      };
  
      fetchMyInfo();
    }, []);

  const isWalkCourse = place.category === '산책코스';

  return (
    <div
      ref={panelRef}
      className={`absolute bottom-0 left-0 w-full bg-white 
        rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out z-40
        ${isExpanded ? 'h-[60dvh]' : 'h-[25dvh] overflow-y-auto'}`}
    >
      <div 
        onClick={onToggleExpand}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex items-center justify-center h-[4dvh]"
      >
        <div className="w-[7.5dvw] h-[0.3dvh] bg-[#CCCCCC] rounded-full cursor-pointer" />
      </div>

      <div className="px-[7dvw]">
        <div className="flex items-start">
          <h3 className="text-[20px] font-bold">{place.name}</h3>
          <p className="ml-2 min-w-[45px] text-[12px] text-[#999999] pt-1">{place.category || '카테고리 없음'}</p>
        </div>
        <p className="text-black text-sm leading-snug mt-1">
          {place.description || place.detail || place.summary || '설명 정보 없음'}
        </p>
      </div>

      {isExpanded && (
        <div className="overflow-y-auto px-[7dvw] h-[calc(60dvh-11dvh)] pb-[120px]">
          {isWalkCourse ? (
            <>
              <h4 className="text-sm font-semibold mt-6 mb-2 text-[#000000]">주의 사항</h4>
              <ul className="list-disc list-inside text-sm text-[#6A6A6A] space-y-1">
                {place.detail
                  .split('-')
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i} className="text-sm text-gray-600">• {line.trim()}</p>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <div className="mt-3 border-b border-gray-200 flex justify-around text-sm font-medium text-gray-400">
                <button
                  className={`pb-2 w-1/2 ${tab === 'info' ? 'text-black border-b-2 border-black' : ''}`}
                  onClick={() => setTab('info')}
                >
                  홈
                </button>
                <button
                  className={`pb-2 w-1/2 ${tab === 'archive' ? 'text-black border-b-2 border-black' : ''}`}
                  onClick={() => setTab('archive')}
                >
                  아카이브
                </button>
              </div>

              {tab === 'info' && (
                <>
                  <div className="pt-[2dvh] grid grid-cols-[1fr_1px_3fr] gap-[6dvw] text-sm text-[#999999]">
                    <div className='min-w-[30dvw]'>
                      <h4 className="font-semibold mb-[0.5dvh]">영업 상태</h4>
                      <p className="whitespace-pre-wrap break-words text-[#999999]">
                        {' ' + place.hours?.replaceAll(';', '\n')}
                      </p>
                    </div>
                    <div className='w-[0.3dvh] h-auto bg-[#CCCCCC] rounded-full' />
                    <div>
                      <h4 className="font-semibold mb-1"></h4>
                      <p className="whitespace-pre-wrap text-[#999999]">
                        {place.detail?.split('.').filter(Boolean).map(line => `• ${line.trim()}`).join('\n')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-[2dvh]">
                    <a
                      href={place.naverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100"
                    >
                      <SiNaver className="text-lg" />
                      네이버지도
                    </a>
                    {place.instagram && (
                      <a
                        href={place.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100"
                      >
                        <FaInstagram className="text-lg" />
                        인스타그램
                      </a>
                    )}
                  </div>

                  <div className="flex gap-3 mt-2 overflow-x-auto">
                    {(place.photos && place.photos.length > 0 ? place.photos : ['/default.jpg']).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`장소 이미지 ${i + 1}`}
                        className="w-40 h-40 object-cover rounded-md flex-shrink-0"
                      />
                    ))}
                  </div>
                </>
              )}

              {tab === 'archive' && (
                <>
                  <h4 className="text-base font-semibold mt-4">댕궁동 아카이브</h4>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    반려동물과 함께 방문한 사진을 업로드해보세요.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-[100px]">
                    {archives.map((a, i) => (
                      <img
                        key={a._id}
                        src={a.photoUrl}
                        alt="아카이브 이미지"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => setSelectedIndex(i)}
                      />
                    ))}
                  </div>

                  {/* 오버레이 */}
                  {selectedIndex !== null && (
                    <ImageOverlay
                      archives={ar2}
                      selectedIndex={selectedIndex}
                      setSelectedIndex={setSelectedIndex}
                      onClose={() => setSelectedIndex(null)}
                      userInfo={userInfo}
                      myUserId={myUserId}
                      onDelete={(archiveId) => {
                        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
                        if (!confirmDelete) return;

                        const token = localStorage.getItem('token');
                        fetch(`${API_URL}/archives/${archiveId}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        })
                          .then(() => {
                            const updated = archives.filter((item) => item._id !== archiveId);
                            setArchives(updated);
                            setSelectedIndex(null);
                          })
                          .catch((err) => {
                            console.error('삭제 실패:', err);
                            alert('삭제에 실패했습니다.');
                          });
                      }}
                    />
                  )}

                  <div className="absolute bottom-[72px] left-0 w-full px-[7dvw] z-50">
                    <label
                      htmlFor="photo-upload"
                      className="block bg-[#2B1D18] text-white text-sm px-6 py-2 rounded-full text-center cursor-pointer"
                    >
                      사진 업로드하기
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
