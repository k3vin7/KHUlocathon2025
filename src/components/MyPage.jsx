import { useNavigate } from "react-router-dom";
import MenuTabs from "./SMMapUI/MenuTabs";
import TopBar from "../components/SMMapUI/TopBar";
import starter from "../assets/입문자.png";
import explorer from "../assets/탐험가.png";
import expert from "../assets/전문가.png";
import master from "../assets/마스터.png";

export default function MyPage({ userData, onLogout, onLoginClick, isLoggedIn }) {
  const navigate = useNavigate();

  if (!userData) return <p className="p-4 text-gray-500">로그인 정보를 불러오는 중...</p>;

  const badgeMap = {
    '마스터': master,
    '전문가': expert,
    '탐험가': explorer,
    '입문자': starter
  };

  const badgeSrc = badgeMap[userData.title] || starter;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="pb-[10dvh]">
      <TopBar title="마이페이지" />

      {/* 회원 정보 */}
      <div className="relative flex flex-col mx-[24px] my-[32px]">
        <h1 className="mb-[24px] text-[#999999] text-[16px] leading-[140%] tracking-tight">회원 정보</h1>
        <div className="flex items-center">
          <img src={badgeSrc} className="h-[6.9dvh] aspect-square" />
          <div className="w-full h-full grid grid-rows-2 ml-[16px]">
            <div className="flex items-end">
              <p className="text-[20px] font-medium leading-[140%] tracking-tight">{userData.nickname}</p>
            </div>
            <div className="flex items-start">
              <p className="text-[16px] text-[#999999] leading-[140%] tracking-tight">{userData.title || '없음'}</p>
            </div>
          </div>
          <div className="w-[10dvh] h-full grid grid-rows-2 items-center">
            <span className="text-[16px] text-[#999999] leading-[140%] tracking-tight underline pl-2">수정</span>
          </div>
        </div>
      </div>

      {/* 진척도 박스 */}
      <div className="relative flex flex-col mx-[24px] bg-[#CCCCCC]/10 rounded-xl p-4">
        <p className="text-[12px] text-center">n 번 더 사진을 업로드하면 댕궁동 탐험가!</p>
        <div className="mt-[2.3dvh] grid grid-cols-4 gap-2 justify-items-center">
          <img src={starter} className="h-[5vh]" />
          <img src={explorer} className="h-[5vh]" />
          <img src={expert} className="h-[5vh]" />
          <img src={master} className="h-[5vh]" />
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 mt-6 rounded text-sm mx-auto max-w-xs block"
      >
        로그아웃
      </button>

      <MenuTabs isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
    </div>
  );
}
