// Example 4: rewrite a ballot measure at a chosen reading level, then check the result.

// ---- 1. The prompt. Try changing it! ----------------------------------------
function buildPrompt(measure, grade) {
  return `Rewrite this California ballot measure so a student in grade ${grade} can understand it.
Text marked [DELETED: ...] is being removed from the law.

${measure.label} full legal text:
${measure.fullText}`;
}

// ---- 2. Load the measures from the data pack --------------------------------
const measureMenu = document.getElementById('measure');
const gradeMenu = document.getElementById('grade');
let measures = [];

fetch('../data/datapack.json')
  .then((response) => response.json())
  .then((pack) => {
    measures = pack.measures;
    for (const m of measures) {
      measureMenu.add(new Option(m.label, m.id));
    }
    showPrompt();
  });

function selectedMeasure() {
  return measures.find((m) => m.id === measureMenu.value);
}

// ---- 3. Show the exact prompt on the page -----------------------------------
function showPrompt() {
  const prompt = buildPrompt(selectedMeasure(), gradeMenu.value);
  document.getElementById('prompt').textContent = prompt;
}
measureMenu.onchange = showPrompt;
gradeMenu.onchange = showPrompt;

// ---- 4. Send it to the model, then measure the reading level of the answer ---
document.getElementById('run').onclick = async () => {
  const output = document.getElementById('output');
  const button = document.getElementById('run');
  const measure = selectedMeasure();
  const grade = gradeMenu.value;

  button.disabled = true;
  output.textContent = 'Waiting for the model…';
  try {
    const data = await askModel(buildPrompt(measure, grade));
    const text = data.choices[0].message.content;
    output.textContent = text;

    // The check: Flesch–Kincaid (js/fk.js, no AI) on the original and on the rewrite
    const before = fleschKincaid(operativeText(measure.fullText)).grade;
    const after = fleschKincaid(text).grade;
    document.getElementById('check').textContent =
      `Asked for grade ${grade}. Got grade ${after}. (The original legal text is grade ${before}.)`;

    document.getElementById('cost').textContent = 'Cost of this call: $' + data.usage.cost;
    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
};
