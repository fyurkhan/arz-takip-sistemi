import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabaseClient';
import Login from './components/Login';
import Step1Location from './components/Step1Location';
import Step2DepoType from './components/Step2DepoType';
import Step3Details from './components/Step3Details';
import Step4List from './components/Step4List';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kayit'); // 'kayit' veya 'rapor'
  const [formData, setFormData] = useState({
    il: 'Niğde',
    ilce: '',
    depoTipi: '',
    maxKapasite: '',
    guncelTon: '',
    firmaAdi: '',
    adres: '',
    telefon: '',
    urunler: [],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFormData({
      il: 'Niğde',
      ilce: '',
      depoTipi: '',
      maxKapasite: '',
      guncelTon: '',
      firmaAdi: '',
      adres: '',
      telefon: '',
      urunler: [],
    });
    setStep(1);
    setActiveTab('kayit');
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const resetForm = () => {
    setFormData({
      il: 'Niğde',
      ilce: '',
      depoTipi: '',
      maxKapasite: '',
      guncelTon: '',
      firmaAdi: '',
      adres: '',
      telefon: '',
      urunler: [],
    });
    setStep(1);
  };

  const steps = ['Konum', 'Depo Tipi', 'Detaylar', 'Liste'];

  if (loading) {
    return (
      <div className='auth-container'>
        <div className='auth-card' style={{ textAlign: 'center' }}>
          <div className='auth-icon'>🔄</div>
          <h2>Yükleniyor...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className='app-container'>
      <div className='app-header'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src='/logo.png'
              alt='Logo'
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
            <div>
              <h1>Gıda Arz Güvenliği Takip Sistemi</h1>
              <p>Gevher & Positive Mühendislik Şirketler Grubu</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span
              style={{
                color: 'white',
                fontSize: '0.85rem',
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: '30px',
              }}
            >
              👤 {user.user_metadata?.full_name || user.email}
            </span>
            <button onClick={handleLogout} className='logout-btn'>
              🚪 Çıkış Yap
            </button>
          </div>
        </div>

        {/* Tab Menü */}
        <div className='tab-menu'>
          <button
            className={`tab-btn ${activeTab === 'kayit' ? 'active' : ''}`}
            onClick={() => setActiveTab('kayit')}
          >
            📝 Depo Kayıt
          </button>
          <button
            className={`tab-btn ${activeTab === 'rapor' ? 'active' : ''}`}
            onClick={() => setActiveTab('rapor')}
          >
            📊 Analiz & Rapor
          </button>
        </div>
      </div>

      {activeTab === 'kayit' ? (
        <>
          <div className='steps-indicator'>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className='step-item'>
                  <div
                    className={`step-circle ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}
                  >
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <div
                    className={`step-label ${step === i + 1 ? 'active' : ''}`}
                  >
                    {s}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`step-line ${step > i + 1 ? 'completed' : ''}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className='app-main'>
            {step === 1 && (
              <Step1Location
                onNext={nextStep}
                setFormData={setFormData}
                formData={formData}
              />
            )}
            {step === 2 && (
              <Step2DepoType
                onNext={nextStep}
                onBack={prevStep}
                setFormData={setFormData}
                formData={formData}
              />
            )}
            {step === 3 && (
              <Step3Details
                onNext={nextStep}
                onBack={prevStep}
                setFormData={setFormData}
                formData={formData}
              />
            )}
            {step === 4 && (
              <Step4List formData={formData} onReset={resetForm} user={user} />
            )}
          </div>
        </>
      ) : (
        <Reports />
      )}
    </div>
  );
}

export default App;
