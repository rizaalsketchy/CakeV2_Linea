import express from "express";
import cors from "cors";
import Moralis from "moralis";

// Inisialisasi Express
const app = express();
app.use(cors());

// Inisialisasi Moralis
const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImMzOGEwMDRmLWZiN2YtNDc0Mi1iODY0LTNlMjJkZjFiMjYzNiIsIm9yZ0lkIjoiNDE1NDY4IiwidXNlcklkIjoiNDI2OTgxIiwidHlwZUlkIjoiYTMwZmYyNmMtNGU0OC00YTQ0LTg2MmEtMmJlMGZmMGU0NDdlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzExNDIxODcsImV4cCI6NDg4NjkwMjE4N30.RuooKtDNumak-ycuFQfiYPYxpDaNOcSqydxBHmNUf6w"; // Ganti dengan API Key Anda
await Moralis.start({ apiKey: MORALIS_API_KEY });

// Endpoint untuk mendapatkan posisi DeFi
app.get("/defi-positions", async (req, res) => {
  const address = req.query.address; // Alamat wallet dari frontend
  console.log("Received address:", address); // Log input address

  if (!address) {
    console.log("Error: No wallet address provided"); // Log error jika address kosong
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    // Memanggil API Moralis
    const response = await Moralis.EvmApi.wallets.getDefiPositionsByProtocol({
      chain: "0xe705", // Chain ID untuk Linea Mainnet
      address: address,
      protocol: "pancakeswap-v2",
    });
    console.log("Moralis response:", response.raw); // Log respons dari Moralis
    res.json(response.raw); // Kirimkan data ke frontend
  } catch (error) {
    // Log error saat memanggil API Moralis
    console.error("Error calling Moralis API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
