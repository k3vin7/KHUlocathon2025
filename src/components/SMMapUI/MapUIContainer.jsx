import SearchHeader from "./SearchHeader";
import POIFilterTabs from "./POIFilterTabs";

export default function MapUIContainer({ isLoggedIn, onLoginClick, onMyPageClick }) {
  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-[44px] bg-white z-10 shadow flex items-center justify-between px-4">
        <SearchHeader />
        <div>
          {isLoggedIn ? (
            <button
              onClick={onMyPageClick}
              className="text-sm bg-white px-3 py-1 rounded border shadow"
            >
              MY
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded shadow"
            >
              로그인
            </button>
          )}
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="absolute top-[60px] left-0 w-full z-10 p-2">
        <POIFilterTabs />
      </div>
    </div>
  );
}
