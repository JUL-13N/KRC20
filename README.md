# 🪙 Kaspa KRC20 Token API

A simple, serverless API proxy for fetching KRC20 token information from the Kaspa network. Built with Vercel serverless functions, this API provides easy access to token data with normalized decimal precision and multiple endpoint formats.

## ✨ Features

- **Real-time token data** from Kasplex API
- **Normalized decimal precision** for accurate supply calculations  
- **Multiple endpoint formats** (JSON and plain text)
- **CORS enabled** for public access
- **Error handling** with proper HTTP status codes
- **Default fallback** to NACHO token
- **Serverless architecture** for scalability

## 🚀 Live API

**Base URL:** `https://your-vercel-deployment.vercel.app`

## 📋 API Endpoints

### 1. Complete Token Information
```
GET /api?token={ticker}
```
Returns comprehensive token metadata as JSON with normalized decimal values.

**Example:**
```bash
curl "https://your-api.vercel.app/api?token=nacho"
```

**Response:**
```json
{
  "tick": "NACHO",
  "max": 21000000,
  "lim": 1000,
  "pre": 0,
  "to": "kaspa:address...",
  "dec": 8,
  "minted": 15000000,
  "burned": 0,
  "holder": [
    {
      "address": "kaspa:address...",
      "amount": 500000
    }
  ]
}
```

### 2. Total Supply
```
GET /api/total?token={ticker}
```
Returns the total supply as plain text, normalized by decimal precision.

**Example:**
```bash
curl "https://your-api.vercel.app/api/total?token=nacho"
# Returns: 21000000
```

### 3. Circulating Supply
```
GET /api/circulating?token={ticker}
```
Returns the circulating supply as plain text (total supply minus pre-minted tokens).

**Example:**
```bash
curl "https://your-api.vercel.app/api/circulating?token=nacho"
# Returns: 21000000
```

### 4. Landing Page
```
GET /api
```
Displays an interactive HTML documentation page when no token parameter is provided.

## 🏗️ Project Structure

```
├── api/
│   ├── index.js         # Main endpoint + landing page
│   ├── total.js         # Total supply endpoint  
│   └── circulating.js   # Circulating supply endpoint
└── README.md
```

### File Descriptions

- **`api/index.js`** - Main handler that serves both the landing page (when no token specified) and complete token data (when token specified)
- **`api/total.js`** - Dedicated endpoint for fetching total supply with decimal normalization
- **`api/circulating.js`** - Calculates and returns circulating supply (max - pre-minted)

## 🔧 How It Works

1. **Proxy Layer**: Acts as a simplified proxy to the [Kasplex API](https://api.kasplex.org/v1/krc20/token/)
2. **Decimal Normalization**: Automatically adjusts values based on each token's decimal precision
3. **Multiple Formats**: Provides both JSON (complete data) and plain text (supply only) responses
4. **Error Handling**: Graceful fallbacks with appropriate HTTP status codes

## 💡 Usage Examples

### JavaScript/Node.js
```javascript
// Get complete token data
const response = await fetch('https://your-api.vercel.app/api?token=nacho');
const tokenData = await response.json();

// Get just the total supply
const totalSupply = await fetch('https://your-api.vercel.app/api/total?token=nacho');
const supply = await totalSupply.text();

// Get circulating supply
const circulating = await fetch('https://your-api.vercel.app/api/circulating?token=nacho');
const circulatingSupply = await circulating.text();
```

### Python
```python
import requests

# Complete token data
response = requests.get('https://your-api.vercel.app/api?token=nacho')
token_data = response.json()

# Total supply only
total_supply = requests.get('https://your-api.vercel.app/api/total?token=nacho').text

# Circulating supply
circulating_supply = requests.get('https://your-api.vercel.app/api/circulating?token=nacho').text
```

### cURL
```bash
# Complete data
curl "https://your-api.vercel.app/api?token=nacho"

# Total supply
curl "https://your-api.vercel.app/api/total?token=nacho"

# Circulating supply  
curl "https://your-api.vercel.app/api/circulating?token=nacho"
```

## 🎯 Supported Tokens

This API works with any KRC20 token available on the Kaspa network. Popular token example:

- `nacho` - Nacho the Kat (NACHO) token
- And many others...

## 🚀 Deployment

### Deploy to Vercel

1. Clone this repository
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel`
4. Your API will be available at `https://your-project.vercel.app`

### Environment Variables

No environment variables required - the API is designed to work out of the box.

## 🔍 Response Headers

All endpoints include these helpful headers:

- `Access-Control-Allow-Origin: *` - CORS enabled
- `X-Source-Code: https://github.com/JUL-13N/KRC20` - Source code reference
- `X-API-Version: 1.0.1` - Current API version

## ⚠️ Error Handling

The API provides clear error messages with appropriate HTTP status codes:

- **404**: Token not found or invalid token data
- **500**: Network error or API failure

Example error response:
```json
{
  "error": "Token data not found for: invalidtoken"
}
```

## 🔗 Data Source

This API fetches data from the official [Kasplex API](https://docs-kasplex.gitbook.io/krc20/tools-and-reference/kasplex-indexer-api/krc-20/get-token-info), which provides comprehensive KRC20 token indexing for the Kaspa network.

## 📝 License

MIT License - feel free to use this API for your projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/JUL-13N/KRC20/issues)
2. Review the [Kasplex API Documentation](https://docs-kasplex.gitbook.io/krc20/)
3. Open a new issue with detailed information

---

**Made with ❤️ for the Kaspa community**
