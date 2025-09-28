// scripts/nfc.js
export async function issueCard(userId) {
  try {
    const response = await fetch(`https://api.flamebank.ac/nfc/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, initial_balance: 1000000 })
    });
    if (!response.ok) throw new Error('NFC issuance failed');
    return await response.json();
  } catch (err) {
    console.error('issueCard error:', err);
    throw err;
  }
}