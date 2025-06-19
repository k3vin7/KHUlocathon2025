import { useEffect, useState } from 'react';
import MenuTabs from './SMMapUI/MenuTabs';

 const API_URL = import.meta.env.VITE_API_URL;

export default function ArchivePage({ onLoginClick }) {
  const [view, setView] = useState('mine'); // 'mine' or 'all'
  const [myArchives, setMyArchives] = useState([]);
  const [allArchives, setAllArchives] = useState([]);

  const fetchMyArchives = async () => {
    try {
      const res = await fetch(`${API_URL}/archives/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setMyArchives(data);
    } catch (err) {
      console.error('내 아카이브 불러오기 실패', err);
    }
  };

  const fetchAllArchives = async () => {
    try {
      const res = await fetch(`${API_URL}/archives/all`);
      const data = await res.json();
      setAllArchives(data);
    } catch (err) {
      console.error('전체 아카이브 불러오기 실패', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirm) return;

    try {
        await fetch(`${API_URL}/archives/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        });
        fetchMyArchives(); // 다시 불러오기
    } catch (err) {
        console.error('삭제 실패', err);
    }
    };


  useEffect(() => {
    if (view === 'mine') fetchMyArchives();
    else fetchAllArchives();
  }, [view]);

  const archives = view === 'mine' ? myArchives : allArchives;

  return (
    <div>
      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${view === 'mine' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('mine')}
          >
            내 아카이빙
          </button>
          <button
            className={`px-4 py-2 rounded ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('all')}
          >
            전체 아카이빙
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {archives.length === 0 ? (
            <p className="text-center col-span-2 text-gray-500">아카이빙된 사진이 없습니다.</p>
          ) : (
            archives.map((a) => (
              <div key={a._id} className="relative border rounded overflow-hidden">
                <img src={a.photoUrl} alt="archive" className="w-full h-40 object-cover" />
                {view === 'mine' && (
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <MenuTabs isLoggedIn={!!localStorage.getItem('token')} onLoginClick={onLoginClick} />
    </div>
  );
}
