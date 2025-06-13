import FLogo from "../assets/FullLogo.png"
import spinner from "../assets/spinner.gif"

export default function LoadingPage() {
  return (
    <div>
      <div className="
      fixed
      inset-0
      bg-white
      flex
      items-center justify-center z-50">
        <img src={ FLogo } className="fixed h-[34vh]"/>
      </div>
      <div className="
      fixed
      bottom-10 right-20
      bg-white
      flex
      items-center justify-center z-50">
        <img src={ spinner } className="fixed h-[20vh]"/>
      </div>
    </div>

  );
}

