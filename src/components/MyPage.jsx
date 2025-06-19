import { useNavigate } from "react-router-dom";
import MenuTabs from "./SMMapUI/MenuTabs";
import TopBar from "../components/SMMapUI/TopBar";
import starter from "../assets/입문자.png"
import explorer from "../assets/탐험가.png"
import expert from "../assets/전문가.png"
import master from "../assets/마스터.png"

export default function MyPage({ userData, onLogout, onLoginClick }) {
  if (!userData) return <p className="p-4 text-gray-500"></p>;

  const badgeMap = {
    '마스터': '/마스터.png',
    '전문가': '/전문가.png',
    '탐험가': '/탐험가.png',
    '입문자': '/입문자.png'
  };

  const navigate = useNavigate();

  const Logout = () => {
    onLogout();
    navigate('/');
  }

  const badgeSrc = badgeMap[userData.title] || '/badges/default.png';

  return (
    <div>
      <TopBar title = "마이페이지" />

      {/* 회원 정보 */}
      <div className="
      relative
      flex flex-col
      mx-[24px] m-[32px]">
        <h1 className="mb-[24px] text-[#999999] text-[16px] leading-[140%] tracking-tight">회원 정보</h1>
        <div className="
        flex">
          <img src = {starter} className="relative h-[6.9dvh] aspect-square" />
          <div className="
          relative
          w-full h-full
          grid grid-rows-2">
            <div className="
            flex
            items-end">
              <p className="pl-[16px] text-[20px] font-medium leading-[140%] tracking-tight">{userData.nickname}</p></div>
            <div className="
            flex
            items-start">
              <p className="pl-[16px] text-[16px] text-[#999999] leading-[140%] tracking-tight">{userData.title || '없음'}</p>
            </div>
          </div>
          <div className="
          w-[10dvh] h-full
          relative
          grid grid-rows-2">
            <div className="
            flex
            items-center">
              <span className="pl-[6px] text-[16px] text-[#999999] leading-[140%] tracking-tight underline">수정</span></div>
            <div className="
            flex
            items-center">
            </div>
          </div>
        </div>
      </div>

      {/* 진척도 박스 */}
      <div className="
      relative
      flex flex-col
      mx-[24px]
      bg-[#CCCCCC] rounded-xl p-4">
        <div className="
        flex
        justify-center">
          <p className="text-[12px]">n 번 더 사진을 업로드하면 댕궁동 탐험가!</p>
        </div>
        <div className="
        mt-[2.3dvh]
        grid grid-cols-4">
          <img src = {starter} />
          <img src = {explorer} />
          <img src = {expert} />
          <img src = {master} />
        </div>
      </div>


      <MenuTabs isLoggedIn={!!userData} onLoginClick={onLoginClick} />
    </div>
  );
}
