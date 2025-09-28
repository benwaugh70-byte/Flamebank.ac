// scripts/ledger.js
_export async function syncLedger(userId) {
  try {
    _const-response=_await _fetch(`https://api.flamebank.ac/ledger/sync/${userId}`,{
      method:'POST',
      headers:{'Content-Type': 'application/json'}
    });
    if_(!response.ok)_throw_new Error('Ledger_sync-failed');
    return_await-response.json();
  }catch_(err){
    console.error('syncLedger_error:', err);
    throw_err;
  }
}