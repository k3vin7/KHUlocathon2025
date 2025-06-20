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
      <div className="flex flex-col mx-[5dvw] my-[3dvh]">
        <h2 className="text-[#999] text-[1.6dvh] mb-[2dvh]">회원 정보</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={badgeSrc} className="h-[6.5dvh] w-[6.5dvh] rounded-full" />
            <div className="ml-[3dvw]">
              <p className="text-[2.3dvh] font-medium">{userData.nickname}</p>
              <p className="text-[1.8dvh] text-[#999]">{userData.title}</p>
            </div>
          </div>
          <span className="underline text-[1.7dvh] text-[#999] pr-[1dvw]">수정</span>
        </div>
      </div>

      {/* 진척도 박스 */}
      <div className="flex flex-col mx-[5dvw] p-[2dvh] bg-[#CCCCCC]/20 rounded-xl">
        <p className="text-[1.5dvh] text-center mb-[2dvh]">
          {`${6 - (userData.stampcount || 0)}번 더 사진을 업로드하면 댕궁동 탐험가!`}
        </p>
        <div className="grid grid-cols-4 gap-[2dvw] justify-items-center mb-[1dvh]">
          <img src={starter} className="h-[5dvh]" />
          <img src={explorer} className="h-[5dvh]" />
          <img src={expert} className="h-[5dvh]" />
          <img src={master} className="h-[5dvh]" />
        </div>
        <div className="flex justify-between mt-[1dvh] px-[1dvw]">
          <span className="text-[1.4dvh] text-orange-500">댕궁동 입문자</span>
          <span className="text-[1.4dvh] text-[#999]">댕궁동 탐험가</span>
        </div>
        <div className="h-[1dvh] mt-[0.8dvh] bg-[#eee] rounded-full">
          <div
            className="h-full bg-orange-400 rounded-full transition-all"
            style={{ width: `${(userData.reviewCount || 0) / 6 * 100}%` }}
          />
        </div>
        <p className="text-right text-[1.4dvh] text-[#999] mt-[0.5dvh]">{`${userData.reviewCount || 0} / 6`}</p>
      </div>

      <hr className="mx-[5dvw] my-[3dvh] border-t-[1px] border-[#E2E2E2]/50" />

      {/* 설정 */}
      <div className="mx-[5dvw] mt-[4dvh]">
        <h2 className="text-[#999] text-[1.6dvh] mb-[2dvh]">설정</h2>
        <p className="text-[1.9dvh] py-[1.5dvh]">비밀번호 찾기</p>
        <p className="text-[1.9dvh] py-[1.5dvh]" onClick={handleLogout}>로그아웃</p>
        <p className="text-[1.9dvh] py-[1.5dvh] text-red-500">탈퇴하기</p>
      </div>

      <MenuTabs isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
    </div>
  );
}
