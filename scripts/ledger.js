// scripts/ledger.js
export async function syncLedger(userId) {
  try {
    const response = await fetch(`https://api.flamebank.ac/ledger/sync/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Ledger sync failed');
    return await response.json();
  } catch (err) {
    console.error('syncLedger error:', err);
    throw err;
  }
}