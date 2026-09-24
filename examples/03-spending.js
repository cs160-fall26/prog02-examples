// Example 3: ask OpenRouter how much this API key has spent. Free, no AI.
//
// You can make the same request from the command line (Terminal) instead of a web page.
// Replace YOUR_KEY with your OpenRouter key:
//
//   curl https://openrouter.ai/api/v1/key -H "Authorization: Bearer YOUR_KEY"

document.getElementById('run').onclick = async () => {
  const output = document.getElementById('output');
  output.textContent = 'Asking OpenRouter…';

  try {
    // A GET request: we send only the key, no body. OpenRouter replies with this key's usage.
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      headers: { 'Authorization': 'Bearer ' + OPENROUTER_API_KEY },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || response.statusText);

    const key = data.data;   // the numbers are in dollars
    output.textContent =
`Spent in total: $${key.usage.toFixed(4)}
Spent today: $${key.usage_daily.toFixed(4)}
Limit on key: ${key.limit == null ? 'no limit' : '$' + key.limit}
Remaining: ${key.limit_remaining == null ? 'no limit' : '$' + key.limit_remaining.toFixed(4)}`;

    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
};
