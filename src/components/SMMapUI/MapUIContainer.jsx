import logo from "../../assets/logo.png"
import SearchHeader from "./SearchHeader"
import POIFilterTabs from "./POIFilterTabs"

export default function MapUIContainer() {
  return (
    <div className="
    absolute
    flex
    top-0
    h-[44px] w-full
    bg-white z-10 shadow">
        <img src={ logo } />
        <SearchHeader />
        <POIFilterTabs /> 
    </div>
  );
}
