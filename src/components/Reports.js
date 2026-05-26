import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import './Reports.css';

const Reports = () => {
  const [kayitlar, setKayitlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreler, setFiltreler] = useState({
    il: '',
    ilce: '',
    urun: '',
    depoTipi: '',
  });
  const [filtrelenmisKayitlar, setFiltrelenmisKayitlar] = useState([]);

  // Tüm kayıtları çek
  useEffect(() => {
    fetchKayitlar();
  }, []);

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
      setFiltrelenmisKayitlar(data || []);
    }
    setLoading(false);
  };

  // Filtreleme işlemi
  useEffect(() => {
    let filtered = [...kayitlar];

    if (filtreler.il && filtreler.il !== '') {
      filtered = filtered.filter((k) => k.il === filtreler.il);
    }
    if (filtreler.ilce && filtreler.ilce !== '') {
      filtered = filtered.filter((k) => k.ilce === filtreler.ilce);
    }
    if (filtreler.depoTipi && filtreler.depoTipi !== '') {
      filtered = filtered.filter((k) => k.depo_tipi === filtreler.depoTipi);
    }
    if (filtreler.urun && filtreler.urun !== '') {
      filtered = filtered.filter(
        (k) => k.urunler && k.urunler.some((u) => u.includes(filtreler.urun)),
      );
    }

    setFiltrelenmisKayitlar(filtered);
  }, [filtreler, kayitlar]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setFiltreler({
      il: '',
      ilce: '',
      urun: '',
      depoTipi: '',
    });
  };

  // İstatistikler
  const toplamTon = filtrelenmisKayitlar.reduce(
    (sum, k) => sum + (k.guncel_ton || 0),
    0,
  );
  const toplamKapasite = filtrelenmisKayitlar.reduce(
    (sum, k) => sum + (k.max_kapasite || 0),
    0,
  );
  const ortalamaDoluluk =
    toplamKapasite > 0 ? Math.round((toplamTon / toplamKapasite) * 100) : 0;
  const toplamKayit = filtrelenmisKayitlar.length;

  // Ürün bazında istatistik
  const urunIstatistik = () => {
    const istatistik = {};
    filtrelenmisKayitlar.forEach((kayit) => {
      (kayit.urunler || []).forEach((urun) => {
        const urunAdi = urun.split(' (')[0];
        if (!istatistik[urunAdi]) {
          istatistik[urunAdi] = {
            toplamTon: 0,
            kayitSayisi: 0,
          };
        }
        istatistik[urunAdi].toplamTon += kayit.guncel_ton || 0;
        istatistik[urunAdi].kayitSayisi += 1;
      });
    });
    return istatistik;
  };

  // İlçe bazında istatistik
  const ilceIstatistik = () => {
    const istatistik = {};
    filtrelenmisKayitlar.forEach((kayit) => {
      const key = `${kayit.il}-${kayit.ilce}`;
      if (!istatistik[key]) {
        istatistik[key] = {
          il: kayit.il,
          ilce: kayit.ilce,
          toplamTon: 0,
          kayitSayisi: 0,
        };
      }
      istatistik[key].toplamTon += kayit.guncel_ton || 0;
      istatistik[key].kayitSayisi += 1;
    });
    return Object.values(istatistik);
  };

  const benzersizIller = [...new Set(kayitlar.map((k) => k.il))];
  const benzersizIlceler = [
    ...new Set(
      kayitlar.filter((k) => k.il === filtreler.il).map((k) => k.ilce),
    ),
  ];
  const benzersizUrunler = [
    ...new Set(
      kayitlar.flatMap((k) => k.urunler || []).map((u) => u.split(' (')[0]),
    ),
  ];
  const benzersizDepoTipleri = [...new Set(kayitlar.map((k) => k.depo_tipi))];

  if (loading) {
    return <div className='loading'>Yükleniyor...</div>;
  }

  return (
    <div className='reports-container'>
      <div className='reports-header'>
        <h1> Depo Analiz ve Raporlama</h1>
        <p>Tüm kayıtları filtreleyerek detaylı analiz yapın</p>
      </div>

      {/* Filtre Kartı */}
      <div className='filter-card'>
        <h3>🔍 Filtreleme Seçenekleri</h3>
        <div className='filter-grid'>
          <div className='filter-group'>
            <label>İl</label>
            <select
              value={filtreler.il}
              onChange={(e) =>
                setFiltreler({ ...filtreler, il: e.target.value, ilce: '' })
              }
            >
              <option value=''>Tümü</option>
              {benzersizIller.map((il) => (
                <option key={il} value={il}>
                  {il}
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label>İlçe</label>
            <select
              value={filtreler.ilce}
              onChange={(e) =>
                setFiltreler({ ...filtreler, ilce: e.target.value })
              }
              disabled={!filtreler.il}
            >
              <option value=''>Tümü</option>
              {benzersizIlceler.map((ilce) => (
                <option key={ilce} value={ilce}>
                  {ilce}
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label>Ürün</label>
            <select
              value={filtreler.urun}
              onChange={(e) =>
                setFiltreler({ ...filtreler, urun: e.target.value })
              }
            >
              <option value=''>Tümü</option>
              {benzersizUrunler.map((urun) => (
                <option key={urun} value={urun}>
                  {urun}
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label>Depo Tipi</label>
            <select
              value={filtreler.depoTipi}
              onChange={(e) =>
                setFiltreler({ ...filtreler, depoTipi: e.target.value })
              }
            >
              <option value=''>Tümü</option>
              {benzersizDepoTipleri.map((tip) => (
                <option key={tip} value={tip}>
                  {tip}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='filter-actions'>
          <button className='btn-reset' onClick={resetFilters}>
            Sıfırla
          </button>
          <div className='filter-actions'>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className='btn-reset' onClick={resetFilters}>
                Sıfırla
              </button>
              <button
                className='btn-pdf'
                onClick={async () => {
                  const istatistikler = {
                    toplamKayit: filtrelenmisKayitlar.length,
                    toplamTon: filtrelenmisKayitlar.reduce(
                      (sum, k) => sum + (k.guncel_ton || 0),
                      0,
                    ),
                    toplamKapasite: filtrelenmisKayitlar.reduce(
                      (sum, k) => sum + (k.max_kapasite || 0),
                      0,
                    ),
                    ortalamaDoluluk:
                      toplamKapasite > 0
                        ? Math.round((toplamTon / toplamKapasite) * 100)
                        : 0,
                  };
                  const { generateRaporPDF } =
                    await import('../utils/pdfGenerator');
                  await generateRaporPDF(
                    filtrelenmisKayitlar,
                    filtreler,
                    istatistikler,
                  );
                }}
              >
                📄 PDF Oluştur
              </button>
            </div>
            <div className='filter-info'>
              <span>🎯 {toplamKayit} kayıt listeleniyor</span>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon'>📦</div>
          <div className='stat-value'>
            {toplamTon.toLocaleString('tr-TR')} ton
          </div>
          <div className='stat-label'>Toplam Depolanan Ürün</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>🏭</div>
          <div className='stat-value'>
            {toplamKapasite.toLocaleString('tr-TR')} ton
          </div>
          <div className='stat-label'>Toplam Kapasite</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>📈</div>
          <div className='stat-value'>{ortalamaDoluluk}%</div>
          <div className='stat-label'>Ortalama Doluluk</div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>📋</div>
          <div className='stat-value'>{toplamKayit}</div>
          <div className='stat-label'>Aktif Kayıt</div>
        </div>
      </div>

      {/* Ürün Bazında Rapor */}
      <div className='report-section'>
        <h3>🌾 Ürün Bazında Stok Durumu</h3>
        <div className='urun-grid'>
          {Object.entries(urunIstatistik()).map(([urun, data]) => (
            <div key={urun} className='urun-card'>
              <div className='urun-emoji'>
                {urun === 'Patates'
                  ? '🥔'
                  : urun === 'Soğan'
                    ? '🧅'
                    : urun === 'Buğday'
                      ? '🌾'
                      : urun === 'Elma'
                        ? '🍎'
                        : '📦'}
              </div>
              <div className='urun-ad'>{urun}</div>
              <div className='urun-ton'>
                {data.toplamTon.toLocaleString('tr-TR')} ton
              </div>
              <div className='urun-kayit'>{data.kayitSayisi} kayıt</div>
            </div>
          ))}
        </div>
        {Object.keys(urunIstatistik()).length === 0 && (
          <div className='empty-message'>Henüz ürün kaydı bulunmuyor</div>
        )}
      </div>

      {/* İlçe Bazında Rapor */}
      <div className='report-section'>
        <h3>🗺️ İlçe Bazında Depolama</h3>
        <div className='ilce-grid'>
          {ilceIstatistik().map((ilce, idx) => (
            <div key={idx} className='ilce-card'>
              <div className='ilce-ad'>
                {ilce.ilce} / {ilce.il}
              </div>
              <div className='ilce-ton'>
                {ilce.toplamTon.toLocaleString('tr-TR')} ton
              </div>
              <div className='ilce-kayit'>{ilce.kayitSayisi} kayıt</div>
            </div>
          ))}
        </div>
        {ilceIstatistik().length === 0 && (
          <div className='empty-message'>
            Henüz ilçe bazında kayıt bulunmuyor
          </div>
        )}
      </div>

      {/* Detaylı Kayıt Listesi */}
      <div className='report-section'>
        <h3>📋 Detaylı Kayıt Listesi</h3>
        <div className='kayit-table-container'>
          <table className='kayit-table'>
            <thead>
              <tr>
                <th>Firma</th>
                <th>Konum</th>
                <th>Depo Tipi</th>
                <th>Ürünler</th>
                <th>Doluluk</th>
                <th>Tonaj</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisKayitlar.map((kayit) => (
                <tr key={kayit.id}>
                  <td>{kayit.firma_adi}</td>
                  <td>
                    {kayit.ilce}, {kayit.il}
                  </td>
                  <td>{kayit.depo_tipi}</td>
                  <td>
                    {(kayit.urunler || []).slice(0, 2).join(', ')}
                    {(kayit.urunler || []).length > 2 && '...'}
                  </td>
                  <td>
                    <div className='mini-progress'>
                      <div
                        className='mini-progress-fill'
                        style={{ width: `${kayit.doluluk_orani}%` }}
                      ></div>
                      <span>{kayit.doluluk_orani}%</span>
                    </div>
                  </td>
                  <td>
                    {kayit.guncel_ton} / {kayit.max_kapasite}
                  </td>
                  <td>
                    {new Date(kayit.kayit_tarihi).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtrelenmisKayitlar.length === 0 && (
          <div className='empty-message'>Kayıt bulunmuyor</div>
        )}
      </div>
    </div>
  );
};

export default Reports;
