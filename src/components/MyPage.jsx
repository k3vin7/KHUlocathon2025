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

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const getLevelInfo = (count) => {
    if (count >= 20) return { level: '마스터', next: null, max: 20 };
    if (count >= 11) return { level: '전문가', next: 20, max: 20 };
    if (count >= 6) return { level: '탐험가', next: 11, max: 11 };
    return { level: '입문자', next: 6, max: 6 };
  };

  const stampCount = userData.stampCount || 0;
  const levelInfo = getLevelInfo(stampCount);
  const current = Math.min(stampCount, levelInfo.max);
  const progress = (current / levelInfo.max) * 100;

  const badgeImages = [starter, explorer, expert, master];
  const levelLabels = ['입문자', '탐험가', '전문가', '마스터'];

  return (
    <div className="pb-[10dvh]">
      <TopBar title="마이페이지" />

      {/* 회원 정보 */}
      <div className="flex flex-col mx-[5dvw] my-[3dvh]">
        <p className="text-[#999] text-[1.6dvh] mb-[2dvh]">회원 정보</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={badgeImages[levelLabels.indexOf(levelInfo.level)]}
              className="h-[6.5dvh] w-[6.5dvh] rounded-full"
            />
            <div className="ml-[3dvw]">
              <p className="text-[2.3dvh] font-medium">{userData.nickname}</p>
              <p className="text-[1.8dvh] text-[#999]">{levelInfo.level}</p>
            </div>
          </div>
          <span className="underline text-[1.7dvh] text-[#999] pr-[1dvw]">수정</span>
        </div>
      </div>

      {/* 진척도 박스 */}
      <div className="flex flex-col mx-[5dvw] p-[2dvh] bg-[#CCCCCC]/20 rounded-xl">
        <p className="text-[1.5dvh] text-center mb-[2dvh]">
          {levelInfo.next
            ? `${levelInfo.next - stampCount}곳 더 방문하면 ${levelLabels[levelLabels.indexOf(levelInfo.level) + 1]}!`
            : "최고 레벨인 마스터에 도달했어요!"}
        </p>

        <div className="grid grid-cols-4 gap-[2dvw] justify-items-center mb-[1dvh]">
          {badgeImages.map((src, idx) => {
            const isActive = levelLabels[idx] === levelInfo.level;
            return (
              <img
                key={idx}
                src={src}
                className={`h-[5dvh] w-[5dvh] object-cover rounded-full
              border-2
              ${isActive ? 'grayscale-0 border-[#FF6100]' : 'grayscale'}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-[1dvh] px-[1dvw]">
          <span className="text-[1.4dvh] text-[#FF6100]">{levelInfo.level}</span>
          <span className="text-[1.4dvh] text-[#999]">
            {levelInfo.next ? levelLabels[levelLabels.indexOf(levelInfo.level) + 1] : ""}
          </span>
        </div>

        <div className="h-[1dvh] mt-[0.8dvh] bg-[#eee] rounded-full">
          <div
            className="h-full bg-orange-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-[1.4dvh] text-[#999] mt-[0.5dvh]">
          {`${current} / ${levelInfo.max}`}
        </p>
      </div>

      {/* 구분선 */}
      <hr className="mx-[5dvw] my-[3dvh] border-t-[1px] border-#E2E2E2" />

      {/* 설정 */}
      <div className="mx-[5dvw] mt-[1dvh]">
        <p className="text-[#999] text-[1.6dvh] mb-[2dvh]">설정</p>
        <p className="text-[1.9dvh] py-[1.5dvh] border-b border-gray-200">비밀번호 찾기</p>
        <p className="text-[1.9dvh] py-[1.5dvh] border-b border-gray-200" onClick={handleLogout}>로그아웃</p>
        <p className="text-[1.9dvh] py-[1.5dvh] border-b border-gray-200">탈퇴하기</p>
      </div>

      <MenuTabs isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
    </div>
  );
}
