import { useNavigate } from "react-router-dom";
import HomeButton from "../../assets/HomeButton.png"

export default function MenuTabs() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="
      fixed bottom-0
      h-[6dvh] w-full
      bg-white border border-black
      grid grid-cols-3
      text-center items-center justify-center
      z-50">
        <div className="
        flex flex-col
        items-center justify-center">
          <img src = { HomeButton } className="w-[5dvw]"/>
        </div>

        <div onClick={()=>{ navigate('/archive') }}>
          <p>아카이빙</p>
        </div>

        <div>
          <p>마이페이지</p>
        </div>
      </div>
    </div>
  );
}
