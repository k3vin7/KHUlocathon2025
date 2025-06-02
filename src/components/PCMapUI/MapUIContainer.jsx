import logo from "../../assets/logo.png"
import SearchHeader from "./SearchHeader"
import POIFilterTabs from "./POIFilterTabs"

export default function MapUIContainer() {
  return (
    <div className="absolute top-0 left-0 w-[80px] h-full bg-white z-10 shadow">
        <img src={ logo }/>
        <SearchHeader />
        <POIFilterTabs /> 
    </div>
  );
}
