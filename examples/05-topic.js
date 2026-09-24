// Example 5: what does one ballot measure mean for one topic a voter cares about?
// Fixed to Prop 4 and the "My Taxes" topic, so the only thing to look at is the prompt.

const MEASURE_ID = 'prop-4';
const TOPIC = {
  label: 'My Taxes',
  covers: 'taxes, fees, public funds and government spending',
};

// ---- 1. The prompt. Try changing it! ----------------------------------------
function buildPrompt(measure, topic) {
  return `A voter wants to know what this California ballot measure means for one topic: "${topic.label}".
The topic covers: ${topic.covers}.

Answer in two parts, in plain English for an ordinary voter.
Part 1, "What the text says": up to 3 points about this topic, using ONLY the legal text below.
After each point, quote the exact words from the text it comes from.
Part 2, "AI opinion": in under 80 words, your own view of whether this measure looks good, bad
or mixed for this topic, and why. Do not tell the voter how to vote.
If the text says little about this topic, say so instead of stretching.
Text marked [DELETED: ...] is being removed from the law.

${measure.label} full legal text:
${measure.fullText}`;
}

// ---- 2. Load Prop 4 from the data pack --------------------------------------
let measure;

fetch('../data/datapack.json')
  .then((response) => response.json())
  .then((pack) => {
    measure = pack.measures.find((m) => m.id === MEASURE_ID);
    document.getElementById('prompt').textContent = buildPrompt(measure, TOPIC);
  });

// ---- 3. Send it to the model ------------------------------------------------
document.getElementById('run').onclick = async () => {
  const output = document.getElementById('output');
  const button = document.getElementById('run');

  button.disabled = true;
  output.textContent = 'Waiting for the model…';
  try {
    const data = await askModel(buildPrompt(measure, TOPIC));
    output.textContent = data.choices[0].message.content;
    document.getElementById('cost').textContent = 'Cost of this call: $' + data.usage.cost;
    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
};
