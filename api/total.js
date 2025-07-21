// File: api/total.js
// Purpose: Serve complete token data and the total supply from Kasplex API, normalized by decimal precision.
// Usage: /api/total?token={ticker} (returns just total value for any given token)
// Usage: /api?token={ticker} (returns all token info for {ticker})
// Default token is NACHO if no token parameter is provided

// Entry point for the serverless API route
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
    
    // Check if this is the /api/max endpoint (returns total supply value only)
    // vs /api endpoint (returns all token info)
    const isMaxEndpoint = req.url.includes('/max');
    
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
    
    // If this is the /api/max endpoint, return just the total supply value
    if (isMaxEndpoint) {
      const totalSupply = tokenData.max; // Still indexing "max" from API response
      if (!totalSupply) {
        return res.status(404).json({ error: `Total supply not found for token: ${token}` });
      }
      // Divide total supply by 100,000,000 and return as plain text
      const adjustedTotalSupply = totalSupply / 100000000;
      res.status(200).send(adjustedTotalSupply.toString());
    } else {
      // This is the /api endpoint, modify the max value before returning
      if (tokenData.max) {
        tokenData.max = tokenData.max / 100000000;
      }
      // Return all token data as JSON with adjusted max value
      res.status(200).json(tokenData);
    }
    
  } catch (error) {
    const token = req.query.token || 'NACHO';
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} data` });
  }
}
