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

  // İzinli e-posta listesi
  const izinliEpostalar = [
    'osmancngt003@gmail.com',
    'frkntrkcn42@hotmail.com', // Kendi epostanı ekle!
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister) {
      // Kayıt olmadan önce e-posta kontrolü
      if (!izinliEpostalar.includes(email.toLowerCase())) {
        setError(
          'Bu e-posta adresi ile kayıt olamazsınız. Lütfen yetkili kişiyle iletişime geçin.',
        );
        setLoading(false);
        return;
      }

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
      // Giriş yapmadan önce e-posta kontrolü
      if (!izinliEpostalar.includes(email.toLowerCase())) {
        setError(
          'Bu e-posta adresi ile giriş yapamazsınız. Lütfen yetkili kişiyle iletişime geçin.',
        );
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        window.location.reload();
      }
    }
    setLoading(false);
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <img
            src='/logo.png'
            alt='Gıda Arz Güvenliği Logo'
            style={{ width: '80px', height: 'auto', marginBottom: '8px' }}
          />
          <h2>Gıda Arz Güvenliği Takip Sistemi</h2>
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

        <div className='demo-login'>
          <button
            onClick={() => {
              setEmail('admin@arztakip.com');
              setPassword('demo123');
            }}
            className='demo-button'
          >
            🚀 Demo Hesap ile Giriş Yap
          </button>
          <div className='demo-info'>(admin@arztakip.com / demo123)</div>
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
