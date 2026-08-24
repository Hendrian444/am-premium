export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Target URL is required' });
    }

    try {
        // Meneruskan request ke URL API publik mana pun secara aman di server-side
        const apiRes = await fetch(url);
        const data = await apiRes.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Gagal mengambil data dari API publik', details: error.message });
    }
}
