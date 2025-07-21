// File: api/circulating.js
// Purpose: Return the circulating supply for a given Kaspa KRC20 token, adjusted by its decimal precision.
// Usage: /api/circulating?token={ticker} (returns circulating supply for any given token)
// Default token is NACHO if no token parameter is provided

// Serverless route entry point
async function fetchCirculatingSupply() {
  try {
    // Fetch token data from the API
    const response = await fetch('https://kaspage.vercel.app/api?token=NACHO');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract values from the API response
    const maxSupply = BigInt(data.max);
    const mintedSupply = BigInt(data.minted);
    const burnedSupply = BigInt(data.burned);
    const lockedSupply = BigInt(data.pre);
    const decimals = parseInt(data.dec);
    
    // Calculate components
    const unmintedSupply = maxSupply - mintedSupply;
    
    // Apply the formula: Circulating Supply = Max Supply - Unminted Supply - Burnt Supply - Locked Supply
    const circulatingSupplyRaw = maxSupply - unmintedSupply - burnedSupply - lockedSupply;
    
    // Simplifying: Max Supply - (Max Supply - Minted Supply) - Burnt Supply - Locked Supply
    // = Max Supply - Max Supply + Minted Supply - Burnt Supply - Locked Supply
    // = Minted Supply - Burnt Supply - Locked Supply
    const simplifiedCirculatingSupplyRaw = mintedSupply - burnedSupply - lockedSupply;
    
    // Convert to decimal by dividing by 10^decimals
    const divisor = BigInt(10 ** decimals);
    const circulatingSupply = Number(simplifiedCirculatingSupplyRaw) / Number(divisor);
    
    return {
      circulatingSupply: circulatingSupply,
      maxSupply: Number(maxSupply) / Number(divisor),
      mintedSupply: Number(mintedSupply) / Number(divisor),
      burnedSupply: Number(burnedSupply) / Number(divisor),
      lockedSupply: Number(lockedSupply) / Number(divisor),
      unmintedSupply: Number(unmintedSupply) / Number(divisor),
      decimals: decimals,
      rawData: data
    };
    
  } catch (error) {
    console.error('Error fetching circulating supply:', error);
    throw error;
  }
}

// Function to format numbers with commas
function formatNumber(num) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  });
}

// Main function to get and display circulating supply
async function getCirculatingSupply() {
  try {
    const result = await fetchCirculatingSupply();
    
    console.log('NACHO Token Supply Information:');
    console.log('================================');
    console.log(`Circulating Supply: ${formatNumber(result.circulatingSupply)} NACHO`);
    console.log(`Max Supply: ${formatNumber(result.maxSupply)} NACHO`);
    console.log(`Minted Supply: ${formatNumber(result.mintedSupply)} NACHO`);
    console.log(`Burned Supply: ${formatNumber(result.burnedSupply)} NACHO`);
    console.log(`Locked Supply: ${formatNumber(result.lockedSupply)} NACHO`);
    console.log(`Unminted Supply: ${formatNumber(result.unmintedSupply)} NACHO`);
    console.log(`Decimals: ${result.decimals}`);
    
    return result.circulatingSupply;
    
  } catch (error) {
    console.error('Failed to get circulating supply:', error);
    return null;
  }
}

// For browser usage - attach to window object
if (typeof window !== 'undefined') {
  window.getCirculatingSupply = getCirculatingSupply;
  window.fetchCirculatingSupply = fetchCirculatingSupply;
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCirculatingSupply,
    fetchCirculatingSupply,
    formatNumber
  };
}

// Auto-execute if called directly
if (typeof window !== 'undefined') {
  // Browser environment - you can call getCirculatingSupply() manually
  console.log('Circulating supply functions loaded. Call getCirculatingSupply() to fetch data.');
} else {
  // Node.js environment - auto-execute
  getCirculatingSupply();
}
