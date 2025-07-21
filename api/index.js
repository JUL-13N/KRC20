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
      <h1>🌮 NACHO Token API</h1>
      
      <p>Free public API for NACHO token data on Kaspa blockchain.</p>
      
      <h2>📡 Available Endpoints:</h2>
      
      <div class="endpoint">
        <strong>GET</strong> <code>/api/nacho-max</code><br>
        Returns the max supply as plain text<br>
        <small>Example: <a href="/api/nacho-max" target="_blank">Try it now</a></small>
      </div>
      
      <h2>💻 Source Code:</h2>
      <p>This API is open source! View the code on GitHub:</p>
      <p><a href="https://github.com/yourusername/your-repo" target="_blank">
        https://github.com/yourusername/your-repo
      </a></p>
      
      <h2>🔧 Usage Examples:</h2>
      <pre><code>curl https://${req.headers.host}/api/nacho-max</code></pre>
      
      <pre><code>fetch('https://${req.headers.host}/api/nacho-max')
  .then(r => r.text())
  .then(console.log)</code></pre>
      
      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #333; color: #888;">
        <small>No rate limits • No API key required • CORS enabled</small>
      </footer>
    </body>
    </html>
  `;
  
  res.status(200).send(html);
}
