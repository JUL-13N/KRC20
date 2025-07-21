// File: api/index.js
// This creates a landing page at https://kaspage.vercel.app/api/

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>NACHO Token API</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px;
          background: #1a1a1a;
          color: #ffffff;
        }
        .endpoint { 
          background: #2d2d2d; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 10px 0;
          border-left: 4px solid #00d4ff;
        }
        a { color: #00d4ff; }
        code { 
          background: #000; 
          padding: 2px 6px; 
          border-radius: 4px;
          color: #00ff88;
        }
      </style>
    </head>
    <body>
      <h1>🪙 KRC-20 Token API</h1>
      
      <p>Free public API for <strong>ANY</strong> KRC-20 token data on Kaspa blockchain.</p>
      
      <h2>📡 Available Endpoints:</h2>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/token/{TOKEN}/{FIELD}</code><br>
        Get specific field for any token<br>
        <small>Examples: 
          <a href="/api/token/NACHO/max" target="_blank">/api/token/NACHO/max</a> | 
          <a href="/api/token/NACHO/minted" target="_blank">/api/token/NACHO/minted</a>
        </small>
      </div>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/token/{TOKEN}</code><br>
        Get all data for any token as JSON<br>
        <small>Example: <a href="/api/token/NACHO" target="_blank">/api/token/NACHO</a></small>
      </div>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/info/{TOKEN}</code><br>
        List available fields for any token<br>
        <small>Example: <a href="/api/info/NACHO" target="_blank">/api/info/NACHO</a></small>
      </div>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/nacho-max</code><br>
        Legacy endpoint for NACHO max supply<br>
        <small>Example: <a href="/api/nacho-max" target="_blank">Try it now</a></small>
      </div>
      
      <h2>💻 Source Code:</h2>
      <p>This API is open source! View the code on GitHub:</p>
      <p><a href="https://github.com/yourusername/your-repo" target="_blank">
        https://github.com/yourusername/your-repo
      </a></p>
      
      <h2>🔧 Usage Examples:</h2>
      <pre><code># Get NACHO max supply
curl https://${req.headers.host}/api/token/NACHO/max

# Get any token's minted amount  
curl https://${req.headers.host}/api/token/BITCOIN/minted

# Get holder count for any token
curl https://${req.headers.host}/api/token/ETHEREUM/holderTotal

# Get all data for a token
curl https://${req.headers.host}/api/token/NACHO</code></pre>
      
      <pre><code>// JavaScript examples
// Get specific field
const maxSupply = await fetch('/api/token/NACHO/max').then(r => r.text());

// Get all token info  
const tokenData = await fetch('/api/token/NACHO').then(r => r.json());

// Check available fields
const fields = await fetch('/api/info/NACHO').then(r => r.json());</code></pre>
      
      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #333; color: #888;">
        <small>No rate limits • No API key required • CORS enabled</small>
      </footer>
    </body>
    </html>
  `;
  
  res.status(200).send(html);
}
