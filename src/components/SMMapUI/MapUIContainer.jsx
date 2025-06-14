import MenuTabs from "./MenuTabs";
import SearchHeader from "./MenuTabs";
import POIFilterTabs from "./POIFilterTabs";
import { useNavigate } from "react-router-dom";

export default function MapUIContainer({ isLoggedIn, onLoginClick, onMyPageClick }) {
  const navigate = useNavigate();
  
  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-[6vh] bg-white bg-opacity-80 z-10 shadow flex items-center justify-between px-4">
          <h1 className="
            font-santokki text-[#FF6100] text-[20px]">
              댕궁지도</h1>
          <div> 
          {isLoggedIn ? (
            <button
              onClick={handleMyPageClick}
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

      <div className="absolute top-[60px] left-0 w-full z-10 p-2">
        <POIFilterTabs />
      </div>
      <div className="absolute bottom-[20px] left-0 w-full z-50">
        <MenuTabs />
      </div>
    </div>
  );
}
