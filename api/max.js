// File: api/max.js
// Usage: /api/max?token=NACHO

export default async function handler(req, res) {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token parameter is required' });
    }
    
    // Fetch data from the original API
    const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${token}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the max value from the first result
    const maxValue = data.result?.[0]?.max;
    
    if (!maxValue) {
      return res.status(404).json({ error: 'Max value not found' });
    }
    
    // Return just the max value as plain text
    res.status(200).send(maxValue);
    
  } catch (error) {
    console.error(`Error fetching ${token} data:`, error);
    res.status(500).json({ error: `Failed to fetch ${token} max value` });
  }
}
