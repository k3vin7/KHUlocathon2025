import { useState } from "react";
import MenuTabs from "./MenuTabs";
import POIFilterTabs from "./POIFilterTabs";
import TopBar from "./TopBar";

export default function SMMapUIContainer({ isLoggedIn, onLoginClick }) {
  const [category, setCategory] = useState("전체");

  return (
    <div>
      <TopBar title="댕궁지도" />

      <div className="absolute top-[60px] left-0 w-full z-10 p-2">
        <POIFilterTabs category={category} setCategory={setCategory} />
      </div>
    </div>
  );
}
