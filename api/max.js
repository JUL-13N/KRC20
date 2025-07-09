import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { data } = await axios.get('https://api.kasplex.org/v1/krc20/token/NACHO');
    const max = data?.result?.[0]?.max;
    res.status(200).json({ max });
  } catch {
    res.status(500).json({ error: 'Fetch failed' });
  }
}
