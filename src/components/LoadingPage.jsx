import logo from "../assets/logo.png"

export default function LoadingPage() {
  return (
    <div className="
    fixed inset-0
    bg-white
    flex flex-col
    items-center justify-center z-50">
      <img src={ logo } className="w-[30vw]"/>
      <h1>산책 준비하는 중...</h1>
    </div>
  );
}
