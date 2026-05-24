import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generateDepoPDF } from '../utils/pdfGenerator';
import './Step4List.css';

const Step4List = ({ formData, onReset, user }) => {
  const [kayitlar, setKayitlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const kaydedildiMi = useRef(false);
  const sonKayitRef = useRef(null); // Son kaydedilen veriyi tut

  // Veritabanından kayıtları çek
  const fetchKayitlar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kayitlar')
      .select('*')
      .order('kayit_tarihi', { ascending: false });

    if (error) {
      console.error('Kayıtlar yüklenirken hata:', error);
    } else {
      setKayitlar(data || []);
    }
    setLoading(false);
  };

  // Sayfa yüklendiğinde kayıtları getir
  useEffect(() => {
    fetchKayitlar();
  }, []);

  // Yeni kayıt eklendiğinde veritabanına kaydet (SADECE 1 KERE)
  useEffect(() => {
    const saveToDatabase = async () => {
      // Form boşsa çık
      if (!formData.firmaAdi || formData.firmaAdi === '') return;
      if (!user) return;

      // Bu kaydın daha önce kaydedilip kaydedilmediğini kontrol et
      const kayitAnahtari = `${formData.firmaAdi}_${formData.ilce}_${formData.maxKapasite}_${formData.guncelTon}_${formData.urunler.join(',')}`;

      // Eğer aynı kayıt daha önce kaydedildiyse çık
      if (sonKayitRef.current === kayitAnahtari) return;
      if (kaydedildiMi.current) return;

      // Kaydedildi olarak işaretle
      kaydedildiMi.current = true;
      sonKayitRef.current = kayitAnahtari;

      const yeniKayit = {
        user_id: user.id,
        firma_adi: formData.firmaAdi,
        il: formData.il,
        ilce: formData.ilce,
        depo_tipi: formData.depoTipi,
        max_kapasite: parseInt(formData.maxKapasite),
        guncel_ton: parseInt(formData.guncelTon),
        adres: formData.adres,
        telefon: formData.telefon,
        urunler: formData.urunler,
        kayit_tarihi: new Date().toISOString(),
      };

      const { error } = await supabase.from('kayitlar').insert([yeniKayit]);

      if (error) {
        console.error('Kayıt eklenirken hata:', error);
        alert('Kayıt eklenirken bir hata oluştu!');
        // Hata olursa flag'leri sıfırla
        kaydedildiMi.current = false;
        sonKayitRef.current = null;
      } else {
        fetchKayitlar(); // Listeyi yenile
      }
    };

    saveToDatabase();
  }, [formData, user]);

  // Yeni Kayıt butonuna basıldığında flag'leri sıfırla
  const handleReset = () => {
    kaydedildiMi.current = false;
    sonKayitRef.current = null;
    onReset();
  };

  // Kayıt silme
  const deleteKayit = async (id) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('kayitlar').delete().eq('id', id);

      if (error) {
        console.error('Silme hatası:', error);
        alert('Kayıt silinirken bir hata oluştu!');
      } else {
        fetchKayitlar(); // Listeyi yenile
      }
    }
  };

  // PDF oluştur
  const handlePdfOlustur = async (kayit) => {
    const pdfKayit = {
      id: kayit.id,
      firmaAdi: kayit.firma_adi,
      il: kayit.il,
      ilce: kayit.ilce,
      depoTipi: kayit.depo_tipi,
      maxKapasite: kayit.max_kapasite,
      guncelTon: kayit.guncel_ton,
      adres: kayit.adres,
      telefon: kayit.telefon,
      urunler: kayit.urunler,
      doluluk: kayit.doluluk_orani,
    };
    await generateDepoPDF(pdfKayit);
  };

  const getDolulukClass = (deger) => {
    if (deger < 50) return 'low';
    if (deger < 80) return 'medium';
    return 'high';
  };

  // İstatistikler
  const toplamKapasite = kayitlar.reduce(
    (sum, k) => sum + (k.max_kapasite || 0),
    0,
  );
  const toplamGuncel = kayitlar.reduce(
    (sum, k) => sum + (k.guncel_ton || 0),
    0,
  );
  const ortalamaDoluluk =
    toplamKapasite > 0 ? Math.round((toplamGuncel / toplamKapasite) * 100) : 0;

  return (
    <div className='card list-card'>
      <div className='list-header'>
        <div className='card-header'>
          <div className='card-icon'>📋</div>
          <h2>Sistem Kayıt Geçmişi</h2>
        </div>
        <button className='btn-new' onClick={handleReset}>
          + Yeni Kayıt
        </button>
      </div>

      <p className='card-subtitle'>
        {loading
          ? 'Kayıtlar yükleniyor...'
          : `Toplam ${kayitlar.length} kayıt bulundu`}
      </p>

      {/* İstatistik kartları */}
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon'>📊</div>
          <div className='stat-value'>{kayitlar.length}</div>
          <div className='stat-label'>Toplam Kayıt</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>📈</div>
          <div className='stat-value'>{ortalamaDoluluk}%</div>
          <div className='stat-label'>Ort. Doluluk</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>🏭</div>
          <div className='stat-value'>{kayitlar.length}</div>
          <div className='stat-label'>Aktif Depolar</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>📦</div>
          <div className='stat-value'>
            {toplamGuncel} / {toplamKapasite}
          </div>
          <div className='stat-label'>Toplam Ton</div>
        </div>
      </div>

      <div className='table-container'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Firma / Kişi</th>
              <th>İlçe</th>
              <th>Depo Tipi</th>
              <th>Doluluk Oranı</th>
              <th>Ürünler</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan='7'
                  style={{ textAlign: 'center', padding: '40px' }}
                >
                  Yükleniyor...
                </td>
              </tr>
            ) : kayitlar.length === 0 ? (
              <tr>
                <td
                  colSpan='7'
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#9ca3af',
                  }}
                >
                  Henüz kayıt bulunmuyor. "Yeni Kayıt" butonuna tıklayarak ilk
                  deponuzu ekleyin.
                </td>
              </tr>
            ) : (
              kayitlar.map((k) => (
                <tr key={k.id}>
                  <td className='firma-cell'>{k.firma_adi}</td>
                  <td>{k.ilce}</td>
                  <td>{k.depo_tipi}</td>
                  <td>
                    <div className='doluluk-badge'>
                      <div
                        className={`doluluk-bar ${getDolulukClass(k.doluluk_orani)}`}
                        style={{ width: `${k.doluluk_orani}%` }}
                      ></div>
                      <span>{k.doluluk_orani}%</span>
                    </div>
                  </td>
                  <td>
                    <div className='urun-list'>
                      {(k.urunler || []).slice(0, 2).map((u) => (
                        <span key={u} className='urun-tag'>
                          {u}
                        </span>
                      ))}
                      {(k.urunler || []).length > 2 && (
                        <span className='urun-tag'>
                          +{k.urunler.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='tarih-cell'>
                    {new Date(k.kayit_tarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <div className='action-buttons'>
                      <button
                        className='action-btn pdf-btn'
                        onClick={() => handlePdfOlustur(k)}
                        title='PDF İndir'
                      >
                        📄
                      </button>
                      <button
                        className='action-btn delete-btn'
                        onClick={() => deleteKayit(k.id)}
                        title='Sil'
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='footer'>
        © 2026 Gevher & Positive Mühendislik Şirketler Grubu
      </div>
    </div>
  );
};

export default Step4List;
