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
        .legacy-endpoint {
          background: #2d2d2d; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 10px 0;
          border-left: 4px solid #ff9500;
        }
        a { color: #00d4ff; }
        .legacy a { color: #ff9500; }
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
          <a href="/api/NACHO/max" target="_blank">/api/NACHO/max</a> | 
          <a href="/api/Kaspy/max" target="_blank">/api/Kaspy/max</a> | 
          <a href="/api/Kango/max" target="_blank">/api/Kango/max</a>
        </small>
      </div>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/{TOKEN}</code><br>
        Get all data for any token as JSON<br>
        <small>Examples: 
          <a href="/api/NACHO" target="_blank">/api/NACHO</a> | 
          <a href="/api/Kaspy" target="_blank">/api/Kaspy</a> | 
          <a href="/api/Kango" target="_blank">/api/Kango</a>
        </small>
      </div>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/max?token={TOKEN}</code><br>
        Get max supply for any token (defaults to NACHO if no token specified)<br>
        <small>Examples: 
          <a href="/api/max?token=NACHO" target="_blank">/api/max?token=NACHO</a> | 
          <a href="/api/max?token=Kaspy" target="_blank">/api/max?token=Kaspy</a> | 
          <a href="/api/max?token=Kango" target="_blank">/api/max?token=Kango</a> | 
          <a href="/api/max" target="_blank">/api/max</a> (defaults to NACHO)
        </small>
      </div>
      
      <h2>🔗 Kasplex Legacy Endpoints:</h2>
      <div class="legacy-endpoint legacy">
        <strong>GET</strong> <code>https://api.kasplex.org/v1/krc20/token/{TOKEN}</code><br>
        Direct access to Kasplex API for token information<br>
        <small>Examples: 
          <a href="https://api.kasplex.org/v1/krc20/token/NACHO" target="_blank">NACHO</a> | 
          <a href="https://api.kasplex.org/v1/krc20/token/Kaspy" target="_blank">Kaspy</a> | 
          <a href="https://api.kasplex.org/v1/krc20/token/Kango" target="_blank">Kango</a>
        </small>
      </div>
      
      <h2>💻 Source Code:</h2>
      <p>This API is open source! View the code on GitHub:</p>
      <p><a href="https://github.com/yourusername/your-repo" target="_blank">
        https://github.com/JUL-13N/KRC20
      </a></p>
      
      <h2>🔧 Usage Examples:</h2>
      <pre><code># Get max supply for different tokens using query parameter
curl https://${req.headers.host}/api/max?token=NACHO
curl https://${req.headers.host}/api/max?token=Kaspy  
curl https://${req.headers.host}/api/max?token=Kango
curl https://${req.headers.host}/api/max  # defaults to NACHO

# Get max supply using token path
curl https://${req.headers.host}/api/NACHO/max
curl https://${req.headers.host}/api/Kaspy/max
curl https://${req.headers.host}/api/Kango/max

# Get holder count for any token
curl https://${req.headers.host}/api/ETHEREUM/holderTotal

# Get all data for a token
curl https://${req.headers.host}/api/NACHO

# Direct Kasplex API access
curl https://api.kasplex.org/v1/krc20/token/NACHO
curl https://api.kasplex.org/v1/krc20/token/Kaspy</code></pre>
      
      <pre><code>// JavaScript examples
// Get max supply using query parameter (new generic method)
const nachoMax = await fetch('/api/max?token=NACHO').then(r => r.text());
const kaspyMax = await fetch('/api/max?token=Kaspy').then(r => r.text());
const kangoMax = await fetch('/api/max?token=Kango').then(r => r.text());
const defaultMax = await fetch('/api/max').then(r => r.text()); // defaults to NACHO

// Get max supply using token path 
const nachoMaxPath = await fetch('/api/NACHO/max').then(r => r.text());

// Get all token info  
const tokenData = await fetch('/api/NACHO').then(r => r.json());

// Direct Kasplex API access
const kasplex = await fetch('https://api.kasplex.org/v1/krc20/token/NACHO')
  .then(r => r.json());</code></pre>
      
      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #333; color: #888;">
        <small>No rate limits • No API key required • CORS enabled</small>
      </footer>
    </body>
    </html>
  `;
  
  res.status(200).send(html);
}
