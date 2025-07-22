// File: api/circulating.js
// Purpose: Return the circulating supply for a given Kaspa KRC20 token, adjusted by its decimal precision.
// Usage: /api/circulating?token={ticker} (returns circulating supply for any given token)
// Default token is NACHO if no token parameter is provided

// Function to format numbers with commas
function formatNumber(num) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  });
}

// Fetch token data from the API
async function fetchTokenData(token = 'NACHO') {
  try {
    const response = await fetch(`https://kaspage.vercel.app/api?token=${token}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}

// Calculate circulating supply
function calculateCirculatingSupply(data) {
  try {
    // Extract values from the API response
    const maxSupply = BigInt(data.max);
    const mintedSupply = BigInt(data.minted);
    const burnedSupply = BigInt(data.burned);
    const lockedSupply = BigInt(data.pre);
    const decimals = parseInt(data.dec);
    
    // Calculate components
    const unmintedSupply = maxSupply - mintedSupply;
    
    // Formula: Circulating Supply = Minted Supply - Burnt Supply - Locked Supply
    const circulatingSupplyRaw = mintedSupply - burnedSupply - lockedSupply;
    
    // Adjust for decimal precision (dec) by dividing by 10^dec
    const divisor = BigInt(10 ** decimals);
    
    return {
      circulatingSupply: Number(circulatingSupplyRaw) / Number(divisor),
      maxSupply: Number(maxSupply) / Number(divisor),
      mintedSupply: Number(mintedSupply) / Number(divisor),
      burnedSupply: Number(burnedSupply) / Number(divisor),
      lockedSupply: Number(lockedSupply) / Number(divisor),
      unmintedSupply: Number(unmintedSupply) / Number(divisor),
      decimals: decimals,
      rawData: data
    };
  } catch (error) {
    console.error('Error calculating circulating supply:', error);
    throw error;
  }
}

// Main serverless function handler
export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get token from query parameter, default to NACHO
    const token = req.query.token || 'NACHO';
    
    // Validate token parameter (basic validation)
    if (typeof token !== 'string' || token.length === 0 || token.length > 20) {
      return res.status(400).json({ error: 'Invalid token parameter' });
    }
    
    // Fetch token data
    const tokenData = await fetchTokenData(token.toUpperCase());
    
    // Calculate circulating supply
    const result = calculateCirculatingSupply(tokenData);
    
    // Return just the circulating supply as plain text
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(result.circulatingSupply.toString());
    
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Return appropriate error response
    if (error.message.includes('HTTP error')) {
      return res.status(502).json({ 
        success: false, 
        error: 'Failed to fetch token data from external API',
        details: error.message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
}
