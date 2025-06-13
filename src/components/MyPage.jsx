export default function MyPage({ userData, visible, onClose, onLogout }) {
  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-[9999]
      transform transition-transform duration-300 ease-in-out
      ${visible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">마이페이지</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
      </div>

      {!userData ? (
        <p className="text-sm text-gray-400">로딩 중...</p>
      ) : (
        <>
          {/* 프로필 카드 */}
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 bg-white shadow">
              <img
                src="/potato-icon.png"
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-semibold text-lg">{userData.nickname}</p>
            <p className="text-sm text-gray-500">{userData.email}</p>

            {/* 칭호 */}
            <p className="mt-2 text-sm">🎖️ 칭호: {userData.title}</p>
            {/* 가입일 */}
            <p className="mt-1 text-sm text-gray-600">
              🕓 가입일: {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* 요약 정보 */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">활동 요약</h3>
            <div className="grid grid-cols-2 text-center text-sm">
              <div>
                <p className="text-green-600 font-bold">{userData.stampCount ?? 0}개</p>
                <p className="text-gray-600 text-xs">획득한 스탬프</p>
              </div>
              <div>
                <p className="text-green-600 font-bold">2건</p>
                <p className="text-gray-600 text-xs">참여 프로젝트</p>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
              팀 프로젝트 찾아보기
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded">
              프로필 수정
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}
