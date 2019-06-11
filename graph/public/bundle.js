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

  const WIDTH = 10;
  const HEIGHT = 10;
  const MARGIN = {
    x: 0.5,
    y: 0.5,
  };
  let scaleX, scaleY;

  function renderChart(data) {
    const chart = d3.select('#chart')
      .append('g')
      .classed('inner', true)
      .attr('style', `transform: translate(${MARGIN.x}px, ${MARGIN.y}px);`)
      .style('stroke', 'black')
      .style('stroke-width', 0.01);

    // using .extent to find [min,max] of the data
    const domainX = d3.extent(data.points, d => d[1]);
    const domainY = d3.extent(data.points, d => d[2]);
    // Scales will transform domain values into scaled range values.
    // https://github.com/d3/d3-scale/blob/v2.2.2/README.md#_continuous
    scaleX = d3.scaleLinear()
      .domain(domainX)
      .range([0, WIDTH]);
    scaleY = d3.scaleLinear()
      .domain(domainY)
      .range([HEIGHT, 0]);


    chart.append('g').classed('axis', true)
      .call(drawAxis);

    //
    // Draw all the data points
    chart.append('g').classed('points', true)
      .call(drawPoints, data.points);

    //
    // Draw selected with labels
    chart.append('g').classed('selected', true)
      .call(drawSelected, data.selected);
  }


  function drawPoints(sel, data) {
    const tooltip = d3.select('.tooltip');
    const enter = sel.selectAll('circle').data(data).enter();

    const point = enter.append('circle')
      .style('fill', '#aaa')
      .style('stroke', 'none')
      .attr('cx', r => scaleX(r[1]))
      .attr('cy', r => scaleY(r[2]))
      .attr('r', 0.02);

    // Fade in the tooltip when over the dot
    point.on('mouseover', function(d) {
      d3.select(this)
        .raise()
        .style('fill', 'black')
        .attr('r', 0.05);
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 1);
      tooltip
        .html(`${d[0]}<br />${d[1]}<br />${d[2]}`)
        .style('top', `${d3.event.y +5}px`)
        .style('left', `${d3.event.x +5}px`);
    })
      // Fade out the tooltip when leaving the dot
      .on('mouseout', function() {
        d3.select(this)
          .lower()
          .style('fill', '#aaa')
          .attr('r', 0.02);
        tooltip.transition()
          .duration(1700)
          .style('opacity', 0);
      });

  }


  function drawSelected(sel, data) {
    const enter = sel.selectAll('circle').data(data).enter();

    // Label is Text and a line back to the point.
    const label = enter.append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    // Line from the proint to the text
    label.append('line')
      .style('stroke', 'black')
      .style('stroke-width', 0.01)
      .attr('x1', r => scaleX(r[1])).attr('y1', r => scaleY(r[2]))
      .attr('x2', r => scaleX(r[1])).attr('y2', r => scaleY(r[2]));
    // Add the text
    label.append('text')
      .attr('x', r => scaleX(r[1]))
      .attr('y', r => scaleY(r[2]))
      .style('font-size', 0.2)
      .text(r => r[0]);


    // Add the point
    enter.append('circle')
      .attr('cx', r => scaleX(r[1]))
      .attr('cy', r => scaleY(r[2]))
      .attr('r', 0.05)
      .style('stroke', 'none')
      .style('fill', 'red');
  }

  function drawAxis(sel) {
    sel.style('stroke', 'black')
      .style('stroke-width', 0.01)
      .style('font-size', 0.2);

    // Draw the Y Axis
    sel.append('g').classed('y-axis', true)
      .attr('style', `transform: translateX(-${MARGIN.x-0.1}px)`)
      .append('line')
        .attr('x1', MARGIN.x-0.1).attr('y1', 0)
        .attr('x2', MARGIN.x-0.1).attr('y2', HEIGHT);

    const entryYAxis = sel.select('.y-axis').selectAll('.tick')
      .data(scaleY.ticks(5))
      .enter().append('g').classed('tick', true);
    entryYAxis.append('line')
      .attr('x1', 0.2).attr('y1', scaleY)
      .attr('x2', 0.3).attr('y2', scaleY);
    entryYAxis.append('text')
      .attr('x', 0).attr('y', d => scaleY(d) + 0.05)
      .text(d => d);


    // Draw the X Axis
    sel.append('g').classed('x-axis', true)
      .attr('style', `transform: translateY(-${MARGIN.x-0.1}px)`);

    const entryXAxis = sel.select('.x-axis').selectAll('.tick')
      .data(scaleX.ticks())
      .enter().append('g').classed('tick', true);
    entryXAxis.append('line')
      .attr('x1', scaleX).attr('y1', HEIGHT - MARGIN.y)
      .attr('x2', d => scaleX(d) + 0.1).attr('y2', HEIGHT - MARGIN.y);
    entryXAxis.append('text')
      .attr('x', d => scaleX(d)).attr('y', HEIGHT - MARGIN.y)
      .text(d => d);


    // Draw 0 Axis
    sel.append('line')
      .attr('x1', scaleX(0)).attr('y1', 0)
      .attr('x2', scaleX(0)).attr('y2', HEIGHT);
    // Axis
    sel.append('line')
      // .style('stroke', 'black')
      // .style('stroke-width', 0.01)
      .attr('x1', 0).attr('y1', scaleY(0))
      .attr('x2', WIDTH).attr('y2', scaleY(0));
  }


  function dragstarted() {
    d3.select(this)
      .raise()
      .classed('active', true);
  }

  function dragged() {
    d3.select(this).select('text')
      .attr('x', d3.event.x)
      .attr('y', d3.event.y);

    d3.select(this).select('line')
      .attr('x2', d3.event.x + 0.25)
      .attr('y2', d3.event.y + 0.05);
  }

  function dragended() {
    d3.select(this)
      .classed('active', false)
      .lower();
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
  window.elShowLabel.addEventListener('change', () => {
    document.body.classList.toggle('hideLabel');
  });
  window.elDownload.addEventListener('click', () => {
    saveSVG(window.chart, 'chart');
  });
  window.elSource.addEventListener('change', updateChart);
  window.elFilter.addEventListener('change', updateChart);
  updateChart();

}());
