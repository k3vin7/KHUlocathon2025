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
      fixed bottom-0 h-[8dvh] w-full px-[2dvh]
     bg-white grid grid-cols-3
      text-center items-center justify-center z-50
      shadow-[0_-2px_4px_rgba(0,0,0,0.08)]"
    >
      <div
        className="flex flex-col items-center justify-center"
        onClick={() => navigate("/")}
      >
        <img
          src={path === "/" ? CoMapButton : MapButton}
          className="h-[5dvh]"
          alt="Map"
        />
      </div>

      <div
        className="flex flex-col items-center justify-center"
        onClick={() => {
          isLoggedIn ? navigate("/archive") : onLoginClick();
        }}
      >
        <img
          src={path === "/archive" ? CoArchiveButton : ArchiveButton}
          className="h-[5dvh]"
          alt="Archive"
        />
      </div>

      <div
        className="flex flex-col items-center justify-center"
        onClick={() => {
          isLoggedIn ? navigate("/mypage") : onLoginClick();
        }}
      >
        <img
          src={path === "/mypage" ? CoMyPageButton : MyPageButton}
          className="h-[5dvh]"
          alt="MyPage"
        />
      </div>
    </div>
  );
}
