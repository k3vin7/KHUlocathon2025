import { useState } from 'react';
import logo from "../assets/logo.png"; // 또는 '@/assets/logo.png' 등으로 조정

export default function LoginPage({ onLoginSuccess, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAuth = async () => {
    const url = isRegister
      ? `${API_URL}/auth/register`
      : `${API_URL}/auth/login`;

    const body = isRegister
      ? { email, password, nickname }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      } else if (isRegister && data.message === '회원가입 성공') {
        alert('회원가입이 완료되었습니다. 로그인 해주세요.');
        setIsRegister(false);
        setPassword('');
        setNickname('');
      } else {
        alert(data.message || '인증 실패');
      }
    } catch (err) {
      console.error('인증 중 오류 발생:', err);
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex justify-center items-center p-4">
      <div className="relative w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="로고" className="w-24 h-auto" />
        </div>

        {/* 타이틀 */}
        <h2 className="text-center text-2xl font-bold mb-6">
          {isRegister ? '회원가입' : '로그인'}
        </h2>

        {/* 입력 필드 */}
        <input
          type="email"
          placeholder="이메일"
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister && (
          <input
            type="text"
            placeholder="닉네임"
            className="border border-gray-300 rounded-md p-2 mb-3 w-full"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}

        {/* 인증 버튼 */}
        <button
          onClick={handleAuth}
          className="bg-[#FF6100] hover:bg-orange-600 text-white w-full py-2 rounded-md font-semibold mb-3"
        >
          {isRegister ? '회원가입' : '로그인'}
        </button>

        {/* 전환 버튼 */}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-blue-500 hover:underline block mx-auto"
        >
          {isRegister
            ? '이미 계정이 있으신가요? 로그인'
            : '계정이 없으신가요? 회원가입'}
        </button>
      </div>
    </div>
  );
}
