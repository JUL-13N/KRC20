
export default async function handler(req, res) {
  // Basic test first
  try {
    // Test without axios first
    const response = await fetch('https://api.kasplex.org/v1/krc20/token/NACHO');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const maxRaw = data?.result?.[0]?.max;
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(maxRaw ? String(maxRaw) : 'No max found');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(`Error: ${err.message}`);
  }
}
