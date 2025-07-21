// File: api/index.js
// Usage: Shows landing page when accessing /api/ without query parameters

export default async function handler(req, res) {
  // Add CORS headers to make API publicly accessible
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add custom headers to show GitHub repo
  res.setHeader('X-Source-Code', 'https://github.com/JUL-13N/KRC20');
  res.setHeader('X-API-Version', '1.0.0');
  
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
    <title>KRC20 Token API</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🪙 KRC20 Token API</h1>
        <p class="subtitle">Simple API to fetch KRC20 token information from Kasplex</p>
        
        <h2>📋 Endpoints</h2>
        
        <h3>Get Full Token Information</h3>
        <div class="endpoint">GET /api?token=&lt;TOKEN&gt;</div>
        <p>Returns complete token information as JSON for the specified token.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api?token=nacho">/api?token=nacho</a><br>
            <a href="/api?token=kango">/api?token=kango</a><br>
            <a href="/api?token=kaspy">/api?token=kaspy</a>
        </div>
        
        <h3>Get Token Max Supply Only</h3>
        <div class="endpoint">GET /api/max?token=&lt;TOKEN&gt;</div>
        <p>Returns only the maximum supply value as plain text for the specified token.</p>
        <div class="example">
            <strong>Example:</strong><br>
            <a href="/api/max?token=nacho">/api/max?token=nacho</a><br>
            <a href="/api/max?token=kango">/api/max?token=kango</a><br>
            <a href="/api/max?token=kaspy">/api/max?token=kaspy</a>
        </div>
        
        <div class="note">
            <strong>📌 Note:</strong> If no token parameter is provided, defaults to NACHO token.
        </div>
        
        <h2>🔧 Usage</h2>
        <p>This API acts as a proxy to the <a href="https://api.kasplex.org/v1/krc20/token/" target="_blank">Kasplex API</a> with simplified endpoints for easy integration.</p>
        
        <h3>Supported Tokens</h3>
        <p>Popular tokens include: <code>nacho</code>, <code>kango</code>, <code>kaspy</code>, and many others available on the Kaspa network.</p>
        
        <h3>Response Format</h3>
        <ul>
            <li><strong>/api?token=X</strong> - Returns full JSON object with all token data</li>
            <li><strong>/api/max?token=X</strong> - Returns plain text with just the max supply value</li>
        </ul>
        
        <div class="footer">
            <p>🔗 <a href="https://github.com/JUL-13N/KRC20" target="_blank">View Source Code</a></p>
            <p>Powered by <a href="https://kasplex.org" target="_blank">Kasplex API</a></p>
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
    
    // Return all token data as JSON
    res.status(200).json(tokenData);
    
  } catch (error) {
    const token = req.query.token || 'NACHO';
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} data` });
  }
}
