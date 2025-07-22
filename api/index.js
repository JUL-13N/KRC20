// File: api/index.js
// Usage: Shows landing page when accessing /api/ without query parameters

export default async function handler(req, res) {
  // Add CORS headers to make API publicly accessible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add custom headers to show GitHub repo
  res.setHeader('X-Source-Code', 'https://github.com/JUL-13N/KRC20');
  res.setHeader('X-API-Version', '1.1.0');
  
  try {
    // Get the token from query parameter
    const token = req.query.token;
    
    // If no token parameter is provided, show the landing page
    if (!token) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kaspa KRC20 Token API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #7f8c8d;
            margin-bottom: 30px;
        }
        .endpoint {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
        }
        .example {
            background: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 15px;
            margin: 15px 0;
        }
        .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .formula {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        .formula-alt {
            background: #f3e5f5;
            border-left: 4px solid #9c27b0;
            padding: 15px;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
            text-align: center;
        }
        code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🪙 Kaspa KRC20 Token API</h1>
        <p class="subtitle">Simple API to fetch KRC20 token information from Kasplex</p>
        
        <h2>📋 Endpoints</h2>
        
        <h3>Get Token Complete Information</h3>
        <div class="endpoint">GET /api?token={ticker}</div>
        <p>Returns real-time and unfiltered token information as JSON for the specified token, including calculated supply metrics.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api?token=nacho">/api?token=nacho</a>
        </div>
        <div style="margin-top: 14px;"></div>
        
        <h3>Get Total Token Supply</h3>
        <div class="endpoint">GET /api/total?token={ticker}</div>
        <p>Returns the total supply value as plain text for the specified token. Based on <code>total.js</code>.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api/total?token=nacho">/api/total?token=nacho</a>
        </div>
        <div style="margin-top: 14px;"></div>
        
        <h3>Get Circulating Supply</h3>
        <div class="endpoint">GET /api/circulating?token={ticker}</div>
        <p>Returns the circulating supply value as plain text, calculated using the formula below. Based on <code>circulating.js</code>.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api/circulating?token=nacho">/api/circulating?token=nacho</a>
        </div>
        <div style="margin-top: 14px;"></div>
        
        <h3>Get Unlocked Circulating Supply</h3>
        <div class="endpoint">GET /api/unlocked-circulating?token={ticker}</div>
        <p>Returns the unlocked circulating supply value as plain text, calculated using the unlocked formula below. Based on <code>unlocked-circulating.js</code>.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api/unlocked-circulating?token=nacho">/api/unlocked-circulating?token=nacho</a>
        </div>
        <br>

        <h2>🧮 Supply Calculation Formulas</h2>
        
        <h3>Circulating Supply Formula</h3>
        <div class="formula">
            <strong>Circulating Supply = (Max Supply - Insider Supply - Burnt Supply) / 10^Decimals</strong><br><br>
            Where:<br>
            • Max Supply = "max" field<br>
            • Insider Supply = "pre"-minted supply<br>
            • Burnt Supply = "burned" field<br>
            • Decimals = "dec" decimal precision field
        </div>

        <h3>Unlocked Circulating Supply Formula</h3>
        <div class="formula-alt">
            <strong>Unlocked Circulating Supply = Max Supply - Unminted Supply - Burnt Supply - Locked Supply</strong><br><br>
            Where:<br>
            • Max Supply = "max" field<br>
            • Unminted Supply = "max" - "minted"<br>
            • Burnt Supply = "burned" field<br>
            • Locked Supply = "pre"-minted field<br><br>
            All values are divided by 10^("dec") for decimal precision.
        </div>
        <p>The unlocked formula simplifies to: <code>Minted Supply - Burnt Supply - Locked Supply</code></p>
        
        <div class="note">
            <strong>📌 Note:</strong> If no token parameter is provided, defaults to NACHO token. The two circulating supply calculations use different approaches:
            <ul>
                <li><strong>Circulating Supply:</strong> Excludes burnt and insider/pre-minted tokens from max supply</li>
                <li><strong>Unlocked Circulating Supply:</strong> Accounts for all unminted, burned, and locked tokens</li>
            </ul>
        </div> 
        <br>

        <h2>🔧 Usage</h2>
        <p>This API acts as a proxy to the <a href="https://api.kasplex.org/v1/krc20/token/nacho" target="_blank">Kasplex API</a> with simplified endpoints and enhanced supply calculations for easy integration.</p>
        
        <h3>Supported Tokens</h3>
        <p>Popular tokens include: <code>nacho</code>, <code>kango</code>, <code>kaspy</code>, and many others available on the Kaspa network.</p>
        
        <h3>Response Format</h3>
        <ul>
            <li><strong>/api?token=X</strong> - Returns full JSON object of live token data with calculated supply metrics.</li>
            <li><strong>/api/total?token=X</strong> - Returns the total minted supply, normalized by decimal precision.</li>
            <li><strong>/api/circulating?token=X</strong> - Returns the circulating supply using the basic formula (excludes insider supply).</li>
            <li><strong>/api/unlocked-circulating?token=X</strong> - Returns the unlocked circulating supply using the comprehensive formula.</li>
        </ul>
        
        <h3>Enhanced Data Fields</h3>
        <p>The main API endpoint now includes additional calculated fields:</p>
        <ul>
            <li><code>calculatedCirculatingSupply</code> - Unlocked circulating supply using the comprehensive formula</li>
            <li><code>calculatedTotalSupply</code> - Minted supply normalized by decimals</li>
            <li><code>unmintedSupply</code> - Remaining unminted tokens</li>
            <li><code>supplyMetrics</code> - Object containing all supply calculations</li>
        </ul>
        
        <div class="footer">
            <p>🔗 <a href="https://github.com/JUL-13N/KRC20" target="_blank">View Source Code</a></p>
            <p>Powered by <a href="https://docs-kasplex.gitbook.io/krc20/tools-and-reference/kasplex-indexer-api/krc-20/get-token-info" target="_blank">Kasplex Gitbook</a></p>
        </div>
    </div>
</body>
</html>
      `);
    }
    
    // If token parameter is provided, handle the token request
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
    
    // Calculate enhanced supply metrics using the unlocked circulating supply formula (unlocked-circulating.js)
    const maxSupply = BigInt(tokenData.max || '0');
    const mintedSupply = BigInt(tokenData.minted || '0');
    const burnedSupply = BigInt(tokenData.burned || '0');
    const lockedSupply = BigInt(tokenData.pre || '0');
    const decimals = parseInt(tokenData.dec || '0');
    
    // Calculate components
    const unmintedSupply = maxSupply - mintedSupply;
    
    // Apply the unlocked circulating supply formula: Max Supply - Unminted Supply - Burnt Supply - Locked Supply
    // = Max Supply - Max Supply + Minted Supply - Burnt Supply - Locked Supply
    // This simplifies to: Minted Supply - Burnt Supply - Locked Supply
    const circulatingSupplyRaw = mintedSupply - burnedSupply - lockedSupply;
    
    // Convert to decimal by dividing by 10^decimals
    const divisor = BigInt(10 ** decimals);
    const calculatedCirculatingSupply = Number(circulatingSupplyRaw) / Number(divisor);
    const calculatedTotalSupply = Number(mintedSupply) / Number(divisor);
    const calculatedMaxSupply = Number(maxSupply) / Number(divisor);
    const calculatedUnmintedSupply = Number(unmintedSupply) / Number(divisor);
    const calculatedBurnedSupply = Number(burnedSupply) / Number(divisor);
    const calculatedLockedSupply = Number(lockedSupply) / Number(divisor);
    
    // Add calculated fields to the response
    const enhancedTokenData = {
      ...tokenData,
      calculatedCirculatingSupply, // This uses the unlocked-circulating.js formula
      calculatedTotalSupply,
      calculatedMaxSupply,
      calculatedUnmintedSupply,
      calculatedBurnedSupply,
      calculatedLockedSupply,
      supplyMetrics: {
        maxSupply: calculatedMaxSupply,
        totalSupply: calculatedTotalSupply,
        circulatingSupply: calculatedCirculatingSupply, // Unlocked circulating supply
        unmintedSupply: calculatedUnmintedSupply,
        burnedSupply: calculatedBurnedSupply,
        lockedSupply: calculatedLockedSupply,
        decimals: decimals,
        formula: "Unlocked Circulating = Max - Unminted - Burned - Locked",
        simplifiedFormula: "Unlocked Circulating = Minted - Burned - Locked",
        note: "This calculation uses the unlocked-circulating.js formula"
      }
    };
    
    // Return enhanced token data as JSON
    res.status(200).json(enhancedTokenData);
    
  } catch (error) {
    const token = req.query.token || 'NACHO';
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} data` });
  }
}
