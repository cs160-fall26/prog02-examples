// Example 2: compute the Flesch–Kincaid reading level of a ballot measure. No AI.

// ---- 1. Load the measures from the data pack --------------------------------
const measureMenu = document.getElementById('measure');
let measures = [];

fetch('../data/datapack.json')
  .then((response) => response.json())
  .then((pack) => {
    measures = pack.measures;
    for (const m of measures) {
      measureMenu.add(new Option(`${m.label} (${m.wordCount} words)`, m.id));
    }
  });

// ---- 2. Compute the reading level when the button is pressed ----------------
document.getElementById('run').onclick = () => {
  const measure = measures.find((m) => m.id === measureMenu.value);

  // Drop the [DELETED: ...] words first: they are being removed from the law.
  const text = operativeText(measure.fullText);
  const fk = fleschKincaid(text);   // from js/fk.js

  document.getElementById('output').textContent =
`${measure.label} full legal text

Words:      ${fk.words}
Sentences:  ${fk.sentences}
Syllables:  ${fk.syllables}

grade = 0.39 × (${fk.words} / ${fk.sentences}) + 11.8 × (${fk.syllables} / ${fk.words}) − 15.59

Reading level: grade ${fk.grade}`;
};
