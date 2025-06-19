import nowloc from "../assets/nowloc.png";

export default function LocateButton({ map, currentPosition }) {
  const moveToCurrentLocation = () => {
    if (!map || !currentPosition) {
      alert("위치 정보가 없습니다.");
      return;
    }

    const { lat, lng } = currentPosition;
    const newCenter = new naver.maps.LatLng(lat, lng);
    map.setCenter(newCenter);
  };

  return (
    <button
      onClick={moveToCurrentLocation}
      className="absolute right-4 bottom-[16dvh]
      w-12 h-12 bg-white rounded-full shadow flex items-center justify-center z-40">
      <img src={nowloc} alt="현위치" className="w-6 h-6" />
    </button>
  );
}
