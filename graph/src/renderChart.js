let scaleX, scaleY;

export function renderChart(data) {
  const WIDTH = 10;
  const HEIGHT = 10;
  const chart = d3.select('#chart')
    .append('g')
    .classed('plot', true)
    .attr('style', 'transform: translate(0.1px, 0.1px);');

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


  // Axis
  chart.append('line')
    .style('stroke', 'blue')
    .style('stroke-width', 0.01)
    .attr('x1', scaleX(0)).attr('y1', 0)
    .attr('x2', scaleX(0)).attr('y2', HEIGHT);
  // Axis
  chart.append('line')
    .style('stroke', 'blue')
    .style('stroke-width', 0.01)
    .attr('x1', 0).attr('y1', scaleY(0))
    .attr('x2', WIDTH).attr('y2', scaleY(0));

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

  // Draw a line linking the point and label
  const label = enter.append('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  const line = label.append('line')
    .style('stroke', 'black')
    .style('stroke-width', 0.01)
    .attr('x1', r => scaleX(r[1])).attr('y1', r => scaleY(r[2]))
    .attr('x2', r => scaleX(r[1])).attr('y2', r => scaleY(r[2]));

  // Add the label text
  const text = label.append('text')
    .attr('x', r => scaleX(r[1]))
    .attr('y', r => scaleY(r[2]))
    .style('font-size', 0.2)
    .text(r => r[0]);


  // Add the point
  const point = enter.append('circle')
    .attr('cx', r => scaleX(r[1]))
    .attr('cy', r => scaleY(r[2]))
    .attr('r', 0.05)
    .attr('fill', 'red');
}



function dragstarted(d) {
  d3.select(this)
    .raise()
    .classed('active', true);
}

function dragged(d) {
  d3.select(this).select('text')
    .attr('x', d3.event.x)
    .attr('y', d3.event.y);

  d3.select(this).select('line')
    .attr('x2', d3.event.x + 0.25)
    .attr('y2', d3.event.y + 0.05);
}

function dragended(d) {
  d3.select(this)
    .classed('active', false)
    .lower();
}
