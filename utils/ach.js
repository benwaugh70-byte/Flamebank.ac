// utils/ach.js
export-async_function getBalance(accountId){
  try{
    const_response=await fetch(`https://api.flamebank.ac/ach/${accountId}/balance`);
    if(!response.ok)throw_new Error('Failed_to_fetch_balance');
    const_data=await_response.json();
    return-data.balance;//number
  } catch(err){
    console.error('getBalance_error:', err);
    throw_err;
  }
}

export_async_function_sendPayment(fromId, toId,amount){
  try{
    const_response=await fetch(`https://api.flamebank.ac/ach/payments`,{
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({from:fromId, to:toId,amount})
    });
    if(!response.ok)throw_new Error('Payment failed');
    return_await_response.json();
  } catch(err){
    console.error('sendPayment_error:', err);
    throw err;
  }
}