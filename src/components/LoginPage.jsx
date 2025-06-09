import { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleAuth = async () => {
  const url = isRegister
    ? 'http://localhost:5000/auth/register'
    : 'http://localhost:5000/auth/login';

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
      onLoginSuccess(); // 로그인 성공 시 부모 컴포넌트에 알림
    } else if (isRegister && data.message === '회원가입 성공') {
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      setIsRegister(false); // 로그인 창으로 전환
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
    <div className="absolute inset-0 bg-white z-50 flex flex-col justify-center items-center p-6">
      <h2 className="text-xl font-bold mb-4">
        {isRegister ? '회원가입' : '로그인'}
      </h2>

      <input
        type="email"
        placeholder="이메일"
        className="border p-2 mb-2 w-full max-w-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호"
        className="border p-2 mb-2 w-full max-w-sm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegister && (
        <input
          type="text"
          placeholder="닉네임"
          className="border p-2 mb-2 w-full max-w-sm"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      )}

      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
      >
        {isRegister ? '회원가입' : '로그인'}
      </button>

      <button
        onClick={() => setIsRegister(!isRegister)}
        className="text-sm text-blue-500"
      >
        {isRegister
          ? '이미 계정이 있으신가요? 로그인'
          : '계정이 없으신가요? 회원가입'}
      </button>
    </div>
  );
}
