const express = require('express');
const cors = require('cors');
const Moralis = require('moralis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Moralis
const initMoralis = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY
  });
};

initMoralis();

// API endpoint to get LP positions
app.post('/api/get-positions', async (req, res) => {
  try {
    const { address } = req.body;
    
    const response = await Moralis.EvmApi.wallets.getDefiPositionsByProtocol({
      chain: "0xe705", // Core chain
      protocol: "pancakeswap-v2",
      address: address
    });

    res.json(response.raw);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
