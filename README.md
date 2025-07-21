# 🪙 Kaspa KRC20 Token API

A simple, serverless API proxy for fetching KRC20 token information from the Kaspa network. Built with Vercel serverless functions, this API provides easy access to token data with normalized decimal precision, enhanced supply calculations, and multiple endpoint formats.

## ✨ Features

- **Real-time token data** from Kasplex API
- **Enhanced supply calculations** with multiple formula approaches
- **Normalized decimal precision** for accurate supply calculations  
- **Multiple endpoint formats** (JSON and plain text)
- **Unlocked circulating supply** calculations
- **CORS enabled** for public access
- **Error handling** with proper HTTP status codes
- **Default fallback** to NACHO token
- **Interactive HTML documentation** landing page
- **Serverless architecture** for scalability

## 🚀 Live API

**Base URL:** `https://your-vercel-deployment.vercel.app`

## 📋 API Endpoints

### 1. Complete Token Information
```
GET /api?token={ticker}
```
Returns comprehensive token metadata as JSON with enhanced supply metrics and normalized decimal values.

**Example:**
```bash
curl "https://your-api.vercel.app/api?token=nacho"
```

**Response:**
```json
{
  "tick": "NACHO",
  "max": "28700000000000000000",
  "lim": "2870000000000",
  "pre": "0",
  "to": "kaspa:qzrsq2mfj9sf7uye3u5q7juejzlr0axk5jz9fpg4vqe76erdyvxxze84k9nk7",
  "dec": "8",
  "mod": "mint",
  "minted": "28700000000000000000",
  "burned": "0",
  "calculatedCirculatingSupply": 287000000000,
  "calculatedTotalSupply": 287000000000,
  "calculatedMaxSupply": 287000000000,
  "calculatedUnmintedSupply": 0,
  "calculatedBurnedSupply": 0,
  "calculatedLockedSupply": 0,
  "supplyMetrics": {
    "maxSupply": 287000000000,
    "totalSupply": 287000000000,
    "circulatingSupply": 287000000000,
    "unmintedSupply": 0,
    "burnedSupply": 0,
    "lockedSupply": 0,
    "decimals": 8,
    "formula": "Unlocked Circulating = Max - Unminted - Burned - Locked",
    "simplifiedFormula": "Unlocked Circulating = Minted - Burned - Locked",
    "note": "This calculation uses the unlocked-circulating.js formula"
  },
  "opScoreAdd": "834430020006",
  "opScoreMod": "901615480027",
  "state": "finished",
  "hashRev": "85359b7768ba60cde4559b6e03ef2685d27ca7be3b1fa2cda976743e17f7c3ad",
  "mtsAdd": "1719757838224",
  "holderTotal": "18136",
  "transferTotal": "259524",
  "mintTotal": "10000000"
}
```

### 2. Total Supply
```
GET /api/total?token={ticker}
```
Returns the total minted supply as plain text, normalized by decimal precision.

**Example:**
```bash
curl "https://your-api.vercel.app/api/total?token=nacho"
# Returns: 287000000000
```

### 3. Circulating Supply
```
GET /api/circulating?token={ticker}
```
Returns the circulating supply as plain text using the basic formula (excludes insider/pre-minted tokens from max supply).

**Formula:** `(Max Supply - Insider Supply - Burnt Supply) / 10^Decimals`

**Example:**
```bash
curl "https://your-api.vercel.app/api/circulating?token=nacho"
# Returns: 287000000000
```

### 4. Unlocked Circulating Supply
```
GET /api/unlocked-circulating?token={ticker}
```
Returns the unlocked circulating supply as plain text using the comprehensive formula that accounts for all minted, burned, and locked tokens.

**Formula:** `Max Supply - Unminted Supply - Burnt Supply - Locked Supply`
**Simplified:** `Minted Supply - Burnt Supply - Locked Supply`

**Example:**
```bash
curl "https://your-api.vercel.app/api/unlocked-circulating?token=nacho"
# Returns: 287000000000
```

### 5. Interactive Documentation
```
GET /api
```
Displays a comprehensive HTML documentation page with live examples, formula explanations, and interactive links when no token parameter is provided.

## 🧮 Supply Calculation Formulas

The API provides two different approaches for calculating circulating supply:

### Basic Circulating Supply Formula
Used by `/api/circulating` endpoint:
```
Circulating Supply = (Max Supply - Insider Supply - Burnt Supply) / 10^Decimals

Where:
• Max Supply = "max" field
• Insider Supply = "pre"-minted supply  
• Burnt Supply = "burned" field
• Decimals = "dec" decimal precision field
```

### Unlocked Circulating Supply Formula  
Used by `/api/unlocked-circulating` endpoint and main API enhanced data:
```
Unlocked Circulating Supply = Max Supply - Unminted Supply - Burnt Supply - Locked Supply

Where:
• Max Supply = "max" field
• Unminted Supply = "max" - "minted"
• Burnt Supply = "burned" field  
• Locked Supply = "pre"-minted field

Simplified: Minted Supply - Burnt Supply - Locked Supply
```

All values are normalized by dividing by 10^("dec") for proper decimal precision.

## 🏗️ Project Structure

```
├── api/
│   ├── index.js                # Main endpoint + landing page + enhanced calculations
│   ├── total.js               # Total supply endpoint  
│   ├── circulating.js         # Basic circulating supply endpoint
│   └── unlocked-circulating.js # Unlocked circulating supply endpoint
└── README.md
```

### File Descriptions

- **`api/index.js`** - Main handler that serves the interactive landing page (when no token specified) and complete enhanced token data with supply metrics (when token specified)
- **`api/total.js`** - Dedicated endpoint for fetching total minted supply with decimal normalization
- **`api/circulating.js`** - Calculates and returns basic circulating supply (max - pre-minted - burned)
- **`api/unlocked-circulating.js`** - Calculates and returns comprehensive unlocked circulating supply

## 🔧 How It Works

1. **Proxy Layer**: Acts as a simplified proxy to the [Kasplex API](https://api.kasplex.org/v1/krc20/token/nacho)
2. **Enhanced Calculations**: Provides multiple supply calculation methods with different approaches
3. **Decimal Normalization**: Automatically adjusts values based on each token's decimal precision
4. **Multiple Formats**: Provides both JSON (complete data with metrics) and plain text (supply only) responses
5. **Interactive Documentation**: Self-documenting API with built-in examples and formula explanations
6. **Error Handling**: Graceful fallbacks with appropriate HTTP status codes

## 💡 Usage Examples

### JavaScript/Node.js
```javascript
// Get complete token data with enhanced supply metrics
const response = await fetch('https://your-api.vercel.app/api?token=nacho');
const tokenData = await response.json();
console.log(tokenData.supplyMetrics); // Access enhanced supply calculations

// Get just the total supply
const totalSupply = await fetch('https://your-api.vercel.app/api/total?token=nacho');
const supply = await totalSupply.text();

// Get basic circulating supply
const circulating = await fetch('https://your-api.vercel.app/api/circulating?token=nacho');
const circulatingSupply = await circulating.text();

// Get unlocked circulating supply
const unlocked = await fetch('https://your-api.vercel.app/api/unlocked-circulating?token=nacho');
const unlockedSupply = await unlocked.text();
```

### Python
```python
import requests

# Complete token data with supply metrics
response = requests.get('https://your-api.vercel.app/api?token=nacho')
token_data = response.json()
supply_metrics = token_data.get('supplyMetrics', {})

# Total supply only
total_supply = requests.get('https://your-api.vercel.app/api/total?token=nacho').text

# Basic circulating supply
circulating_supply = requests.get('https://your-api.vercel.app/api/circulating?token=nacho').text

# Unlocked circulating supply
unlocked_supply = requests.get('https://your-api.vercel.app/api/unlocked-circulating?token=nacho').text
```

### cURL
```bash
# Complete data with enhanced metrics
curl "https://your-api.vercel.app/api?token=nacho"

# Total supply
curl "https://your-api.vercel.app/api/total?token=nacho"

# Basic circulating supply
curl "https://your-api.vercel.app/api/circulating?token=nacho"

# Unlocked circulating supply
curl "https://your-api.vercel.app/api/unlocked-circulating?token=nacho"

# View interactive documentation
curl "https://your-api.vercel.app/api"
```

## 🎯 Supported Tokens

This API works with any KRC20 token available on the Kaspa network. Popular tokens include:

- `nacho` - Nacho the Kat (NACHO)
- `kango` - Kango token
- `kaspy` - Kaspy token
- And many others available on the Kaspa network

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
- `X-API-Version: 1.1.0` - Current API version

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

## 📊 Enhanced Data Fields

The main API endpoint (`/api?token=X`) now includes additional calculated fields:

- `calculatedCirculatingSupply` - Unlocked circulating supply using the comprehensive formula
- `calculatedTotalSupply` - Minted supply normalized by decimals
- `calculatedMaxSupply` - Maximum supply normalized by decimals
- `calculatedUnmintedSupply` - Remaining unminted tokens
- `calculatedBurnedSupply` - Burned tokens normalized by decimals
- `calculatedLockedSupply` - Locked/pre-minted tokens normalized by decimals
- `supplyMetrics` - Object containing all supply calculations with formulas and explanations

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
