// Example 1: summarize a ballot measure at a chosen length.

// ---- 1. The prompt. Try changing it! ----------------------------------------
function buildPrompt(measure, words) {
  return `Summarize this California ballot measure in about ${words} words.
Write in plain English for an ordinary voter.
Text marked [DELETED: ...] is being removed from the law.

${measure.label} full legal text:
${measure.fullText}`;
}

// ---- 2. Load the measures from the data pack --------------------------------
const measureMenu = document.getElementById('measure');
const lengthMenu = document.getElementById('length');
let measures = [];

fetch('../data/datapack.json')
  .then((response) => response.json())
  .then((pack) => {
    measures = pack.measures;
    for (const m of measures) {
      measureMenu.add(new Option(`${m.label} (${m.wordCount} words)`, m.id));
    }
    showPrompt();
  });

function selectedMeasure() {
  return measures.find((m) => m.id === measureMenu.value);
}

// ---- 3. Show the originals and the exact prompt on the page -----------------
function showPrompt() {
  const measure = selectedMeasure();
  document.getElementById('officialPage').href = measure.official.url;
  document.getElementById('legalText').href = measure.sources.legalTextPdf;
  document.getElementById('officialSummary').textContent = measure.official.summary;

  const prompt = buildPrompt(measure, lengthMenu.value);
  document.getElementById('prompt').textContent = prompt;
  document.getElementById('promptSize').textContent = `(${countWords(prompt)} words)`;
}
measureMenu.onchange = showPrompt;
lengthMenu.onchange = showPrompt;

// ---- 4. Send it to the model and show what comes back -----------------------
document.getElementById('run').onclick = async () => {
  const output = document.getElementById('output');
  const button = document.getElementById('run');
  const words = lengthMenu.value;

  button.disabled = true;
  output.textContent = 'Waiting for the model…';
  try {
    const data = await askModel(buildPrompt(selectedMeasure(), words));
    const text = data.choices[0].message.content;
    const usage = data.usage;

    output.textContent = text;
    document.getElementById('stats').textContent =
      `Got ${countWords(text)} words (asked for ${words}) · ` +
      `${usage.prompt_tokens} tokens in, ${usage.completion_tokens} tokens out · model ${data.model}`;

    // OpenRouter reports what this call cost, in US dollars, in data.usage.cost
    document.getElementById('cost').textContent = 'Cost of this call: $' + usage.cost;
    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
};

function countWords(text) {
  return text.trim().split(/\s+/).length;
}
