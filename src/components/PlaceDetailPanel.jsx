import { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import Review from './Review';

export default function PlaceDetailPanel({ place, isExpanded, onClose, onToggleExpand, API_URL }) {
  const [archives, setArchives] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    if (isExpanded) fetchArchives();
  }, [isExpanded, place]);

  return (
    <div
      className={`absolute bottom-0 left-0 w-full bg-white 
        rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out
        z-40
        ${isExpanded ? 'h-[60dvh]' : 'h-[25dvh] overflow-y-auto'}`}
    >
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-center h-[4dvh]"
      >
        <div className="w-[7.5dvw] h-[0.3dvh] bg-[#CCCCCC] rounded-full cursor-pointer" />
      </div>
      <div className={`${isExpanded ? 'overflow-y-auto h-[50dvh]' : 'overflow-y-hidden h-[20dvh]'}`}>
        <div className='pt-[1.5dvh] mx-[7dvw]'>
          {/* 제목 및 카테고리 */}
          <div>
            <div className="flex justify-between items-start">
              <div className='flex'>
                <h3 className="text-[24px] font-bold">{place.name}</h3>
                <p className="pl-[12px] py-[8.5px] text-[12px] text-[#999999]">{place.category || '카테고리 없음'}</p>
              </div>
            </div>
            {/* 장소 소개 */}
            <div>
              {place.description && (
                <p className="text-black text-sm leading-relaxed">
                  {place.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-[0.5dvh] mx-[7dvw]">
            <div className="pt-[2dvh] grid grid-cols-[1fr_1px_3fr] gap-[6dvw] text-sm text-[#999999]">
              <div>
                <h4 className="font-semibold mb-[0.5dvh]">영업 정보</h4>
                <p className="whitespace-pre text-[#999999]">
                  {' ' + place.hours?.replaceAll(';', '\n')}
                </p>
              </div>
              <div className='w-[0.3dvh] h-auto bg-[#CCCCCC] rounded-full cursor-pointer'/>
              <div>
                <h4 className="font-semibold mb-1">애견 관련 정보</h4>
                <p className="whitespace-pre-wrap text-[#999999]">
                  {place.detail?.split('.').filter(Boolean).map(line => `• ${line.trim()}`).join('\n')}
                </p>
              </div>
            </div>

            {/* 외부 링크 */}
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

            {/* 장소 사진 */}
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

              <input
                type="file"
                onChange={handleFileChange}
                className="block mb-2"
              />

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
