import React, { useState } from 'react';
import './Step3Details.css';

// Ürün kategorileri ve alt seçenekleri
const urunKategorileri = [
  {
    anaUrun: 'Patates',
    icon: '🥔',
    secenekler: [
      { value: 'Patates (Yemelik)', label: 'Yemelik' },
      { value: 'Patates (Tohumluk)', label: 'Tohumluk' },
    ],
  },
  {
    anaUrun: 'Soğan',
    icon: '🧅',
    secenekler: [
      { value: 'Soğan (İlaçlı)', label: 'İlaçlı' },
      { value: 'Soğan (İlaçsız)', label: 'İlaçsız' },
    ],
  },
  {
    anaUrun: 'Buğday',
    icon: '🌾',
    secenekler: [
      { value: 'Buğday (Yemelik)', label: 'Yemelik' },
      { value: 'Buğday (Tohumluk)', label: 'Tohumluk' },
    ],
  },
  {
    anaUrun: 'Elma',
    icon: '🍎',
    secenekler: [
      { value: 'Elma (İlaçlı)', label: 'İlaçlı' },
      { value: 'Elma (İlaçsız)', label: 'İlaçsız' },
    ],
  },
];

const Step3Details = ({ onNext, onBack, setFormData, formData }) => {
  const [maxKapasite, setMaxKapasite] = useState(formData.maxKapasite || '');
  const [guncelTon, setGuncelTon] = useState(formData.guncelTon || '');
  const [firmaAdi, setFirmaAdi] = useState(formData.firmaAdi || '');
  const [adres, setAdres] = useState(formData.adres || '');
  const [telefon, setTelefon] = useState(formData.telefon || '');
  const [selectedUrunler, setSelectedUrunler] = useState(
    formData.urunler || [],
  );
  const [acikKategoriler, setAcikKategoriler] = useState({});

  // Kategori aç/kapa
  const toggleKategori = (anaUrun) => {
    setAcikKategoriler((prev) => ({
      ...prev,
      [anaUrun]: !prev[anaUrun],
    }));
  };

  // Alt seçenek seçme
  const toggleSecenek = (secenekValue) => {
    if (selectedUrunler.includes(secenekValue)) {
      setSelectedUrunler(selectedUrunler.filter((u) => u !== secenekValue));
    } else {
      setSelectedUrunler([...selectedUrunler, secenekValue]);
    }
  };

  const handleNext = () => {
    if (
      !maxKapasite ||
      !guncelTon ||
      !firmaAdi ||
      !adres ||
      !telefon ||
      selectedUrunler.length === 0
    ) {
      alert('Lütfen tüm alanları doldurun ve en az bir ürün seçin');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      maxKapasite,
      guncelTon,
      firmaAdi,
      adres,
      telefon,
      urunler: selectedUrunler,
    }));
    onNext();
  };

  const dolulukOrani =
    maxKapasite && guncelTon ? Math.round((guncelTon / maxKapasite) * 100) : 0;

  return (
    <div className='card details-card'>
      <div className='card-header'>
        <div className='card-icon'>📋</div>
        <h2>Detay Bilgiler</h2>
      </div>
      <p className='card-subtitle'>
        Depo ve firma bilgilerini eksiksiz doldurunuz
      </p>

      <div className='form-grid'>
        <div className='input-group'>
          <label>Maks. Kapasite (ton)</label>
          <input
            type='number'
            value={maxKapasite}
            onChange={(e) => setMaxKapasite(e.target.value)}
            placeholder='Ör. 500'
          />
        </div>
        <div className='input-group'>
          <label>Güncel Ton (ton)</label>
          <input
            type='number'
            value={guncelTon}
            onChange={(e) => setGuncelTon(e.target.value)}
            placeholder='Ör. 320'
          />
        </div>
        <div className='input-group full-width'>
          <label>Firma / Kişi Adı</label>
          <input
            value={firmaAdi}
            onChange={(e) => setFirmaAdi(e.target.value)}
            placeholder='Ör. Kaya Tarım Ltd. Şti.'
          />
        </div>
        <div className='input-group full-width'>
          <label>Adres / Ada-Parsel</label>
          <input
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            placeholder='Ör. Bor İlçesi, 120 Ada, 15 Parsel — Niğde'
          />
        </div>
        <div className='input-group full-width'>
          <label>Telefon Numarası</label>
          <input
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder='Ör. 0532 123 45 67'
          />
        </div>

        {/* Ürün Seçimi - Kategorili */}
        <div className='input-group full-width'>
          <label>Depolanan Ürünler</label>
          <div className='urun-kategori-container'>
            {urunKategorileri.map((kategori) => (
              <div key={kategori.anaUrun} className='kategori-item'>
                <div
                  className={`kategori-baslik ${acikKategoriler[kategori.anaUrun] ? 'acik' : ''}`}
                  onClick={() => toggleKategori(kategori.anaUrun)}
                >
                  <span className='kategori-icon'>{kategori.icon}</span>
                  <span className='kategori-ad'>{kategori.anaUrun}</span>
                  <span className='kategori-ok'>
                    {acikKategoriler[kategori.anaUrun] ? '▲' : '▼'}
                  </span>
                </div>

                {acikKategoriler[kategori.anaUrun] && (
                  <div className='kategori-secenekler'>
                    {kategori.secenekler.map((secenek) => (
                      <button
                        key={secenek.value}
                        type='button'
                        onClick={() => toggleSecenek(secenek.value)}
                        className={`secenek-btn ${selectedUrunler.includes(secenek.value) ? 'selected' : ''}`}
                      >
                        <span className='secenek-check'>
                          {selectedUrunler.includes(secenek.value) ? '✓' : '○'}
                        </span>
                        <span>{secenek.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Seçilen ürünlerin listesi */}
          {selectedUrunler.length > 0 && (
            <div className='selected-urunler'>
              <div className='selected-title'>Seçilen Ürünler:</div>
              <div className='selected-tags'>
                {selectedUrunler.map((urun) => (
                  <span key={urun} className='selected-tag'>
                    {urun}
                    <button
                      className='remove-tag'
                      onClick={() =>
                        setSelectedUrunler(
                          selectedUrunler.filter((u) => u !== urun),
                        )
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doluluk göstergesi */}
      {maxKapasite && guncelTon && (
        <div className='capacity-bar'>
          <div className='capacity-header'>
            <span>Doluluk Oranı</span>
            <span className='capacity-value'>{dolulukOrani}%</span>
          </div>
          <div className='progress-bar'>
            <div
              className='progress-fill'
              style={{ width: `${dolulukOrani}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Kayıt özeti */}
      <div className='summary-box'>
        <div className='summary-title'>📌 KAYIT ÖZETİ</div>
        <div className='summary-grid'>
          <div className='summary-label'>Konum:</div>
          <div>
            {formData.ilce || '?'}, {formData.il || 'Niğde'}
          </div>
          <div className='summary-label'>Depo Tipi:</div>
          <div>{formData.depoTipi || '-'}</div>
          <div className='summary-label'>Firma:</div>
          <div>{firmaAdi || '-'}</div>
          <div className='summary-label'>Ürünler:</div>
          <div>{selectedUrunler.join(', ') || '-'}</div>
        </div>
      </div>

      <div className='btn-group'>
        <button className='btn-secondary' onClick={onBack}>
          ← Geri
        </button>
        <button className='btn-primary' onClick={handleNext}>
          Kaydet & Listele →
        </button>
      </div>
    </div>
  );
};

export default Step3Details;
