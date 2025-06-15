import { useNavigate } from "react-router-dom";
import HomeButton from "../../assets/HomeButton.png"
import MyPageButton from "../../assets/MyPageButton.png"

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

        <div onClick={() => { navigate('/mypage') }} className="
        flex flex-col
        items-center justify-center">
            <img src = { MyPageButton } className="w-[5dvw]"/>
        </div>
      </div>
    </div>
  );
}
