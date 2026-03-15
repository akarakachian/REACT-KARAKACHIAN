/**
 * Proxy for the BCRA public API.
 * GET /api/bcra           → api.bcra.gob.ar/estadisticas/v3.0/monetarias
 * GET /api/bcra/1/...     → api.bcra.gob.ar/estadisticas/v3.0/monetarias/1/...
 *
 * Netlify passes the full path in event.path, e.g.
 *   "/.netlify/functions/bcra/1/2024-01-01/2024-12-31"
 * We strip the function prefix and append the rest to the BCRA base URL.
 */

const BCRA_BASE = 'https://api.bcra.gob.ar/estadisticas/v3.0/monetarias';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  try {
    // Strip function path prefix to get just the subpath
    const subpath = event.path
      .replace(/\/?\.netlify\/functions\/bcra/, '')
      .replace(/\/?api\/bcra/, '') || '';

    const url = `${BCRA_BASE}${subpath}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) throw new Error(`BCRA HTTP ${res.status}`);

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
