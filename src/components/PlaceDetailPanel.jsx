import { FaInstagram } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import Review from './Review';

export default function PlaceDetailPanel({ place, isExpanded, onClose, onToggleExpand, API_URL }) {
  const defaultImages = [
  '/default-image1.jpg',
  '/default-image2.jpg',
  '/default-image3.jpg',
  '/default-image4.jpg'
  ];

  return (
    <div className={`
      absolute bottom-0 left-0 w-full bg-white 
      rounded-t-2xl p-4 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
      transition-all duration-300 ease-in-out overflow-y-auto
      ${isExpanded ? 'h-[80dvh]' : 'h-[35dvh]'}
    `}>
      <div
        onClick={onToggleExpand}
        className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-3 cursor-pointer"
      />

      {/* 제목 및 카테고리 */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{place.name}</h3>
          <p className="text-sm text-gray-400">{place.category || '카테고리 없음'}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-5">
          {/* 설명 */}
          {(place.detail || place.summary || place.description) && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {place.detail || place.summary}
            </p>
          )}

          {/* 기본 정보 그리드 */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <h4 className="font-semibold mb-1">영업 상태</h4>
              <p className="whitespace-pre-wrap text-gray-700">{place.hours}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">테라스 유무 / 입장 제한 정보</h4>
              <p className="text-gray-700">견종 크기</p>
              <p className="text-gray-700">입장 제한 정보</p>
            </div>
          </div>

          {/* 링크 버튼 */}
          <div className="flex gap-3">
            <a
              href={`https://map.naver.com/v5/search/${place.name}`}
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
            {defaultImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`기본 이미지 ${i + 1}`}
                className="w-40 h-40 object-cover rounded-md flex-shrink-0"
              />
            ))}
          </div>

          {/* 리뷰 아카이브 */}
          <div>
            <h4 className="text-base font-semibold mt-4">댕궁동 아카이브</h4>
            <p className="text-sm text-gray-600 mt-1 mb-2">
              반려동물과 함께 방문한 사진을 업로드해보세요.
            </p>
            <Review placeId={place._id} API_URL={API_URL} />
          </div>
        </div>
      )}
    </div>
  );
}
