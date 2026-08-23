export default async function handler(req, res) {
    // Izinkan akses CORS agar bisa dipanggil dari frontend web lu
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { endpoint, ...queryParams } = req.query;

    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
    }

    const API_KEY = 'SK-pGFkFkE6Kb2HtQkYfivFTq7N';
    const API_BASE = 'https://www.free-restapi.biz.id/api';

    // Rangkai parameter query ke API asli
    const searchParams = new URLSearchParams({
        ...queryParams,
        apikey: API_KEY
    });

    const targetUrl = `${API_BASE}/${endpoint}?${searchParams.toString()}`;

    try {
        const apiRes = await fetch(targetUrl);
        const data = await apiRes.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch from external API', details: error.message });
    }
}
