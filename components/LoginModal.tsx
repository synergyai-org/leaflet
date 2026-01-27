
import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (id: string, pw: string) => Promise<boolean>;
  onClose: () => void;
  bgColor: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, bgColor }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await onLogin(id, pw);
    if (!success) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div 
        className="w-full max-w-md border border-[#B0925A]/30 p-10 rounded-sm shadow-2xl relative"
        style={{ backgroundColor: bgColor }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">✕</button>
        
        <div className="text-center mb-10">
          <h2 className="font-['Merriweather'] text-[#B0925A] text-2xl font-light mb-2">CMS LOGIN</h2>
          <p className="text-[10px] tracking-[3px] text-white/40 uppercase">Authorized Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] tracking-[2px] text-white/50 mb-2 uppercase">Admin ID</label>
            <input 
              required
              type="text" 
              value={id}
              onChange={e => setId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#B0925A] transition-colors"
              placeholder="Enter ID"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] text-white/50 mb-2 uppercase">Password</label>
            <input 
              required
              type="password" 
              value={pw}
              onChange={e => setPw(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#B0925A] transition-colors"
              placeholder="Enter Password"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#B0925A] hover:bg-[#E1B16A] text-black font-bold py-4 rounded-sm transition-all tracking-[4px] disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
