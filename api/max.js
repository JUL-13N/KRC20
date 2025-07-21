// File: api/max.js
// Usage: /api/max?token=NACHO

export default async function handler(req, res) {
  // Add CORS headers to make API publicly accessible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add custom headers to show GitHub repo
  res.setHeader('X-Source-Code', 'https://github.com/yourusername/your-repo');
  res.setHeader('X-API-Version', '1.0.0');
  
  try {
    // Fetch data from the original API
    const response = await fetch('https://api.kasplex.org/v1/krc20/token/NACHO');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the max value from the first result
    const maxValue = data.result?.[0]?.max;
    
    if (!maxValue) {
      return res.status(404).json({ error: 'Max value not found' });
    }
    
    // Return just the max value as a plain text response
    res.status(200).send(maxValue);
    
  } catch (error) {
    console.error('Error fetching NACHO data:', error);
    res.status(500).json({ error: 'Failed to fetch NACHO max value' });
  }
}
