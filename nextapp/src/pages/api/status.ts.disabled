import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: "ok",
    model_ready: true,
    gemini_available: true,
    version: "1.0.0"
  });
}
