export default async function handler(req, res) {
  const { videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL Video wajib disertakan' });
  }

  try {
    // 1. Server Vercel mengambil video langsung dari CDN TikTok
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // 2. Mengambil data sebagai biner (ArrayBuffer/Blob)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Menetapkan header agar merespons sebagai file MP4 (bukan JSON)
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Opsional

    // 4. Mengirimkan biner video kembali ke frontend
    return res.send(buffer);
  } catch (error) {
    console.error('Download Proxy Error:', error);
    return res.status(500).json({ error: 'Gagal mengunduh video dari CDN' });
  }
}