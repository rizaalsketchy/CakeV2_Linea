const express = require('express');
const cors = require('cors');
const Moralis = require('moralis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Moralis
const initMoralis = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
};

initMoralis();

// API endpoint yang diperbaiki
app.post('/api/check-position', async (req, res) => {
  try {
    const { address } = req.body;
    
    const response = await Moralis.EvmApi.defi.getWalletPositions({
      "chain": "0xe705",
      "protocol": "pancakeswap-v2",
      "address": address
    });

    res.json(response.raw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
