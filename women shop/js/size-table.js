/* Size chart (cm), shared by the size guide page and the product dialog. */
(function (V) {
'use strict';
const { toFa } = V;

const SIZE_CHART = [
  { size: 'XS', eu: 34, bust: 80, waist: 62, hip: 88, shoulder: 37, length: 98 },
  { size: 'S', eu: 36, bust: 84, waist: 66, hip: 92, shoulder: 38, length: 100 },
  { size: 'M', eu: 38, bust: 88, waist: 70, hip: 96, shoulder: 39.5, length: 102 },
  { size: 'L', eu: 40, bust: 94, waist: 76, hip: 102, shoulder: 41, length: 104 },
  { size: 'XL', eu: 42, bust: 100, waist: 82, hip: 108, shoulder: 42.5, length: 106 }
];

const COLUMNS = [
  ['bust', 'Bust', 'دور سینه'],
  ['waist', 'Waist', 'دور کمر'],
  ['hip', 'Hip', 'دور باسن'],
  ['shoulder', 'Shoulder', 'سرشانه'],
  ['length', 'Length', 'قد لباس']
];

const format = (cm, unit) => (unit === 'in' ? toFa((cm / 2.54).toFixed(1)) : toFa(cm));

function sizeTable(unit = 'cm') {
  return `
  <div class="table-wrap" tabindex="0" role="region" aria-label="جدول سایز">
    <table class="size-table">
      <caption class="visually-hidden">جدول اندازه‌های VĀNE به ${unit === 'in' ? 'اینچ' : 'سانتی‌متر'}</caption>
      <thead>
        <tr>
          <th scope="col"><span lang="en">Size</span><span class="size-table__fa">سایز</span></th>
          <th scope="col"><span lang="en">EU</span><span class="size-table__fa">اروپا</span></th>
          ${COLUMNS.map(([, en, fa]) => `<th scope="col"><span lang="en">${en}</span><span class="size-table__fa">${fa}</span></th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${SIZE_CHART.map((row) => `
        <tr>
          <th scope="row" lang="en">${row.size}</th>
          <td>${toFa(row.eu)}</td>
          ${COLUMNS.map(([key]) => `<td>${format(row[key], unit)}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* size-guide.html — table with a cm / inch toggle. */
function initSizeGuide() {
  const root = document.querySelector('[data-size-table]');
  if (!root) return;
  const buttons = [...document.querySelectorAll('[data-unit]')];
  const render = (unit) => {
    root.innerHTML = sizeTable(unit);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.unit === unit)));
  };
  buttons.forEach((b) => b.addEventListener('click', () => render(b.dataset.unit)));
  render('cm');
}

Object.assign(V, { initSizeGuide, sizeTable, SIZE_CHART });
})(window.VANE = window.VANE || {});
