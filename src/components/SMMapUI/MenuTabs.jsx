import { useNavigate, useLocation } from "react-router-dom";
import MapButton from "../../assets/MapButton.png";
import CoMapButton from "../../assets/CoMapButton.png";
import ArchiveButton from "../../assets/ArchiveButton.png";
import CoArchiveButton from "../../assets/CoArchiveButton.png";
import MyPageButton from "../../assets/MyPageButton.png";
import CoMyPageButton from "../../assets/CoMyPageButton.png";

export default function MenuTabs({ isLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="
      fixed bottom-0 h-[8dvh] w-full pt-[1px] pb-[2dvh]
      bg-white grid grid-cols-3
      text-center items-center justify-center z-50"
    >
      {/* 맵 */}
      <div
        className="flex flex-col items-center justify-center"
        onClick={() => navigate("/")}
      >
        <img
          src={path === "/" ? CoMapButton : MapButton}
          className="h-[5dvh]"
        />
      </div>

      {/* 아카이브 */}
      <div
        className="flex flex-col items-center justify-center"
        onClick={() => isLoggedIn? navigate( "/archive"): <LoginPage />}
      >
        <img
          src={path === "/archive" ? CoArchiveButton : ArchiveButton}
          className="h-[5dvh]"
        />
      </div>

      {/* 마이페이지 */}
      <div
        className="flex flex-col items-center justify-center"
        onClick={() => navigate(`${isLoggedIn? "/mypage": "/LoginPage"}`)}
      >
        <img
          src={path === "/mypage" ? CoMyPageButton : MyPageButton}
          className="h-[5dvh]"
        />
      </div>
    </div>
  );
}
