export default function TopBar({ title }) {
  return (
    <div className="sticky top-0 left-0 w-full h-[6vh] bg-white bg-opacity-80 z-10 shadow flex items-center justify-between px-4">
      <h1 className="font-santokki text-[#FF6100] text-[20px]">{title}</h1>
    </div>
  );
}
