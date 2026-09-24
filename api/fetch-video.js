// api/fetch-video.js

export default async function handler(req, res) {
  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil parameter 'url' dari URL yang dikirim oleh Frontend
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL TikTok wajib disertakan' });
  }

  try {
    // Server Vercel menembak langsung ke API TikWM
    const targetApiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    
    // Kita gunakan fetch bawaan Node.js
    const response = await fetch(targetApiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP Error dari TikWM: ${response.status}`);
    }

    const data = await response.json();

    // Tambahkan header CORS (opsional tapi disarankan agar aman)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    // Kembalikan hasil dari TikWM ke Frontend React Anda
    return res.status(200).json(data);

  } catch (error) {
    console.error('Terjadi kesalahan di Vercel API:', error);
    return res.status(500).json({ error: 'Gagal mengambil data dari penyedia API' });
  }
}