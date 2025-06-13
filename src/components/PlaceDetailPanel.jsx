import { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import Review from './Review';

export default function PlaceDetailPanel({ place, isExpanded, onClose, onToggleExpand, API_URL }) {
  const [archives, setArchives] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('');

  const fetchArchives = async () => {
    try {
      const res = await fetch(`${API_URL}/archives/place/${place._id}`);
      const data = await res.json();
      setArchives(data);
    } catch (err) {
      console.error('아카이빙 조회 실패:', err);
    }
  };

  const handleArchiveSubmit = async () => {
    if (!photoUrl.trim()) return alert('사진 URL을 입력해주세요.');
    try {
      const res = await fetch(`${API_URL}/archives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ placeId: place._id, photoUrl }),
      });
      if (!res.ok) throw new Error('업로드 실패');
      setPhotoUrl('');
      fetchArchives();
    } catch (err) {
      console.error('아카이빙 업로드 실패:', err);
    }
  };

  useEffect(() => {
    if (isExpanded) fetchArchives();
  }, [isExpanded, place]);

  return (
    <div
      className={`absolute bottom-0 left-0 w-full bg-white 
        rounded-t-2xl z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'h-[50dvh]' : 'h-[5dvh]'}`}
    >
      <div
        onClick={onToggleExpand}
        className="w-12 h-1 bg-gray-400 rounded-full mx-auto my-2 cursor-pointer"
      />

      <div className={`px-4 ${isExpanded ? 'overflow-y-auto h-[calc(80dvh-40px)]' : 'overflow-hidden h-0'}`}>
        {/* 제목 및 카테고리 */}
        <div className="flex justify-between items-start">
          <div className='flex'>
            <h3 className="text-[24px] font-bold">{place.name}</h3>
            <p className="pl-[12px] py-[8.5px] text-[12px] text-gray-400">{place.category || '카테고리 없음'}</p>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-5">
            {place.description && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {place.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <h4 className="font-semibold mb-1">영업 정보</h4>
                <p className="whitespace-pre-wrap text-gray-700">
                  {' ' + place.hours?.replaceAll(';', '\n')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">애견 관련 정보</h4>
                <p className="whitespace-pre-wrap text-gray-700">
                  {' ' + place.detail?.replaceAll('.', '\n')}
                </p>
              </div>
            </div>

            {/* 외부 링크 */}
            <div className="flex gap-3">
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

            {/* 장소 사진 (place.photos 기반) */}
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

            {/* 아카이브 섹션 */}
            <div>
              <h4 className="text-base font-semibold mt-4">댕궁동 아카이브</h4>
              <p className="text-sm text-gray-600 mt-1 mb-2">
                반려동물과 함께 방문한 사진을 업로드해보세요.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="사진 URL 입력"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={handleArchiveSubmit}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  업로드
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {archives.map((a) => (
                  <img
                    key={a._id}
                    src={a.photoUrl}
                    alt="아카이브 이미지"
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* 리뷰 섹션 */}
            <Review placeId={place._id} API_URL={API_URL} />
          </div>
        )}
      </div>
    </div>
  );
}
