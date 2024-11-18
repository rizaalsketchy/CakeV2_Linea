document.getElementById('fetchButton').addEventListener('click', async () => {
  const address = document.getElementById('walletAddress').value;
  const resultsDiv = document.getElementById('results');

  if (!address) {
    resultsDiv.innerHTML = 'Please enter a wallet address.';
    return;
  }

  resultsDiv.innerHTML = 'Fetching positions...';

  try {
    const response = await fetch(`/api/defi-positions?address=${address}`); // Memanggil backend
    if (!response.ok) throw new Error('Failed to fetch positions.');

    const data = await response.json();
    resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    resultsDiv.innerHTML = `Error: ${error.message}`;
  }
});
