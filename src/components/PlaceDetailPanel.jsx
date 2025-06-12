// src/components/PlaceDetailPanel.jsx
import Review from './Review';

export default function PlaceDetailPanel({
  place,
  isExpanded,
  onClose,
  onToggleExpand,
  API_URL
}) {
  return (
    <div
      className={`
        absolute bottom-0 left-0 w-full bg-white 
        rounded-t-2xl p-4 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        transition-all duration-300 ease-in-out
        overflow-y-auto
        ${isExpanded ? 'h-[80dvh]' : 'h-[35dvh]'}
      `}
    >
      <div
        onClick={onToggleExpand}
        className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-2 cursor-pointer"
      />

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{place.name}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {place.category || '카테고리 없음'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-4 text-sm">
          {/* 소개 */}
          {(place.summary || place.detail || place.description) && (
            <div>
              <h4 className="text-base font-semibold mb-1">소개</h4>
              <p className="text-gray-700">
                {place.detail}
              </p>
            </div>
          )}

          {/* 이미지 */}
          {place.photoUrl && (
            <img
              src={place.photoUrl}
              alt="대표 이미지"
              className="w-full h-48 object-cover rounded-md shadow-sm"
            />
          )}

          {/* 기본 정보 */}
          <div>
            <h4 className="text-base font-semibold mb-1">기본 정보</h4>
            <ul className="space-y-1">
              {place.hours && <li><span className="font-medium">🕒 운영 시간:</span> {place.hours}</li>}
              {place.phone && <li><span className="font-medium">📞 전화번호:</span> {place.phone}</li>}
              {place.instagram && (
                <li>
                  <span className="font-medium">📷 Instagram:</span>{' '}
                  <a href={place.instagram} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    방문하기
                  </a>
                </li>
              )}
              <li><span className="font-medium">📍 주소:</span> {place.address || '정보 없음'}</li>
            </ul>
          </div>

          {/* 리뷰 */}
          <div>
            <h4 className="text-base font-semibold mb-1">리뷰</h4>
            <Review placeId={place._id} API_URL={API_URL} />
          </div>
        </div>
      )}
    </div>
  );
}
