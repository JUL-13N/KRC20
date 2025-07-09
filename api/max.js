import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { data } = await axios.get('https://api.kasplex.org/v1/krc20/token/NACHO', {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-Function)'
      }
    });
    
    const maxRaw = data?.result?.[0]?.max;
    
    if (maxRaw === undefined) {
      res.status(404).send('Max supply not found');
      return;
    }
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(String(maxRaw));
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).send('Error fetching max supply');
  }
}
