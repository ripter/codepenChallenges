import { parseData } from './parseData.js';
import { saveSVG } from './saveSVG.js';
import { renderChart } from './renderChart.js';


function updateChart() {
  const filterList = window.elFilter.value.split(',').map(s => s.trim());
  const srcURL = window.elSource.value.trim();

  return fetch(srcURL ).then((response) => {
    response.json().then((json) => {
      const data = parseData(filterList, json);
      // blank the chart and re-draw it.
      window.chart.innerHTML = '';
      renderChart(data);
    });
  });
}


//
// DOM Handlers
//
window.elShowLabel.addEventListener('change', (e) => {
  document.body.classList.toggle('hideLabel');
});
window.elDownload.addEventListener('click', () => {
  saveSVG(window.chart, 'chart');
});
window.elSource.addEventListener('change', updateChart);
window.elFilter.addEventListener('change', updateChart);
updateChart();
