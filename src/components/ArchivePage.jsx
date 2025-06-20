import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/SMMapUI/TopBar";
import MenuTabs from './SMMapUI/MenuTabs';
import unknownImg from '../assets/unknownImg.png';

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

  const getLayout = (archives, remainingCount, targetPage) => {
    const bigPhoto = archives[0];
    const smallPhotos = archives.slice(1, 5); // 최대 4장

    return (
      <div> {/* 전체 좌우 여백 */}
        <div className="flex gap-1">
          {/* 왼쪽 큰 이미지 */}
          <div
            className="flex-1 aspect-square"
            onClick={() =>navigate(targetPage)}
          >
            <img
              src={bigPhoto?.photoUrl}
              alt="big"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 오른쪽 2x2 그리드 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-[50%]">
            {smallPhotos.map((photo, i) => {
              const isLast = i === 3 && remainingCount > 0;
              return (
                <div 
                  key={i}
                  className="relative aspect-square curser-pointer"
                  onClick={() =>navigate(targetPage)}
                >
                  <img
                    src={photo.photoUrl}
                    alt={`small-${i}`}
                    className={`w-full h-full object-cover ${isLast ? 'brightness-75' : ''}`}
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
      </div>
    );
  };


  return (
    <div>
      <TopBar title = "댕궁동 아카이브" />
      {/* 나의 아카이브 섹션 */}
      <div className="mb-6 px-4">  {/* ← padding 추가 */}
        <div className="flex items-center space-x-2 mb-2 mt-6">
          <h3 className="text-[16px] font-semibold">나의 아카이브 </h3>
          <span className="text-[16px] font-medium text-[#999999]">·</span>
          <span className="text-[14px] font-medium text-[#999999]">{myArchives.length}</span>
        </div>
        {/* 이미지 레이아웃 */}
        {myArchives.length === 0 ? (
          <div className="w-40 h-40 overflow-hidden flex justify-center items-center">
            <img src={unknownImg} alt="empty" className="w-50 h-50 opacity-50" />
          </div>
        ) : (
          getLayout(myArchives, myArchives.length - 5, '/archive/mine')
        )}
        <hr className="border-t border-[#CCCCCC] my-6" />
      </div>
        
      {/* 댕궁동 아카이브 섹션 */}
      <div className="px-4"> {/* ← 동일한 패딩 적용 */}
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-[16px] font-semibold">댕궁동 아카이브</h3>
          <span className="text-[16px] font-medium text-[#999999]">·</span>
          <span className="text-[14px] font-medium text-[#999999]">{allArchives.length}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-3">
          반려인들이 댕궁동에서 남긴 추억들을 확인해보세요.
        </p>
        {allArchives.length === 0 ? (
          <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded">
            <img src={unknownImg} alt="empty" className="w-10 h-10 opacity-50" />
          </div>
        ) : (
          getLayout(allArchives, allArchives.length - 5, '/archive/all')
        )}
      </div>


      <MenuTabs isLoggedIn={!!localStorage.getItem('token')} onLoginClick={onLoginClick} />
    </div>
  );
}