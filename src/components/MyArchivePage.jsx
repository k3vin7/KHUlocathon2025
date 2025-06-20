import { useEffect, useState } from 'react';
import MenuTabs from './SMMapUI/MenuTabs';
import TopBar from './SMMapUI/TopBarBack';

const API_URL = import.meta.env.VITE_API_URL;

export default function MyArchivePage({ onLoginClick }) {
  const [archives, setArchives] = useState([]);

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

  return (
    <div className="pb-16">
      {/* 상단 화살표 TopBar */}
      <TopBar title="" onBack={() => window.history.back()} />

      {/* 타이틀 */}
      <div className="px-4 pt-4 pb-3 border-b border-[#CCCCCC]">
        <div className="flex items-baseline space-x-1">
          <h2 className="text-[16px] font-semibold text-[#000000] mt-2">나의 아카이브</h2>
          <span className="text-[14px] font-medium text-[#999999]">· {archives.length}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 pt-4">
        {Object.keys(groupedByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year}>
              <h3 className="text-[12px] font-medium text-[#999999] mb-2">{year}</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {groupedByYear[year].map((item) => (
                  <div key={item._id}>
                    <img
                      src={item.photoUrl}
                      alt="archive"
                      className="w-full h-40 object-cover rounded"
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
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* 하단 탭 */}
      <MenuTabs
        isLoggedIn={!!localStorage.getItem('token')}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}
