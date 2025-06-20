export default function POIFilterTabs({ category, setCategory }) {
  const categories = ['전체', '음식점', '카페', '상점', '주점', '동물병원', '산책코스'];
  return (
    <div className="flex overflow-x-auto gap-3 px-4 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`
            px-4 py-2 min-w-[70px] rounded-full
            text-sm font-medium whitespace-nowrap
            transition-colors duration-200
            ${category === cat
              ? 'bg-[#059C94] text-white shadow-inner'
              : 'bg-white text-gray-400 shadow'}
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
