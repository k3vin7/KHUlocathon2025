import { useNavigate } from "react-router-dom";
import MenuTabs from "./SMMapUI/MenuTabs";

export default function MyPage({ userData, onLogout }) {
  if (!userData) return <p className="p-4 text-gray-500"></p>;

  // 칭호별 뱃지 이미지 매핑
  const badgeMap = {
    '👑댕궁동 마스터': '/마스터.png',
    '🌟댕궁동 전문가': '/전문가.png',
    '🗺️댕궁동 탐험가': '/탐험가.png',
    '🐾댕궁동 입문자': '/입문자.png'
  };

  const navigate = useNavigate();

  const Logout = () => {
    onLogout();
    navigate('/');
  }

  const badgeSrc = badgeMap[userData.title] || '/badges/default.png';

  return (
    <div>
      <div className="max-w-xl mx-auto p-6">
        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-6">마이페이지</h2>

        {/* 프로필 카드 */}
        <div className="bg-gray-100 rounded-xl p-6 text-center shadow-sm">
          {/* 프로필 이미지 */}
          <div className="w-24 h-24 mx-auto rounded-full bg-white border mb-3 flex items-center justify-center text-gray-400 text-sm">
            프로필
          </div>

          {/* 사용자 기본 정보 */}
          <p className="text-xl font-semibold">{userData.nickname}</p>
          <p className="text-sm text-gray-500">{userData.email}</p>

          {/* 칭호 및 가입일 */}
          <div className="mt-3 text-sm text-gray-800">
            <p>
              🏅 <b>칭호:</b> {userData.title || '없음'}
            </p>
            <p>
              🕓 <b>가입일:</b> {new Date(userData.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* 칭호 뱃지 이미지 */}
          <div className="mt-4">
            <img
              src={badgeSrc}
              alt="칭호 뱃지"
              className="mx-auto w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* 활동 요약 */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-1">활동 요약</p>
          <p className="text-green-600 text-lg font-bold">
            {userData.stampCount ?? 0}개
          </p>
          <p className="text-sm text-gray-600">획득한 스탬프</p>
        </div>

        {/* 버튼들 */}
        <div className="mt-6 space-y-3">
          <button className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded text-sm">
            프로필 수정
          </button>
          <button
            onClick={Logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
      <MenuTabs />
    </div>
  );
}
