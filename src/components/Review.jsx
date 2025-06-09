import { useState, useEffect } from 'react';

export default function Review({ placeId, API_URL }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/places/${placeId}/reviews`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
      else setReviews([]);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;
    try {
      const res = await fetch(`${API_URL}/places/${placeId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newReview }),
      });
      if (!res.ok) throw new Error();
      setNewReview('');
      fetchReviews();
    } catch (err) {
      alert('리뷰 작성 실패');
    }
  };

  useEffect(() => {
    if (placeId) fetchReviews();
  }, [placeId]);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-1">✍️ 리뷰 작성</h4>
      <textarea
        rows={3}
        className="w-full border rounded-md p-2 text-sm"
        placeholder="이 장소에 대해 어떤 생각을 하시나요?"
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />
      <button
        onClick={handleReviewSubmit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        제출
      </button>

      <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">리뷰가 없습니다.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b pb-2">
              <p className="text-sm"><b>{r.author}</b> · {new Date(r.createdAt).toLocaleDateString()}</p>
              <p className="text-sm mt-1">{r.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
