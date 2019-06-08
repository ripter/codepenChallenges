(function () {
  'use strict';

  // Parses the data into the structure used by the d3 graph
  function parseData(filterList, records) {

    return {
      points: records,
      selected: records.filter(([name]) => {
        return typeof filterList.find(filter => name.includes(filter)) !== 'undefined';
      }),
    };
  }

  function saveSVG(svgEl, name) {
    // svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:'image/svg+xml;charset=utf-8'});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  let scaleX, scaleY;

  function renderChart(data) {
    const WIDTH = 10;
    const HEIGHT = 10;
    const chart = d3.select('#chart');

    // using .extent to find [min,max] of the data
    const domainX = d3.extent(data.points, d => d[1]);
    const domainY = d3.extent(data.points, d => d[2]);
    console.log('domainX', domainX);
    console.log('domainY', domainY);
    // Scales will transform domain values into scaled range values.
    // https://github.com/d3/d3-scale/blob/v2.2.2/README.md#_continuous
    scaleX = d3.scaleLinear()
      .domain(domainX)
      .range([0, WIDTH]);
    scaleY = d3.scaleLinear()
      .domain(domainY)
      .range([HEIGHT, 0]);



    //
    // Draw all the data points
    chart.append('g').classed('points', true)
      .selectAll('circle').data(data.points)
      .enter().append('circle')
      .attr('cx', r => scaleX(r[1]))
      .attr('cy', r => scaleY(r[2]))
      .attr('r', 0.02)
      .attr('fill', '#aaa');


    //
    // Draw selected with labels
    chart.append('g').classed('selected', true)
      .call(drawSelected, data.selected);
  }


  function drawSelected(sel, data) {
    const enter = sel.selectAll('circle').data(data).enter();
    // Add the point
    const point = enter.append('circle')
      .attr('cx', r => scaleX(r[1]))
      .attr('cy', r => scaleY(r[2]))
      .attr('r', 0.05)
      .attr('fill', 'red');
    // Add the label text
    const label = enter.append('text')
      .attr('x', r => scaleX(r[1]))
      .attr('y', r => scaleY(r[2]))
      .style('font-size', 0.2)
      .text(r => r[0])
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
  }



  function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
  }

  function dragged(d) {
    d3.select(this)
      .attr('x', d.x = d3.event.x)
      .attr('y', d.y = d3.event.y);
  }

  function dragended(d) {
    d3.select(this).classed('active', false);
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


  //
  // DOM Handlers
  //
  window.elDownload.addEventListener('click', () => {
    saveSVG(window.chart, 'chart');
  });
  window.elSource.addEventListener('change', updateChart);
  window.elFilter.addEventListener('change', updateChart);
  updateChart();

}());
