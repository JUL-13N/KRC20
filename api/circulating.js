// File: api/circulating.js
// Usage: /api/circulating?token=<TOKEN> (returns circulating supply for any given token)
// Default token is NACHO if no token parameter is provided
// Formula: (max - pre) / 100,000,000
export default async function handler(req, res) {
  // Add CORS headers to make API publicly accessible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add custom headers to show GitHub repo
  res.setHeader('X-Source-Code', 'https://github.com/JUL-13N/KRC20');
  res.setHeader('X-API-Version', '1.0.0');
  
  try {
    // Get the token from query parameter, default to NACHO if not provided
    const token = req.query.token || 'NACHO';
    
    // Fetch data from the original API using the specified token
    const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${token}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.result || !data.result[0]) {
      return res.status(404).json({ error: `Token data not found for: ${token}` });
    }
    
    const tokenData = data.result[0];
    
    // Get max and pre values
    const maxValue = parseFloat(tokenData.max);
    const preValue = parseFloat(tokenData.pre);
    
    // Validate that we have the required values
    if (isNaN(maxValue)) {
      return res.status(404).json({ error: `Max value not found or invalid for token: ${token}` });
    }
    
    if (isNaN(preValue)) {
      return res.status(404).json({ error: `Pre value not found or invalid for token: ${token}` });
    }
    
    // Calculate circulating supply: (max - pre) / 100,000,000
    const circulatingSupply = (maxValue - preValue) / 100000000;
    
    // Return the circulating supply as plain text
    res.status(200).send(circulatingSupply.toString());
    
  } catch (error) {
    const token = req.query.token || 'NACHO';
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} data` });
  }
}
