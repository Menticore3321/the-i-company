export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const shortcode = event.queryStringParameters?.shortcode;
  const directUrl = event.queryStringParameters?.url;

  if (!shortcode && !directUrl) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'text/plain' },
      body: 'Missing shortcode or url parameter'
    };
  }

  const targetUrl = directUrl || `https://www.instagram.com/p/${shortcode}/media/?size=l`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!upstreamRes.ok) {
      return {
        statusCode: upstreamRes.status,
        headers: { ...headers, 'Content-Type': 'text/plain' },
        body: `Upstream error: ${upstreamRes.statusText}`
      };
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstreamRes.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'text/plain' },
      body: `Thumbnail proxy error: ${err.message}`
    };
  }
}
