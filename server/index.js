import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// -------------------- ACH Endpoints --------------------
app.get('/ach/:accountId/balance', async (req, res) => {
  const { accountId } = req.params;
  try {
    const response = await fetch(`https://api.achprovider.com/v1/accounts/${accountId}/balance`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.ACH_API_KEY}` }
    });
    const data = await response.json();
    res.json({ balance: data.balance || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ACH balance' });
  }
});

app.post('/ach/payments', async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) return res.status(400).json({ error: 'Missing fields' });
  try {
    const response = await fetch('https://api.achprovider.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ACH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, amount })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'ACH payment failed' });
  }
});

// -------------------- NFC Endpoint --------------------
app.post('/nfc/issue', async (req, res) => {
  const { user_id, initial_balance } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    const response = await fetch('https://api.nfcprovider.com/v1/cards', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NFC_ISSUER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id, initial_balance: initial_balance || 1000000 })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue NFC card' });
  }
});

// -------------------- Ledger Endpoint --------------------
app.post('/ledger/sync/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await fetch(`${process.env.LEDGER_RPC_URL}/users/${userId}/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEDGER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Ledger sync failed' });
  }
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`Flamebank API server running on port ${PORT}`);
});
}
}