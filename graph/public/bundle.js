(function () {
  'use strict';

  // Parses the data into the structure used by the d3 graph
  function parseData(filterList, records) {

    return {
      points: records,
      selected: records.filter(([name]) => {
        return filterList.find(filter => name.includes(filter)) !== undefined;
      }),
    };
  }

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

}());
