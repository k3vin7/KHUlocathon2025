import MenuTabs from "./MenuTabs";
import POIFilterTabs from "./POIFilterTabs";
import TopBar from "./TopBar";

export default function MapUIContainer({ isLoggedIn, onLoginClick, category, setCategory }) {
  return (
    <div>
      <div className="absolute top-[60px] left-0 w-full z-10 p-2">
        <POIFilterTabs category={category} setCategory={setCategory} />
      </div>
      <MenuTabs isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
    </div>
  );
}
