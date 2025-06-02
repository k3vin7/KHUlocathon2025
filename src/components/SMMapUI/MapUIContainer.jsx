import logo from "../../assets/logo.png"
import SearchHeader from "./SearchHeader"
import POIFilterTabs from "./POIFilterTabs"

export default function MapUIContainer() {
  return (
    <div>
      <div className="
      absolute
      flex
      top-0
      h-[44px] w-full
      bg-white z-10 shadow">
        <SearchHeader />
      </div>
      <div className="absolute top-[60px] left-0 w-full z-10 p-2">
        <POIFilterTabs />
      </div>

    </div>

  );
}
