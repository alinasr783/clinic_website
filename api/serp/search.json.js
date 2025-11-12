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

    // Build SerpApi URL with forwarded query params
    const target = new URL('https://serpapi.com/search.json');
    // Forward all incoming query params
    for (const [key, value] of Object.entries(req.query || {})) {
      if (typeof value === 'string') target.searchParams.set(key, value);
    }
    // Ensure api_key is present from server env
    target.searchParams.set('api_key', serpKey);

    // Optional: enforce google_flights engine
    // if (!target.searchParams.get('engine')) target.searchParams.set('engine', 'google_flights');

    const upstream = await fetch(target.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const text = await upstream.text();
    // Try to parse JSON if possible, otherwise return raw text
    try {
      const json = JSON.parse(text);
      res.status(upstream.status).json(json);
    } catch {
      res.status(upstream.status).send(text);
    }
  } catch (err) {
    console.error('[api/serp/search.json] Error:', err);
    res.status(500).json({ error: 'SerpApi proxy failed', details: String(err?.message || err) });
  }
}