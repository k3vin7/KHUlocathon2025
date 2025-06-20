import { useEffect, useState } from 'react';
import MenuTabs from './SMMapUI/MenuTabs';
import TopBar from './SMMapUI/TopBarBack';
import BackIcon from '../assets/backicon.png';

const API_URL = import.meta.env.VITE_API_URL;

export default function MyArchivePage({ onLoginClick }) {
  const [archives, setArchives] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // 오버레이 인덱스

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/archives/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const archiveData = await res.json();

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

        setArchives(enriched);
      } catch (err) {
        console.error('아카이브 불러오기 실패', err);
      }
    };

    fetchArchives();
  }, []);

  const groupedByYear = archives.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});

  const openImage = (index) => setSelectedIndex(index);
  const closeOverlay = () => setSelectedIndex(null);
  const prevImage = () =>
    setSelectedIndex((i) => (i > 0 ? i - 1 : i));
  const nextImage = () =>
    setSelectedIndex((i) => (i < archives.length - 1 ? i + 1 : i));

  return (
    <div className="pb-16">
      {/* 상단 바 */}
      <TopBar title="" onBack={() => window.history.back()} />

      {/* 타이틀 */}
      <div className="px-4 pt-4">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-[16px] font-semibold text-[#000000] mt-2">나의 아카이브</h2>
          <span className="text-[16px] font-medium text-[#999999]">·</span>
          <span className="text-[14px] font-medium text-[#999999]">{archives.length}</span>
        </div>
        <hr className="border-t border-[#CCCCCC] my-3 mb-4" />
      </div>

      {/* 본문 */}
      <div className="px-4 pt-2">
        {Object.keys(groupedByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year}>
              <h3 className="text-[14px] font-medium text-[#999999] mb-2">{year}</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {groupedByYear[year].map((item, idx) => {
                  const globalIndex = archives.findIndex((a) => a._id === item._id);
                  return (
                    <div key={item._id}>
                      <img
                        src={item.photoUrl}
                        alt="archive"
                        className="w-full h-40 object-cover rounded cursor-pointer"
                        onClick={() => openImage(globalIndex)}
                      />
                      <div className="mt-1 flex gap-1 items-center text-[11px] text-[#999999]">
                        <span>{item.date}</span>
                        <span>|</span>
                        <span className="text-[12px] font-semibold text-[#000000] truncate max-w-[80%]">
                          {item.placeName.length > 10
                            ? `${item.placeName.slice(0, 9)}...`
                            : item.placeName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* 확대 오버레이 */}
      {selectedIndex !== null && (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            onClick={closeOverlay}
        >
            {/* 상단 컨트롤 (이미지 바로 위) */}
            <div
            className="flex justify-between items-center w-full px-4 mb-2 text-[#CCCCCC] text-[14px] font-medium"
            onClick={(e) => e.stopPropagation()}
            >
            <button onClick={() => setSelectedIndex(i => i > 0 ? i - 1 : i)}>
                <img src={BackIcon} alt="prev" className="w-7 h-7" />
            </button>
            <span>{selectedIndex + 1} / {archives.length}</span>
            <button onClick={() => setSelectedIndex(i => i < archives.length - 1 ? i + 1 : i)}>
                <img src={BackIcon} alt="next" className="w-7 h-7 -scale-x-100" />
            </button>
            </div>

            {/* 이미지 */}
            <img
            src={archives[selectedIndex].photoUrl}
            alt="zoomed"
            className="max-w-[90%] max-h-[70%] rounded"
            onClick={(e) => e.stopPropagation()}
            />

            {/* 하단 정보 (이미지 바로 아래) */}
            <div
            className="flex justify-between items-center w-full px-4 mt-2 text-white text-sm"
            onClick={(e) => e.stopPropagation()}
            >
            <div>
                <span className="mr-1 text-[12px] text-[#CCCCCC]">
                {archives[selectedIndex].date}
                </span>
                <span className="text-[12px] text-[#CCCCCC]">|</span>
                <span className="text-[13px] font-semibold ml-1">
                {archives[selectedIndex].placeName}
                </span>
            </div>

            {/* ✅ 실제 삭제 버튼 */}
            <button
                className="text-[13px] text-[#CCCCCC] underline"
                onClick={async (e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
                if (!confirmDelete) return;

                try {
                    const token = localStorage.getItem('token');
                    const archiveId = archives[selectedIndex]._id;

                    await fetch(`${API_URL}/archives/${archiveId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                    });

                    // 삭제 반영
                    const updated = archives.filter((_, i) => i !== selectedIndex);
                    setArchives(updated);
                    setSelectedIndex(null);
                } catch (err) {
                    console.error('삭제 실패:', err);
                    alert('삭제에 실패했습니다.');
                }
                }}
            >
                삭제
            </button>
            </div>
        </div>
        )}



      {/* 하단 탭 */}
      <MenuTabs
        isLoggedIn={!!localStorage.getItem('token')}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}
