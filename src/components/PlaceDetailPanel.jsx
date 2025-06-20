import { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import Review from './Review';

export default function PlaceDetailPanel({ place, isExpanded, onClose, onToggleExpand, API_URL }) {
  const [archives, setArchives] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [tab, setTab] = useState('info');

  const fetchArchives = async () => {
    try {
      const res = await fetch(`${API_URL}/archives/place/${place._id}`);
      const data = await res.json();
      setArchives(data);
    } catch (err) {
      console.error('아카이빙 조회 실패:', err);
    }
  };

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

  const isWalkCourse = place.category === '산책코스';

  return (
    <div
      className={`absolute bottom-0 left-0 w-full bg-white 
        rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out z-40
        ${isExpanded ? 'h-[60dvh]' : 'h-[25dvh] overflow-y-auto'}`}
    >
      <div onClick={onToggleExpand} className="flex items-center justify-center h-[4dvh]">
        <div className="w-[7.5dvw] h-[0.3dvh] bg-[#CCCCCC] rounded-full cursor-pointer" />
      </div>

      <div className="px-[7dvw]">
        <div className="flex items-start">
          <h3 className="text-[20px] font-bold">{place.name}</h3>
          <p className="ml-2 text-[12px] text-[#999999] pt-1">{place.category || '카테고리 없음'}</p>
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
                    <div>
                      <h4 className="font-semibold mb-[0.5dvh]">영업 상태</h4>
                      <p className="whitespace-pre text-[#999999]">
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
                    {archives.map((a) => (
                      <img
                        key={a._id}
                        src={a.photoUrl}
                        alt="아카이브 이미지"
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>

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
