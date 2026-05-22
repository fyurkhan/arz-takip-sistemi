import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister) {
      // Kayıt işlemi
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsRegister(false);
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } else {
      // Giriş işlemi
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // Giriş başarılı - session otomatik olarak App.js'de yakalanacak
        window.location.reload(); // Sayfayı yenile, App.js session'ı alsın
      }
    }
    setLoading(false);
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <div className='auth-icon'>🔐</div>
          <h2>Arz Güvenliği Takip Sistemi</h2>
          <p>Gevher & Positive Mühendislik Şirketler Grubu</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className='input-group'>
              <label>Ad Soyad</label>
              <input
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder='Ad Soyad'
                required
              />
            </div>
          )}

          <div className='input-group'>
            <label>E-posta Adresi</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='ornek@firma.com'
              required
            />
          </div>

          <div className='input-group'>
            <label>Şifre</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              required
            />
          </div>

          {error && <div className='auth-error'>{error}</div>}

          <button type='submit' className='auth-button' disabled={loading}>
            {loading ? 'İşleniyor...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>

        <div className='auth-footer'>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className='auth-switch'
          >
            {isRegister
              ? 'Zaten hesabın var mı? Giriş yap'
              : 'Hesabın yok mu? Kayıt ol'}
          </button>
        </div>

        <div className='auth-status'>
          <span className='status-dot'></span>
          Supabase Bağlantısı: Aktif
        </div>

        <div className='auth-footer-text'>
          Gevher & Positive Mühendislik Şirketler Grubu · Güvenli Altyapı
        </div>
      </div>
    </div>
  );
};

export default Login;
