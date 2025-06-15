import { useNavigate } from "react-router-dom";
import MapButton from "../../assets/MapButton.png"
import MyPageButton from "../../assets/MyPageButton.png"
import ArchiveButton from "../../assets/ArchiveButton.png"

export default function MenuTabs() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="
      fixed bottom-0
      h-[6dvh] w-full pt-[1px]
      bg-white
      grid grid-cols-3
      text-center items-center justify-center
      z-50">
        <div className="
        flex flex-col
        items-center justify-center">
          <img src = { MapButton } className="h-[5dvh]"/>
        </div>

        <div onClick={()=>{ navigate('/archive') }} className="
        flex flex-col
        items-center justify-center">
          <img src = { ArchiveButton } className="h-[5dvh]"/>
        </div>

        <div onClick={() => { navigate('/mypage') }} className="
        flex flex-col
        items-center justify-center">
          <img src = { MyPageButton } className="h-[5dvh]"/>
        </div>
      </div>
    </div>
  );
}
