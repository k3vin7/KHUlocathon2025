import { useEffect, useState } from 'react';
import MenuTabs from './SMMapUI/MenuTabs';
import TopBar from './SMMapUI/TopBarBack';
import ImageOverlay from './SMMapUI/ImageOverlay';

const API_URL = import.meta.env.VITE_API_URL;

export default function AllArchivePage({ onLoginClick }) {
  const [archives, setArchives] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [myUserId, setMyUserId] = useState(null);

  // 선택된 이미지가 바뀔 때마다 사용자 정보 요청
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
    const fetchArchives = async () => {
      try {
        const res = await fetch(`${API_URL}/archives/all`);
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
        console.error('전체 아카이브 불러오기 실패', err);
      }
    };

    fetchArchives();
  }, []);
 
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

  const groupedByYear = archives.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});

  const openImage = (index) => setSelectedIndex(index);
  const closeOverlay = () => setSelectedIndex(null);

  return (
    <div className="pb-16">
      <TopBar title="" onBack={() => window.history.back()} />

      <div className="px-4 pt-4">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-[16px] font-semibold text-[#000000] mt-2">전체 아카이브</h2>
          <span className="text-[16px] font-medium text-[#999999]">·</span>
          <span className="text-[14px] font-medium text-[#999999]">{archives.length}</span>
        </div>
        <hr className="border-t border-[#CCCCCC] my-3 mb-4" />
      </div>

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
                          {item.placeName.length > 10 ? `${item.placeName.slice(0, 9)}...` : item.placeName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <ImageOverlay
        archives={archives}
        selectedIndex={selectedIndex}
        onClose={closeOverlay}
        setSelectedIndex={setSelectedIndex}
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

      <MenuTabs
        isLoggedIn={!!localStorage.getItem('token')}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}