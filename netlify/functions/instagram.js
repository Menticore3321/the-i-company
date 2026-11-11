const https = require('https');

function parseFollowerString(str) {
  if (!str) return 0;
  const cleaned = str.trim().toUpperCase().replace(/,/g, '');
  if (cleaned.endsWith('M')) {
    return Math.round(parseFloat(cleaned.replace('M', '')) * 1000000);
  }
  if (cleaned.endsWith('K')) {
    return Math.round(parseFloat(cleaned.replace('K', '')) * 1000);
  }
  return parseInt(cleaned, 10) || 0;
}

function scrapeInstagram(handle) {
  return new Promise((resolve) => {
    const cleanHandle = handle.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    const url = `https://www.instagram.com/${cleanHandle}/`;
    
    const req = https.get(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return resolve({ success: false, error: `Instagram returned HTTP ${res.statusCode}` });
        }

        const titleMatch = data.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) || data.match(/<title>([^<]+)<\/title>/i);
        const descMatch = data.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || data.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const imgMatch = data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

        const rawTitle = titleMatch ? titleMatch[1].replace(/&#064;/g, '@').replace(/&amp;/g, '&') : '';
        const rawDesc = descMatch ? descMatch[1].replace(/&#064;/g, '@').replace(/&amp;/g, '&') : '';
        const rawImg = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

        // Extract Name: "Tanmay Bhat (@tanmaybhat) • Instagram photos and videos"
        let name = cleanHandle;
        const nameMatch = rawTitle.match(/^([^(•]+?)(?:\s*\(@|\s*•)/);
        if (nameMatch && nameMatch[1].trim()) {
          name = nameMatch[1].trim();
        }

        // Extract Stats: "2M Followers, 2,407 Following, 1,409 Posts - See Instagram photos and videos..."
        let followers = 0;
        let following = 0;
        let posts = 0;

        const fMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Followers/i);
        if (fMatch) followers = parseFollowerString(fMatch[1]);

        const flMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Following/i);
        if (flMatch) following = parseFollowerString(flMatch[1]);

        const pMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Posts/i);
        if (pMatch) posts = parseFollowerString(pMatch[1]);

        // Clean bio description text
        let bio = '';
        const bioMatch = rawDesc.match(/from[^-]+-\s*(.+)$/i);
        if (bioMatch && bioMatch[1].trim()) {
          bio = bioMatch[1].trim();
        }

        resolve({
          success: true,
          handle: cleanHandle,
          name,
          followers,
          following,
          posts,
          avatar: rawImg,
          bio: bio || `Digital Creator & Influencer on Instagram (@${cleanHandle})`,
          isLiveScraped: true
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request to Instagram timed out' });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const handle = event.queryStringParameters?.handle;
  if (!handle) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Handle query parameter is required' })
    };
  }

  try {
    const result = await scrapeInstagram(handle);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
