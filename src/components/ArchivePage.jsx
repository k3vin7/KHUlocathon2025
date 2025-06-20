import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/SMMapUI/TopBar";
import MenuTabs from './SMMapUI/MenuTabs';

const API_URL = import.meta.env.VITE_API_URL;

export default function ArchivePage({ onLoginClick }) {
  const navigate = useNavigate();
  const [myArchives, setMyArchives] = useState([]);
  const [allArchives, setAllArchives] = useState([]);

  useEffect(() => {
    const fetchMyArchives = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/archives/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMyArchives(data);
      } catch (err) {
        console.error('나의 아카이브 불러오기 실패', err);
      }
    };

    const fetchAllArchives = async () => {
      try {
        const res = await fetch(`${API_URL}/archives/all`);
        const data = await res.json();
        setAllArchives(data);
      } catch (err) {
        console.error('전체 아카이브 불러오기 실패', err);
      }
    };

    fetchMyArchives();
    fetchAllArchives();
  }, []);

  const getLayout = (archives, remainingCount) => {
  const bigPhoto = archives[0];
  const smallPhotos = archives.slice(1, 5); // 최대 4장만 표시

  return (
    <div className="flex gap-1 h-36">
      {/* 왼쪽 큰 이미지 */}
      <div className="flex-1 h-full">
        <img
          src={bigPhoto?.photoUrl}
          alt="big"
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* 오른쪽 2x2 그리드 */}
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-1/2">
        {smallPhotos.map((photo, i) => {
          const isLast = i === 3 && remainingCount > 0;
          return (
            <div key={i} className="relative">
              <img
                src={photo.photoUrl}
                alt={`small-${i}`}
                className={`w-full h-full object-cover rounded ${
                  isLast ? 'grayscale brightness-75' : ''
                }`}
              />
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">+{remainingCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};




  return (
    <div>
      <TopBar title = "댕궁동 아카이브" />
      {/* 나의 아카이브 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold">나의 아카이브 · {myArchives.length}</h3>
          <button onClick={() => navigate('/archive/mine')}>
            <span className="text-orange-500 font-semibold">{'>'}</span>
          </button>
        </div>

        {myArchives.length === 0 ? (
          <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded">
            <img src="/empty-image-icon.png" alt="empty" className="w-10 h-10 opacity-50" />
          </div>
        ) : (
          getLayout(myArchives, myArchives.length - 5)
        )}
      </div>

      {/* 댕궁동 아카이브 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold">댕궁동 아카이브 · {allArchives.length}</h3>
          <button onClick={() => navigate('/archive/all')}>
            <span className="text-orange-500 font-semibold">{'>'}</span>
          </button>
        </div>

        {allArchives.length === 0 ? (
          <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded">
            <img src="/empty-image-icon.png" alt="empty" className="w-10 h-10 opacity-50" />
          </div>
        ) : (
          getLayout(allArchives, allArchives.length - 5)
        )}

        <p className="text-sm text-gray-500 mt-1">반려인들이 댕궁동에서 남긴 추억들을 확인해보세요.</p>
      </div>

      <MenuTabs isLoggedIn={!!localStorage.getItem('token')} onLoginClick={onLoginClick} />
    </div>
  );
}
