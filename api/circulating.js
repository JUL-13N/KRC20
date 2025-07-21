// File: api/circulating.js
// Purpose: Return the circulating supply for a given Kaspa KRC20 token, adjusted by its decimal precision.
// Usage: /api/circulating?token={ticker} (returns circulating supply for any given token)
// Default token is NACHO if no token parameter is provided
// Formula: Circulating Supply = (Max Supply - Insider Supply - Burnt Supply) / 10^decimals
// Where: Insider Supply = "pre"-minted supply

// Serverless route entry point
export default async function handler(req, res) {
  // CORS headers: make the API publicly accessible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Custom headers for GitHub repo reference and versioning
  res.setHeader('X-Source-Code', 'https://github.com/JUL-13N/KRC20');
  res.setHeader('X-API-Version', '1.1.0');
  
  try {
    // 🔍 Extract token from query param, default to 'NACHO'
    const token = req.query.token || 'NACHO';
    
    // 🌐 Fetch token metadata from Kasplex API
    const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${token}`);
    
    // 🚨 Handle network errors
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // 📥 Parse token data
    const data = await response.json();
    
    // 🧪 Sanity check for valid token data
    if (!data.result || !data.result[0]) {
      return res.status(404).json({ error: `Token data not found for: ${token}` });
    }
    
    const tokenData = data.result[0];
    
    // 📊 Pull raw values for supply calculation
    const maxValue = parseFloat(tokenData.max);
    const insiderValue = parseFloat(tokenData.pre); // "pre" = insider supply
    const burnedValue = parseFloat(tokenData.burned || '0'); // Default to 0 if burned field is missing
    
    // ❓ Validate key fields
    if (isNaN(maxValue)) {
      return res.status(404).json({ error: `Max value not found or invalid for token: ${token}` });
    }
    if (isNaN(insiderValue)) {
      return res.status(404).json({ error: `Insider supply (pre) value not found or invalid for token: ${token}` });
    }
    if (isNaN(burnedValue)) {
      return res.status(404).json({ error: `Burned value invalid for token: ${token}` });
    }
    
    // 🔢 Extract decimal precision (default to 0 if missing)
    const decimals = parseInt(tokenData.dec || '0', 10);
    
    // 📐 Calculate divisor (e.g., 10^8 for 8 decimal places)
    const divisor = Math.pow(10, decimals);
    
    // ➗ Calculate circulating supply: (Max - Insider Supply - Burned) / divisor
    const circulatingSupply = (maxValue - insiderValue - burnedValue) / divisor;
    
    // 📤 Send result as plain text response
    res.status(200).send(circulatingSupply.toString());
    
  } catch (error) {
    // 🛠 Error fallback
    const token = req.query.token || 'NACHO';
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} data` });
  }
}
