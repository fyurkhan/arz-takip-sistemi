import React, { useState } from 'react';
import './Step2DepoType.css';

const depoTipleri = [
  {
    id: 1,
    name: 'Yer Altı Deposu',
    desc: 'Toprak altında inşa edilmiş depolama alanı',
  },
  {
    id: 2,
    name: 'Ev Altı Deposu',
    desc: 'Bina zemin katı altında bulunan depo',
  },
  {
    id: 3,
    name: 'Kara Depo',
    desc: 'Açık alanda yüzey üstü depolama yapısı',
  },
  {
    id: 4,
    name: 'Soğuk Hava Deposu',
    desc: 'Kontrollü sıcaklıkta soğutmalı depo',
  },
  {
    id: 5,
    name: 'Hangar',
    desc: 'Büyük çaplı açık yapılı hangar deposu',
  },
];

const Step2DepoType = ({ onNext, onBack, setFormData, formData }) => {
  const [selected, setSelected] = useState(formData.depoTipi || '');

  const handleNext = () => {
    if (!selected) {
      alert('Lütfen bir depo tipi seçin');
      return;
    }
    setFormData((prev) => ({ ...prev, depoTipi: selected }));
    onNext();
  };

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-icon'>🏭</div>
        <h2>Depo Tipi Seçimi</h2>
      </div>
      <p className='card-subtitle'>Kayıt edeceğiniz deponun tipini seçiniz</p>

      <div className='depo-grid'>
        {depoTipleri.map((tip) => (
          <div
            key={tip.id}
            onClick={() => setSelected(tip.name)}
            className={`depo-card ${selected === tip.name ? 'selected' : ''}`}
          >
            <div className='depo-emoji'>{tip.emoji}</div>
            <div className='depo-info'>
              <div className='depo-name'>{tip.name}</div>
              <div className='depo-desc'>{tip.desc}</div>
            </div>
            {selected === tip.name && <div className='selected-check'>✓</div>}
          </div>
        ))}
      </div>

      <div className='btn-group'>
        <button className='btn-secondary' onClick={onBack}>
          ← Geri
        </button>
        <button className='btn-primary' onClick={handleNext}>
          Devam Et →
        </button>
      </div>
    </div>
  );
};

export default Step2DepoType;
