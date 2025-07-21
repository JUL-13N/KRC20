// File: api/total.js
// Purpose: Serve complete token data and the total supply from Kasplex API, normalized by decimal precision.
// Usage: /api/total?token={ticker} (returns just total value for any given token)
// Usage: /api?token={ticker} (returns all token info for {ticker})
// Default token is NACHO if no token parameter is provided

// Entry point for the serverless API route
export default async function handler(req, res) {
  // 🌐 CORS setup: allow public access from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 📦 Metadata headers: GitHub source + API versioning
  res.setHeader('X-Source-Code', 'https://github.com/JUL-13N/KRC20');
  res.setHeader('X-API-Version', '1.0.1');

  try {
    // 🔍 Token query param: fallback to 'NACHO' if none provided
    const token = req.query.token || 'NACHO';

    // 🧠 Detect endpoint type based on URL
    const isTotalEndpoint = req.url.includes('/max');

    // 🔗 Fetch token data from Kasplex’s public API
    const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${token}`);

    // 🚨 Check for request failure
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // 📥 Parse JSON response
    const data = await response.json();

    // 🧪 Sanity check: valid structure & data presence
    if (!data.result || !data.result[0]) {
      return res.status(404).json({ error: `Token data not found for: ${token}` });
    }

    // 📊 Extract token metadata
    const tokenData = data.result[0];

    // 🔢 Get the decimal precision (e.g., 8 for NACHO)
    // If undefined, fallback to '0' to avoid NaN errors
    const decimals = parseInt(tokenData.dec || '0', 10);

    // 📉 Calculate divisor: 10 to the power of 'decimals'
    const divisor = Math.pow(10, decimals);

    // 🔓 If endpoint is /api/total, return adjusted total value only
    if (isTotalEndpoint) {
      // Make sure total exists and is a number
      const totalValue = parseFloat(tokenData.max);
      if (isNaN(totalValue)) {
        return res.status(404).json({ error: `Max value not found for token: ${token}` });
      }

      // 📐 Normalize total value by decimal divisor
      const adjustedMaxValue = totalValue / divisor;
      return res.status(200).send(adjustedMaxValue.toString());
    } else {
      // 🧮 Normalize key values for /api endpoint
      if (tokenData.max) {
        tokenData.max = parseFloat(tokenData.max) / divisor;
      }
      if (tokenData.minted) {
        tokenData.minted = parseFloat(tokenData.minted) / divisor;
      }
      if (tokenData.burned && tokenData.burned !== '0') {
        tokenData.burned = parseFloat(tokenData.burned) / divisor;
      }

      // 👥 Normalize individual holder balances (optional, but helpful for UX)
      if (tokenData.holder) {
        tokenData.holder = tokenData.holder.map(h => ({
          ...h,
          amount: parseFloat(h.amount) / divisor
        }));
      }

      // 🚀 Return full token data with adjusted fields
      return res.status(200).json(tokenData);
    }
  } catch (error) {
    // ⚠️ Handle unexpected errors and log for debugging
    console.error(`Error fetching ${req.query.token || 'NACHO'} data:`, error);
    return res.status(500).json({ error: `Failed to fetch ${req.query.token || 'NACHO'} data` });
  }
}
