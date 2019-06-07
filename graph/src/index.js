import { parseData } from './parseData.js';
// const HIGHLIGHTS = ['USP30', 'MEP1A', 'MIPEP', 'PMPCB', 'PITRM1', 'OSGEPL1', 'METAP1D', 'XPNPEP3', 'YME1L1', 'SPG7', 'AFG3L2', 'OMA1', 'XRCC6BP1', 'HTRA2', 'LACTB', 'CLPP', 'LONP', 'IMMP2L', 'IMMP1L', 'PARL', 'PARK7', 'PMPCA', 'UQCRC1', 'UQCRC2', 'PRSS35', 'CAPN1', 'CAPN2', 'CAPN10', 'CASP2', 'CASP3', 'CASP7', 'CASP8', 'CASP9'];
let HIGHLIGHTS = [];

function renderChart(data) {
  console.log('renderChart');
  const chart = d3.select('#chart');
  const WIDTH = 10;
  const HEIGHT = 10;
  // Scales will transform domain values into scaled range values.
  // https://github.com/d3/d3-scale/blob/v2.2.2/README.md#_continuous
  const scaleX = d3.scaleLinear()
    // using .extent to find [min,max] of the data
    .domain(d3.extent(data.points, d => d[1]))
    .range([0, WIDTH]);
  const scaleY = d3.scaleLinear()
    // using .extent to find [min,max] of the data
    .domain(d3.extent(data.points, d => d[2]))
    .range([HEIGHT, 0]);


  chart.append('g').classed('points', true)
    .selectAll('circle').data(data.points)
    .enter().append('circle')
    .attr('cx', r => scaleX(r[1]))
    .attr('cy', r => scaleY(r[2]))
    .attr('r', 0.02)
    .attr('fill', '#aaa');

  chart.append('g').classed('highlight', true)
    .selectAll('circle').data(data.selected)
    .enter().append('circle')
    .attr('cx', r => scaleX(r[1]))
    .attr('cy', r => scaleY(r[2]))
    .attr('r', 0.05)
    .attr('fill', 'red');
}


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



window.elSource.addEventListener('change', updateChart);
window.elFilter.addEventListener('change', updateChart);
updateChart();
