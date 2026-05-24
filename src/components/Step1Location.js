import React, { useState } from 'react';
import './Step1Location.css';

// İl ve ilçe verileri
const ilceler = {
  Niğde: ['Merkez', 'Bor', 'Ulukışla', 'Çiftlik', 'Çamardı', 'Altunhisar'],
  Konya: [
    'Selçuklu',
    'Karatay',
    'Meram',
    'Beyşehir',
    'Ereğli',
    'Akşehir',
    'Çumra',
    'Seydişehir',
    'Ilgın',
    'Karapınar',
    'Kulu',
    'Cihanbeyli',
    'Bozkır',
    'Hadim',
    'Taşkent',
    'Hüyük',
    'Kadınhanı',
    'Sarayönü',
    'Yunak',
    'Doğanhisar',
    'Derbent',
    'Emirgazi',
    'Güneysınır',
    'Altınekin',
    'Tuzlukçu',
    'Halkapınar',
    'Çeltik',
    'Ahırlı',
    'Yalıhüyük',
  ],
  Nevşehir: [
    'Merkez',
    'Ürgüp',
    'Avanos',
    'Gülşehir',
    'Derinkuyu',
    'Acıgöl',
    'Kozaklı',
    'Hacıbektaş',
  ],
};

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

  // İl değiştiğinde ilçeyi sıfırla
  const handleIlChange = (e) => {
    setIl(e.target.value);
    setIlce('');
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
        <select value={il} onChange={handleIlChange}>
          <option value='Niğde'>Niğde</option>
          <option value='Konya'>Konya</option>
          <option value='Nevşehir'>Nevşehir</option>
        </select>
      </div>

      <div className='input-group'>
        <label>İlçe</label>
        <select value={ilce} onChange={(e) => setIlce(e.target.value)}>
          <option value=''>-- İlçe Seçiniz --</option>
          {ilceler[il].map((ilceOption) => (
            <option key={ilceOption} value={ilceOption}>
              {ilceOption}
            </option>
          ))}
        </select>
      </div>

      <div className='selected-location'>
        <div className='location-icon'>📍</div>
        <div>
          <div className='location-label'>SEÇİLİ KONUM</div>
          <div className='location-value'>
            {ilce ? `${ilce}, ${il}` : 'İlçe seçilmedi'}
          </div>
          <div className='location-region'>
            {il === 'Niğde' && 'Türkiye - İç Anadolu Bölgesi'}
            {il === 'Konya' && 'Türkiye - İç Anadolu Bölgesi'}
            {il === 'Nevşehir' && 'Türkiye - Kapadokya Bölgesi'}
          </div>
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
