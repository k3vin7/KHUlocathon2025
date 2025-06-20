import { useNavigate, useLocation } from "react-router-dom";
import MapButton from "../../assets/MapButton.png";
import CoMapButton from "../../assets/CoMapButton.png";
import ArchiveButton from "../../assets/ArchiveButton.png";
import CoArchiveButton from "../../assets/CoArchiveButton.png";
import MyPageButton from "../../assets/MyPageButton.png";
import CoMyPageButton from "../../assets/CoMyPageButton.png";

export default function MenuTabs({ isLoggedIn = false, onLoginClick = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="
      fixed bottom-0 w-full py-[10px]
      bg-white grid grid-cols-3
      items-center justify-center text-center z-50
      shadow-[0_-2px_4px_rgba(0,0,0,0.08)]
    ">
      {/* 지도 탭 */}
      <div className="flex flex-col items-center space-y-[4px]" onClick={() => navigate("/")}>
        <img
          src={path === "/" ? CoMapButton : MapButton}
          className="h-[24px]"
          alt="Map"
        />
      </div>

      {/* 아카이브 탭 */}
      <div
        className="flex flex-col items-center space-y-[4px]"
        onClick={() => isLoggedIn ? navigate("/archive") : onLoginClick()}
      >
        <img
          src={path === "/archive" ? CoArchiveButton : ArchiveButton}
          className="h-[24px]"
          alt="Archive"
        />
      </div>

      {/* 마이페이지 탭 */}
      <div
        className="flex flex-col items-center space-y-[4px]"
        onClick={() => isLoggedIn ? navigate("/mypage") : onLoginClick()}
      >
        <img
          src={path === "/mypage" ? CoMyPageButton : MyPageButton}
          className="h-[24px]"
          alt="MyPage"
        />
      </div>
    </div>
  );
}
