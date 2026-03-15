/**
 * Proxy for TradingView Scanner API.
 * Forwards POST /api/scan → scanner.tradingview.com/{market}/scan
 * with spoofed Origin/Referer so TradingView accepts the request.
 */

const VALID_MARKETS = new Set([
  'america', 'brazil', 'argentina', 'global',
  'uk', 'germany', 'india', 'crypto', 'forex', 'cfd', 'futures',
]);

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  // Pre-flight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  try {
    const { market, body } = JSON.parse(event.body ?? '{}');

    if (!market || !VALID_MARKETS.has(market)) {
      return {
        statusCode: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Invalid or missing market: "${market}"` }),
      };
    }

    const tvRes = await fetch(`https://scanner.tradingview.com/${market}/scan`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Origin':       'https://www.tradingview.com',
        'Referer':      'https://www.tradingview.com/',
        'Accept':       'application/json',
      },
      body: body ?? JSON.stringify({}),
    });

    if (!tvRes.ok) {
      const detail = await tvRes.text().catch(() => '');
      throw new Error(`TradingView HTTP ${tvRes.status}: ${detail.slice(0, 200)}`);
    }

    const data = await tvRes.json();

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
