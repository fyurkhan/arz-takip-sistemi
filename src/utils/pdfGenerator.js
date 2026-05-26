import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Şık PDF oluşturma fonksiyonu
export const generateDepoPDF = async (kayit) => {
  // Geçici bir div oluştur (görünmez)
  const pdfContent = document.createElement('div');
  pdfContent.style.position = 'absolute';
  pdfContent.style.left = '-9999px';
  pdfContent.style.top = '-9999px';
  pdfContent.style.width = '800px';
  pdfContent.style.backgroundColor = 'white';
  pdfContent.style.fontFamily = 'Arial, sans-serif';

  // PDF içeriğini oluştur
  pdfContent.innerHTML = `
    <div style="padding: 40px; background: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #667eea;">
        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">Arz Güvenliği Takip Sistemi</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Gevher & Positive Mühendislik Şirketler Grubu</div>
      </div>

      <!-- Başlık -->
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
        <div style="font-size: 20px; font-weight: bold;">DEPO KAYIT DETAY RAPORU</div>
        <div style="font-size: 12px; margin-top: 8px;">Kayıt No: ${kayit.id || 'AGT-' + Date.now()}</div>
        <div style="font-size: 11px; margin-top: 4px;">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
      </div>

      <!-- 1. Konum ve Depo Bilgileri -->
      <div style="margin-bottom: 25px;">
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: bold; color: #667eea;">📍 1. Konum ve Depo Bilgileri</div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; width: 40%; color: #6b7280; font-weight: 500;">İl / İlçe</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.il || 'Niğde'}, ${kayit.ilce || 'Merkez'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-weight: 500;">Depo Tipi</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.depoTipi || 'Hangar'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-weight: 500;">Kapasite Durumu</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.guncelTon || 250} ton / ${kayit.maxKapasite || 300} ton (${Math.round((kayit.guncelTon / kayit.maxKapasite) * 100) || 83}%)</td>
          </tr>
        </table>
      </div>

      <!-- Kapasite çubuğu -->
      <div style="margin: 20px 0; background: #e5e7eb; border-radius: 10px; height: 12px; overflow: hidden;">
        <div style="width: ${Math.round((kayit.guncelTon / kayit.maxKapasite) * 100) || 83}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 10px;"></div>
      </div>

      <!-- 2. Firma ve İletişim Bilgileri -->
      <div style="margin-bottom: 25px;">
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: bold; color: #667eea;">🏢 2. Firma ve İletişim Bilgileri</div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; width: 40%; color: #6b7280; font-weight: 500;">Firma / Kişi Adı</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.firmaAdi || 'Kaya Tarım'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-weight: 500;">Telefon Numarası</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.telefon || '05535876517'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-weight: 500;">Adres / Ada-Parsel</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600;">${kayit.adres || 'Aydoğdu Mahallesi'}</td>
          </tr>
        </table>
      </div>

      <!-- 3. Depolanan Ürünler -->
      <div style="margin-bottom: 25px;">
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: bold; color: #667eea;">🌾 3. Depolanan Ürünler</div>
        </div>
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 15px; border-radius: 12px;">
          ${(kayit.urunler || ['Elma'])
            .map(
              (urun) => `
            <div style="display: inline-block; background: white; padding: 5px 12px; border-radius: 20px; margin: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              ${urun}
            </div>
          `,
            )
            .join('')}
          ${kayit.urunler && kayit.urunler.includes('Elma') ? '<div style="margin-top: 10px; font-size: 12px; color: #059669;">✓ İlaçlı depolama uygundur</div>' : ''}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 9px; color: #9ca3af;">
        <div>Bu  belge  Arz  Güvenliği  Takip  Sistemi  tarafından  otomatik  olarak  oluşturulmuştur. </div>
        <div style="margin-top: 10px;">© 2026 Gevher  &  Positive  Mühendislik  Şirketler  Grubu</div>
      </div>
    </div>
  `;

  document.body.appendChild(pdfContent);

  try {
    // HTML'i resme çevir
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 genişliği mm
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // PDF'i indir
    pdf.save(`${kayit.firmaAdi || 'Kaya_Tarim'}_Depo_Kayit_${Date.now()}.pdf`);
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    alert('PDF oluşturulurken bir hata oluştu!');
  } finally {
    document.body.removeChild(pdfContent);
  }
};
// Filtrelenmiş kayıtlar için PDF oluşturma
export const generateRaporPDF = async (
  filtrelenmisKayitlar,
  filtreler,
  istatistikler,
) => {
  const pdfContent = document.createElement('div');
  pdfContent.style.position = 'absolute';
  pdfContent.style.left = '-9999px';
  pdfContent.style.top = '-9999px';
  pdfContent.style.width = '800px';
  pdfContent.style.backgroundColor = 'white';
  pdfContent.style.fontFamily = 'Arial, sans-serif';
  pdfContent.style.padding = '40px';

  // Filtre metnini oluştur
  const aktifFiltreler = [];
  if (filtreler.il) aktifFiltreler.push(`İl: ${filtreler.il}`);
  if (filtreler.ilce) aktifFiltreler.push(`İlçe: ${filtreler.ilce}`);
  if (filtreler.urun) aktifFiltreler.push(`Ürün: ${filtreler.urun}`);
  if (filtreler.depoTipi)
    aktifFiltreler.push(`Depo Tipi: ${filtreler.depoTipi}`);
  const filtreMetni =
    aktifFiltreler.length > 0 ? aktifFiltreler.join(' | ') : 'Tüm Kayıtlar';

  pdfContent.innerHTML = `
    <div style="padding: 20px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2d6a4f;">
        <div style="font-size: 24px; font-weight: bold; color: #2d6a4f;">Gıda  Arz  Güvenliği  Takip  Sistemi</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Gevher  &  Positive  Mühendislik  Şirketler  Grubu</div>
        <div style="font-size: 16px; font-weight: bold; color: #d4a373; margin-top: 10px;">DEPO ANALİZ RAPORU</div>
      </div>

      <!-- Filtre Bilgileri -->
      <div style="background: #f5f0e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-weight: bold; margin-bottom: 8px;">🔍 Filtreleme Kriterleri:</div>
        <div style="font-size: 13px; color: #2d6a4f;">${filtreMetni}</div>
        <div style="font-size: 11px; color: #8a9a7e; margin-top: 5px;">Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}</div>
      </div>

      <!-- İstatistik Kartları -->
      <div style="display: flex; gap: 15px; margin-bottom: 25px;">
        <div style="flex: 1; background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2d6a4f;">${istatistikler.toplamKayit}</div>
          <div style="font-size: 10px; color: #6b7280;">Toplam Kayıt</div>
        </div>
        <div style="flex: 1; background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2d6a4f;">${istatistikler.toplamTon} ton</div>
          <div style="font-size: 10px; color: #6b7280;">Toplam Depolanan</div>
        </div>
        <div style="flex: 1; background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2d6a4f;">${istatistikler.ortalamaDoluluk}%</div>
          <div style="font-size: 10px; color: #6b7280;">Ortalama Doluluk</div>
        </div>
        <div style="flex: 1; background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2d6a4f;">${istatistikler.toplamKapasite} ton</div>
          <div style="font-size: 10px; color: #6b7280;">Toplam Kapasite</div>
        </div>
      </div>

      <!-- Kayıt Tablosu -->
      <div style="margin-top: 20px;">
        <div style="font-weight: bold; margin-bottom: 10px;">📋 Kayıt Listesi</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: #2d6a4f; color: white;">
              <th style="padding: 8px; text-align: left;">Firma</th>
              <th style="padding: 8px; text-align: left;">Konum</th>
              <th style="padding: 8px; text-align: left;">Depo Tipi</th>
              <th style="padding: 8px; text-align: left;">Ürünler</th>
              <th style="padding: 8px; text-align: center;">Doluluk</th>
              <th style="padding: 8px; text-align: center;">Tonaj</th>
            </tr>
          </thead>
          <tbody>
            ${filtrelenmisKayitlar
              .map(
                (k) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">${k.firma_adi}</td>
                <td style="padding: 8px;">${k.ilce}, ${k.il}</td>
                <td style="padding: 8px;">${k.depo_tipi}</td>
                <td style="padding: 8px;">${(k.urunler || []).join(', ')}</td>
                <td style="padding: 8px; text-align: center;">${k.doluluk_orani}%</td>
                <td style="padding: 8px; text-align: center;">${k.guncel_ton} / ${k.max_kapasite}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #9ca3af;">
        <div>Bu belge Arz Güvenliği Takip Sistemi tarafından otomatik olarak oluşturulmuştur.</div>
        <div style="margin-top: 5px;">© 2026 Gevher & Positive Mühendislik Şirketler Grubu</div>
      </div>
    </div>
  `;

  document.body.appendChild(pdfContent);

  try {
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(
      `Depo_Analiz_Raporu_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
    );
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    alert('PDF oluşturulurken bir hata oluştu!');
  } finally {
    document.body.removeChild(pdfContent);
  }
};
