const HIGHLIGHTS = ['USP30', 'MEP1A', 'MIPEP', 'PMPCB', 'PITRM1', 'OSGEPL1', 'METAP1D', 'XPNPEP3', 'YME1L1', 'SPG7', 'AFG3L2', 'OMA1', 'XRCC6BP1', 'HTRA2', 'LACTB', 'CLPP', 'LONP', 'IMMP2L', 'IMMP1L', 'PARL', 'PARK7', 'PMPCA', 'UQCRC1', 'UQCRC2', 'PRSS35', 'CAPN1', 'CAPN2', 'CAPN10', 'CASP2', 'CASP3', 'CASP7', 'CASP8', 'CASP9'];

function renderChart(data) {
  const chart = d3.select('#chart')
    .append('g');
  const WIDTH = 10; // parseInt(chart.attr('width'), 10);
  const HEIGHT = 10; //parseInt(chart.attr('height'), 10);
  console.log(WIDTH, HEIGHT);
  // Scales will transform domain values into scaled range values.
  // https://github.com/d3/d3-scale/blob/v2.2.2/README.md#_continuous
  const scaleX = d3.scaleLinear()
    // using .extent to find [min,max] of the data
    .domain(d3.extent(data, d => d[1]))
    .range([0, WIDTH]);
  const scaleY = d3.scaleLinear()
    // using .extent to find [min,max] of the data
    .domain(d3.extent(data, d => d[2]))
    .range([HEIGHT, 0]);


  // chart.attr('style', `transform: translate(${WIDTH/2}px, ${HEIGHT/2}px);`)

  chart.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('cx', r => scaleX(r[1]))
    .attr('cy', r => scaleY(r[2]))
    .attr('r', r => isRowHighlighted(r) ? 0.05 : 0.02)
    .attr('fill', r => isRowHighlighted(r) ? 'red' : '#aaa');
}


function isRowHighlighted(row) {
  return HIGHLIGHTS.find(name => row[0].includes(name)) !== undefined;
}


function App() {
  const dataURL = 'https://gist.githubusercontent.com/ripter/37a1a5cf2f95a78cb55d53e0b448ed5a/raw/ace38a74411be5d7c48bf64a3a2a2728fb19c781/h3_h4_combined.json';
  return fetch(dataURL).then((response) => {
    response.json().then((json) => {
      renderChart(json);
    });
  });
}
App();
