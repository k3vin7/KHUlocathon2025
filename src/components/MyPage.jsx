export default function MyPage({ userData, onClose, onLogout, visible }) {
  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-[9999]
      transform transition-transform duration-300 ease-in-out
      ${visible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">마이페이지</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
      </div>

      {!userData ? (
        <p className="mt-6 text-sm text-gray-400">로딩 중...</p>
      ) : (
        <>
          <p className="mt-4">👤 <b>{userData.nickname}</b></p>
          <p className="text-sm text-gray-500">{userData.email}</p>
          <p className="mt-2 text-sm">🎖️ 칭호: {userData.title}</p>
          <p className="mt-2 text-sm">🕓 가입일: {new Date(userData.createdAt).toLocaleDateString()}</p>

          <button
            onClick={onLogout}
            className="mt-6 w-full bg-red-500 text-white text-sm py-2 rounded"
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
