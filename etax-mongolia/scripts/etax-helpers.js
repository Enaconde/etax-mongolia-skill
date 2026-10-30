// Snippets for the Claude in Chrome `javascript_tool` on etax.mta.mn.
// Paste one block at a time; each ends with the expression to return.
// eTax is a single-page app: navigate by clicking sidebar links, not by URL.

// --- Which taxpayer is active? -------------------------------------------
(() => {
  const t = document.body.innerText;
  const i = t.indexOf('Регистр');
  return t.slice(i, i + 25).replace(/\s+/g, ' ');
})();

// --- Go to a page through the sidebar (avoids 404 on direct URLs) --------
// routes: /app/report-menu/report-late, /app/report-menu/report-submit,
//         /app/report-menu/report-history, /app/request-menu/request-history
async function go(route) {
  const a = [...document.querySelectorAll('a')]
    .find(a => (a.getAttribute('href') || '').startsWith(route) && a.innerText.trim());
  a.click();
  await new Promise(r => setTimeout(r, 5000));
  return location.pathname;
}

// --- Read the late-report / submit table as one line per row -------------
[...document.querySelectorAll('main tr')]
  .map(r => r.innerText.replace(/\s+/g, ' '))
  .join('\n');

// --- List requests with status (on Хүсэлтийн түүх) ------------------------
(document.querySelector('main').innerText
  .match(/\d{13}[\s\S]{0,40}?(ИЛГЭЭСЭН|БУЦААСАН|ХУУЛИЙН ХУГАЦАА СУНГАСАН|ОЛГОСОН|ШИЛЖҮҮЛСЭН)/g) || [])
  .map(s => s.replace(/\s+/g, ' '))
  .join('\n');

// --- Open one request and read its step history + comments ---------------
async function requestHistory(id) {
  const cell = [...document.querySelectorAll('main *')]
    .find(e => e.children.length === 0 && e.innerText && e.innerText.trim() === id);
  (cell.closest('tr') || cell).click();
  await new Promise(r => setTimeout(r, 3000));
  const t = [...document.querySelectorAll('.modal, [role=dialog]')]
    .filter(e => e.innerText.includes(id)).map(e => e.innerText).join('\n');
  const x = [...document.querySelectorAll('button, span, a')]
    .find(e => e.innerText && e.innerText.trim() === '×' && e.offsetParent !== null);
  if (x) x.click(); // close the modal again
  return t.replace(/\s*\n\s*/g, ' | ');
}

// --- Click a row's action button (e.g. 'Хүсэлт илгээх' or 'Тайлан тушаах')
function clickRowAction(code, period, label) {
  const row = [...document.querySelectorAll('main tr')]
    .find(r => r.innerText.includes(code) && r.innerText.includes(period)); // period e.g. '2-р улирал'
  const b = row && [...row.querySelectorAll('button, a')].find(b => b.innerText.includes(label));
  if (b) b.click();
  return !!b;
}

// --- Read back what's filled in an open request modal --------------------
(() => {
  const vis = e => e.offsetParent !== null;
  return JSON.stringify({
    selects: [...document.querySelectorAll('select')].filter(vis).map(s => s.options[s.selectedIndex]?.text),
    note: [...document.querySelectorAll('textarea')].filter(vis).map(t => t.value),
    contact: ['pin', 'entityName', 'phone', 'email']
      .map(n => n + '=' + (document.querySelector('input[name=' + n + ']')?.value)),
    radios: [...document.querySelectorAll('input[type=radio]')].map(r => r.checked),
  });
})();

// --- Zero report: tick both checkboxes by their label text ---------------
async function tickZeroReport() {
  const label = c => (c.closest('label,div,td,span')?.innerText || '').trim();
  const boxes = [...document.querySelectorAll('input[type=checkbox]')];
  const noActivity = boxes.find(c => label(c).includes('үйл ажиллагаа явуулаагүй'));
  const inTugrug = boxes.find(c => label(c).includes('төгрөг мөнгөөр'));
  if (noActivity && !noActivity.checked) noActivity.click();
  await new Promise(r => setTimeout(r, 1500));
  if (inTugrug && !inTugrug.checked) inTugrug.click();
  const amounts = [...document.querySelectorAll(
    'main input:not([type=checkbox]):not([type=radio]):not([type=file]):not([type=password])')]
    .filter(i => i.offsetParent !== null);
  return JSON.stringify({
    checked: boxes.map(c => label(c).slice(0, 40) + ' = ' + c.checked),
    nonZeroAmounts: amounts.filter(i => i.value && i.value.replace(/[0,.\s]/g, '') !== '')
      .map(i => (i.name || i.id) + '=' + i.value),
  });
}
// Then click Хадгалах with a real click and check read_network_requests
// for POST /backapi/beta/return/saveFormData → 200.
