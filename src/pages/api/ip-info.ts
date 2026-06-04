import type { NextApiRequest, NextApiResponse } from 'next';
import geoip from 'geoip-lite';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ip } = req.query;
  if (!ip || typeof ip !== 'string') return res.status(400).json({ country: null });
  const geo = geoip.lookup(ip);
  res.status(200).json({ country: geo?.country?.toLowerCase() || null });
}