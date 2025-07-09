Javascript

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { data } = await axios.get('https://api.kasplex.org/v1/krc20/token/NACHO');
    const maxRaw = data?.result?.[0]?.max;
    const maxNumeric = BigInt(maxRaw); // handles very large value

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(maxNumeric.toString()); // return number as raw text
  } catch (err) {
    res.status(500).send('Error fetching max supply');
  }
}
