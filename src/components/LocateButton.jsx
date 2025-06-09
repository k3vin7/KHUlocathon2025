import nowloc from "../assets/nowloc.png"

export default function LocateButton({ map }) {
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          const newCenter = new naver.maps.LatLng(lat, lng)
          map.setCenter(newCenter)
        },
        (err) => {
          alert("위치 정보를 가져올 수 없습니다.")
          console.error(err)
        }
      )
    } else {
      alert("브라우저가 위치 정보를 지원하지 않아요.")
    }
  }

  return (
    <button
      onClick={moveToCurrentLocation}
      className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center z-40"
    >
      <img src={ nowloc } alt="현위치" className="w-6 h-6" />
    </button>
  )
}
