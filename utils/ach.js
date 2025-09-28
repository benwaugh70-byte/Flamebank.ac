// utils/ach.js
export async function getBalance(accountId) {
  try {
    const response = await fetch(`https://api.flamebank.ac/ach/${accountId}/balance`);
    if (!response.ok) throw new Error('Failed to fetch balance');
    const data = await response.json();
    return data.balance; // number
  } catch (err) {
    console.error('getBalance error:', err);
    throw err;
  }
}

export async function sendPayment(fromId, toId, amount) {
  try {
    const response = await fetch(`https://api.flamebank.ac/ach/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromId, to: toId, amount })
    });
    if (!response.ok) throw new Error('Payment failed');
    return await response.json();
  } catch (err) {
    console.error('sendPayment error:', err);
    throw err;
  }
}