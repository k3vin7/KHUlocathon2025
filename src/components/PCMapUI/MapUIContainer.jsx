import logo from "../../assets/logo.png"
import POIFilterTabs from "./POIFilterTabs"
import MenuTabs from "../SMMapUI/MenuTabs";

export default function MapUIContainer({ isLoggedIn, onLoginClick }) {
  return (
    <div className="absolute top-0 left-0 w-[80px] h-full bg-white z-10 shadow">
        <img src={ logo }/>
        <POIFilterTabs /> 
        <MenuTabs isLoggedIn={isLoggedIn} onLoginClick={onLoginClick} />
    </div>
  );
}
