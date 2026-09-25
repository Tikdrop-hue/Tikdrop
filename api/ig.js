export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }

  const { url } = req.query;

  if (!url || !/(instagram\.com|instagr\.am)/i.test(url)) {
    return res.status(400).json({ success: false, error: 'URL Instagram tidak valid' });
  }

  try {
    // Menggunakan penyedia API alternatif yang berbeda (Siputzx)
    const apiUrl = `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url.trim())}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    // 1. CEK APAKAH BALASAN DARI SERVER ADALAH HTML (Error/Cloudflare) ATAU JSON
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
       const errText = await response.text();
       throw new Error(`API Endpoint Down/Terblokir Cloudflare. Balasan Server: ${errText.substring(0, 40)}...`);
    }

    const result = await response.json();

    // 2. SESUAIKAN FORMAT JSON DARI API PENYEDIA BARU
    if (result && result.status && result.data && result.data.length > 0) {
      // API ini mengembalikan array 'data' berisi objek { url: 'link_video' }
      const downloadLink = result.data[0].url;

      if (!downloadLink) {
         throw new Error('Link download kosong dari API penyedia.');
      }

      return res.status(200).json({ 
        success: true, 
        data: [{ download_link: downloadLink, thumbnail: '' }] 
      });
    } else {
      throw new Error('Video tidak ditemukan. Pastikan tautan publik dan bukan privat.');
    }

  } catch (error) {
    console.error("DEBUG ERROR IG API:", error.message);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengekstrak data Instagram'
    });
  }
}