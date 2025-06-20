import BackIcon from '../../assets/backicon.png';
import master from '../../assets/마스터.png';
import experts from '../../assets/전문가.png';
import explorer from '../../assets/탐험가.png';
import beginner from '../../assets/입문자.png';

const getBadge = (title) => {
  if (!title) return null;
  if (title.includes('입문자')) return beginner;
  if (title.includes('탐험가')) return explorer;
  if (title.includes('전문가')) return experts;
  if (title.includes('마스터')) return master;
  return null;
};

export default function ImageOverlay({
  archives,
  selectedIndex,
  onClose,
  setSelectedIndex,
  userInfo,
  myUserId,
  onDelete,
}) {
  if (selectedIndex === null) return null;
  const archive = archives[selectedIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      {/* 상단 컨트롤 */}
      <div
        className="flex justify-between items-center w-full px-4 mb-2 text-[#CCCCCC] text-[14px] font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => setSelectedIndex(i => i > 0 ? i - 1 : i)}>
          <img src={BackIcon} alt="prev" className="w-7 h-7" />
        </button>
        <span>{selectedIndex + 1} / {archives.length}</span>
        <button onClick={() => setSelectedIndex(i => i < archives.length - 1 ? i + 1 : i)}>
          <img src={BackIcon} alt="next" className="w-7 h-7 -scale-x-100" />
        </button>
      </div>

      {/* 이미지 본문 */}
      <img
        src={archive.photoUrl}
        alt="zoomed"
        className="max-w-[90%] max-h-[70%]"
        onClick={(e) => e.stopPropagation()}
      />

      {/* 이미지 하단 정보 */}
      <div
        className="w-full px-4 mt-2 text-white text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="mr-1 text-[12px] text-[#CCCCCC]">{archive.date}</span>
            <span className="text-[12px] text-[#CCCCCC]">|</span>
            <span className="text-[13px] font-semibold ml-1">{archive.placeName}</span>
          </div>

          {myUserId && userInfo && userInfo._id === myUserId && (
            <button
              className="text-[13px] text-[#CCCCCC] underline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(archive._id);
              }}
            >
              삭제
            </button>
          )}
        </div>

        {userInfo && (
          <div className="flex items-center gap-2 text-white mt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 space-x-1">
                {getBadge(userInfo.title) && (
                  <img src={getBadge(userInfo.title)} alt="badge" className="w-5 h-5" />
                )}
                <span className="text-[14px] font-medium">{userInfo.nickname}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
