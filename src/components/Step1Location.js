import React, { useState } from 'react';
import './Step1Location.css';

const Step1Location = ({ onNext, setFormData, formData }) => {
  const [il, setIl] = useState(formData.il || 'Niğde');
  const [ilce, setIlce] = useState(formData.ilce || '');

  const handleNext = () => {
    if (!ilce) {
      alert('Lütfen bir ilçe seçin');
      return;
    }
    setFormData((prev) => ({ ...prev, il, ilce }));
    onNext();
  };

  return (
    <div className='card location-card'>
      <div className='card-header'>
        <div className='card-icon'>📍</div>
        <h2>Konum Seçimi</h2>
      </div>
      <p className='card-subtitle'>Deponun bulunduğu konumu belirleyiniz</p>

      <div className='input-group'>
        <label>İl</label>
        <div className='il-input-group'>
          <input type='text' value={il} readOnly className='il-input' />
          <span className='sabit-badge'>SABİT</span>
        </div>
      </div>

      <div className='input-group'>
        <label>İlçe</label>
        <select value={ilce} onChange={(e) => setIlce(e.target.value)}>
          <option value=''>-- İlçe Seçiniz --</option>
          <option>Merkez</option>
          <option>Bor</option>
          <option>Ulukışla</option>
          <option>Çiftlik</option>
        </select>
      </div>

      <div className='selected-location'>
        <div className='location-icon'>📍</div>
        <div>
          <div className='location-label'>SEÇİLİ KONUM</div>
          <div className='location-value'>
            {ilce ? `${ilce}, ${il}` : 'İlçe seçilmedi'}
          </div>
          <div className='location-region'>Türkiye - İç Anadolu Bölgesi</div>
        </div>
      </div>

      <div className='btn-group'>
        <button className='btn-secondary'>← Geri</button>
        <button className='btn-primary' onClick={handleNext}>
          Devam Et →
        </button>
      </div>
    </div>
  );
};

export default Step1Location;
