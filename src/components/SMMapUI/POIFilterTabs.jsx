import { useState } from 'react'

const categories = ['전체', '음식점', '카페', '편의점', '병원', '약국']

export default function POIFilterTabs() {
  const [selected, setSelected] = useState('전체')

  return (
    <div className="
    flex
    overflow-x-auto
    gap-3 px-4
    scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={`
            px-4 py-2 min-w-[70px] rounded-full
            text-sm font-medium whitespace-nowrap
            transition-colors duration-200
            ${selected === cat
              ? 'bg-teal-500 text-white'
              : 'bg-white text-gray-400'}
            shadow
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
