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
    // chart.append('g').classed('selected', true)
    //   .call(drawSelected, data.selected);
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

  function drawAxis(sel) {
    let enter;

    sel.style('stroke', 'black')
      .style('stroke-width', 0.01)
      .style('font-size', 0.2);


    const yAxis = sel.append('g').classed('y-axis', true);
    enter = yAxis.selectAll('.tick').data(scaleY.ticks())
      .enter().append('g').classed('tick', true);
    enter.append('line')
      .attr('x1', 0).attr('x2', WIDTH)
      .attr('y1', scaleY).attr('y2', scaleY);
    enter.append('text')
      .text(d => d)
      .attr('x', 0)
      .attr('dy', d => scaleY(d) + 0.05);


    const xAxis = sel.append('g').classed('x-axis', true);
    enter = xAxis.selectAll('.tick').data(scaleX.ticks())
      .enter().append('g').classed('tick', true);
    enter.append('line')
      .attr('x1', scaleX).attr('x2', scaleX)
      .attr('y1', 0).attr('y2', HEIGHT);
    enter.append('text')
      .text(d => d)
      .attr('x', d => scaleX(d) - 0.05)
      .attr('y', HEIGHT - 0.5);



    // Draw 0 Axis
    const centerAxis = sel.append('g').classed('center-axis', true);
    centerAxis.append('line')
      // .style('stroke', 'blue')
      .attr('x1', scaleX(0)).attr('y1', 0)
      .attr('x2', scaleX(0)).attr('y2', HEIGHT);
    centerAxis.append('line')
      .style('stroke', 'blue')
      .attr('x1', 0).attr('y1', scaleY(0))
      .attr('x2', WIDTH).attr('y2', scaleY(0));

    const box = sel.append('g').classed('box', true)
      .style('stroke', 'red');
    box.append('line')
      .attr('x1', 0).attr('x2', WIDTH)
      .attr('y1', 0).attr('y2', 0);
    box.append('line')
      .attr('x1', WIDTH).attr('x2', WIDTH)
      .attr('y1', 0).attr('y2', HEIGHT);
    box.append('line')
      .attr('x1', WIDTH).attr('x2', 0)
      .attr('y1', HEIGHT).attr('y2', HEIGHT);
    box.append('line')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', HEIGHT).attr('y2', 0);
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
