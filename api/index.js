import express from 'express';
import Moralis from 'moralis';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

await Moralis.start({
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImMzOGEwMDRmLWZiN2YtNDc0Mi1iODY0LTNlMjJkZjFiMjYzNiIsIm9yZ0lkIjoiNDE1NDY4IiwidXNlcklkIjoiNDI2OTgxIiwidHlwZUlkIjoiYTMwZmYyNmMtNGU0OC00YTQ0LTg2MmEtMmJlMGZmMGU0NDdlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzExNDIxODcsImV4cCI6NDg4NjkwMjE4N30.RuooKtDNumak-ycuFQfiYPYxpDaNOcSqydxBHmNUf6w"
});

app.get('/defi-positions', async (req, res) => {
  const address = req.query.address; // Ambil address dari query string
  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const response = await Moralis.EvmApi.wallets.getDefiPositionsByProtocol({
      chain: "0xe705",
      address: address, // Gunakan address dari pengguna
      protocol: "pancakeswap-v2",
    });
    res.json(response.raw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
