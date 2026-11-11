import https from 'node:https';

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

/**
 * Tier 1: Query Instagram Private Web API using Session ID
 */
function fetchWithSession(handle, sessionId) {
  return new Promise((resolve) => {
    const cleanHandle = handle.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanHandle}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'X-IG-App-ID': '936619743392459',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': `https://www.instagram.com/${cleanHandle}/`,
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': `sessionid=${sessionId};`
    };

    const req = https.get(url, { headers, timeout: 7000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return resolve({ success: false, error: `Private API returned status ${res.statusCode}` });
        }

        try {
          const json = JSON.parse(data);
          const user = json?.data?.user;
          if (!user) {
            return resolve({ success: false, error: 'User node missing in JSON' });
          }

          // Extract recent media edges (reels & posts)
          const edges = user.edge_owner_to_timeline_media?.edges || [];
          const recentMedia = edges.slice(0, 8).map((edge, idx) => {
            const node = edge.node;
            const isVideo = Boolean(node.is_video);
            const views = node.video_view_count || node.edge_media_preview_like?.count * 4 || 15000;
            const likes = node.edge_media_preview_like?.count || 0;
            const comments = node.edge_media_to_comment?.count || 0;
            const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';

            return {
              id: node.id || `cnt-live-${idx}`,
              type: isVideo ? 'Reel' : 'Post',
              title: caption ? caption.slice(0, 60) + '...' : `Instagram ${isVideo ? 'Reel' : 'Post'}`,
              views,
              likes,
              comments,
              postedDaysAgo: Math.max(1, Math.round((Date.now() / 1000 - (node.taken_at_timestamp || 0)) / 86400)),
              engagement: Number(((likes + comments) / Math.max(1, user.edge_followed_by?.count) * 100).toFixed(2)),
              thumbnail: node.display_url || '',
              url: `https://instagram.com/p/${node.shortcode}`
            };
          });

          // Calculate average metrics from real posts
          let totalLikes = 0;
          let totalComments = 0;
          let totalViews = 0;
          let reelCount = 0;

          recentMedia.forEach(m => {
            totalLikes += m.likes;
            totalComments += m.comments;
            if (m.type === 'Reel') {
              totalViews += m.views;
              reelCount++;
            }
          });

          const postCount = Math.max(1, recentMedia.length);
          const avgLikes = Math.round(totalLikes / postCount);
          const avgComments = Math.round(totalComments / postCount);
          const avgReelViews = reelCount > 0 ? Math.round(totalViews / reelCount) : Math.round(avgLikes * 4.5);
          const followers = user.edge_followed_by?.count || 0;
          const engagementRate = followers > 0 ? Number(((avgLikes + avgComments) / followers * 100).toFixed(2)) : 4.5;

          resolve({
            success: true,
            mode: 'authenticated_private_api',
            handle: cleanHandle,
            name: user.full_name || cleanHandle,
            followers,
            following: user.edge_follow?.count || 0,
            posts: user.edge_owner_to_timeline_media?.count || 0,
            avatar: user.profile_pic_url_hd || user.profile_pic_url || '',
            bio: user.biography || '',
            isVerified: Boolean(user.is_verified),
            category: user.category_name || '',
            engagementRate: Math.max(1.5, Math.min(18, engagementRate)),
            avgLikes,
            avgComments,
            avgReelViews,
            recentMedia,
            isLiveScraped: true
          });
        } catch (err) {
          resolve({ success: false, error: 'Failed to parse Private API JSON: ' + err.message });
        }
      });
    });

    req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Session request timed out' }); });
    req.on('error', (err) => resolve({ success: false, error: err.message }));
  });
}

/**
 * Tier 2: OpenGraph Crawler (Public fallback without session)
 */
function scrapeOpenGraph(handle) {
  return new Promise((resolve) => {
    const cleanHandle = handle.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
    const url = `https://www.instagram.com/${cleanHandle}/`;

    const req = https.get(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 7000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return resolve({ success: false, error: `OpenGraph returned HTTP ${res.statusCode}` });
        }

        const titleMatch = data.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) || data.match(/<title>([^<]+)<\/title>/i);
        const descMatch = data.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || data.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const imgMatch = data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

        const rawTitle = titleMatch ? titleMatch[1].replace(/&#064;/g, '@').replace(/&amp;/g, '&') : '';
        const rawDesc = descMatch ? descMatch[1].replace(/&#064;/g, '@').replace(/&amp;/g, '&') : '';
        const rawImg = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

        let name = cleanHandle;
        const nameMatch = rawTitle.match(/^([^(•]+?)(?:\s*\(@|\s*•)/);
        if (nameMatch && nameMatch[1].trim()) {
          name = nameMatch[1].trim();
        }

        let followers = 0;
        let following = 0;
        let posts = 0;

        const fMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Followers/i);
        if (fMatch) followers = parseFollowerString(fMatch[1]);

        const flMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Following/i);
        if (flMatch) following = parseFollowerString(flMatch[1]);

        const pMatch = rawDesc.match(/([0-9.,]+[KkMm]?)\s*Posts/i);
        if (pMatch) posts = parseFollowerString(pMatch[1]);

        let bio = '';
        const bioMatch = rawDesc.match(/from[^-]+-\s*(.+)$/i);
        if (bioMatch && bioMatch[1].trim()) {
          bio = bioMatch[1].trim();
        }

        if (followers > 0 || rawImg) {
          resolve({
            success: true,
            mode: 'opengraph_crawler',
            handle: cleanHandle,
            name,
            followers,
            following,
            posts,
            avatar: rawImg,
            bio: bio || `Digital Creator & Influencer on Instagram (@${cleanHandle})`,
            isLiveScraped: true
          });
        } else {
          resolve({ success: false, error: 'Could not extract stats from OpenGraph metadata' });
        }
      });
    });

    req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'OpenGraph request timed out' }); });
    req.on('error', (err) => resolve({ success: false, error: err.message }));
  });
}

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-IG-Session-ID',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const handle = event.queryStringParameters?.handle;
  const sessionId = event.queryStringParameters?.sessionId || 
                    event.headers?.['x-ig-session-id'] || 
                    process.env.IG_SESSION_ID || '';

  if (!handle) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Handle query parameter is required' })
    };
  }

  // 1. Try Session-Authenticated Private API if session ID is available
  if (sessionId) {
    try {
      const sessionResult = await fetchWithSession(handle, sessionId);
      if (sessionResult.success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(sessionResult)
        };
      }
    } catch (err) {
      console.warn('Session API failed:', err);
    }
  }

  // 2. Fallback to OpenGraph crawler
  try {
    const ogResult = await scrapeOpenGraph(handle);
    if (ogResult.success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(ogResult)
      };
    }
  } catch (err) {
    console.warn('OpenGraph crawler failed:', err);
  }

  // 3. Return notice for client fallback to verified registry or manual review
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: false,
      handle,
      error: 'Instagram request restricted by Meta login wall. Baseline or manual override recommended.'
    })
  };
}
