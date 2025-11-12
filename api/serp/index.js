export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const serpKey = process.env.SERPAPI_KEY;
    if (!serpKey) {
      res.status(500).json({ error: 'Missing SERPAPI_KEY on server' });
      return;
    }

    const target = new URL('https://serpapi.com/search.json');
    for (const [key, value] of Object.entries(req.query || {})) {
      if (typeof value === 'string') target.searchParams.set(key, value);
    }
    target.searchParams.set('api_key', serpKey);

    const upstream = await fetch(target.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });
    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      res.status(upstream.status).json(json);
    } catch {
      res.status(upstream.status).send(text);
    }
  } catch (err) {
    console.error('[api/serp/index] Error:', err);
    res.status(500).json({ error: 'SerpApi proxy failed', details: String(err?.message || err) });
  }
}