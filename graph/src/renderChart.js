const WIDTH = 10;
const HEIGHT = 10;
const MARGIN = {
  X: 0.5,
  Y: 0.5,
};
let scaleX, scaleY;

export function renderChart(data) {
  const chart = d3.select('#chart')
    .append('g')
    .classed('inner', true)
    // .attr('style', `transform: translate(${MARGIN.x}px, ${MARGIN.y}px);`)
    .style('stroke', 'black')
    .style('stroke-width', 0.01);

  // using .extent to find [min,max] of the data
  const domainX = d3.extent(data.points, d => d[1]);
  const domainY = d3.extent(data.points, d => d[2]);
  // Scales will transform domain values into scaled range values.
  // https://github.com/d3/d3-scale/blob/v2.2.2/README.md#_continuous
  scaleX = d3.scaleLinear()
    .domain(domainX)
    .range([MARGIN.X, WIDTH - MARGIN.X]);
  scaleY = d3.scaleLinear()
    .domain(domainY)
    .range([HEIGHT - MARGIN.Y, MARGIN.Y]);


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
  const TICK_LENGTH = 0.05;
  const BOX = {
    LEFT: MARGIN.X - 0.15,
    BOTTOM: HEIGHT - MARGIN.Y + 0.15,
  }
  let enter;

  sel.style('stroke', 'black')
    .style('stroke-width', 0.01)
    .style('font-size', 0.2);


  const yAxis = sel.append('g').classed('y-axis', true);
  enter = yAxis.selectAll('.tick').data(scaleY.ticks())
    .enter().append('g').classed('tick', true);
  enter.append('line')
    .attr('x1', MARGIN.X - 0.15).attr('x2', (MARGIN.X - 0.15)+ TICK_LENGTH)
    .attr('y1', scaleY).attr('y2', scaleY);
  enter.append('text')
    .text(d => d)
    .attr('x', 0.1)
    .attr('dy', d => scaleY(d) + 0.05);


  const xAxis = sel.append('g').classed('x-axis', true);
  enter = xAxis.selectAll('.tick').data(scaleX.ticks())
    .enter().append('g').classed('tick', true);
  enter.append('line')
    .attr('x1', scaleX).attr('x2', scaleX)
    .attr('y1', BOX.BOTTOM).attr('y2', BOX.BOTTOM - TICK_LENGTH);
  enter.append('text')
    .text(d => d)
    .attr('x', d => scaleX(d) - 0.05)
    .attr('y', HEIGHT);



  // Draw 0 Axis
  const centerAxis = sel.append('g').classed('center-axis', true);
    // .style('stroke', 'blue')
  centerAxis.append('line')
    .attr('x1', scaleX(0)).attr('y1', MARGIN.Y)
    .attr('x2', scaleX(0)).attr('y2', HEIGHT - MARGIN.Y);
  centerAxis.append('line')
    .attr('x1', MARGIN.X).attr('y1', scaleY(0))
    .attr('x2', WIDTH).attr('y2', scaleY(0));

  // Draw a box around the graph
  const box = sel.append('g').classed('box', true);
    // .style('stroke', 'red');
  box.append('line')
    .attr('x1', BOX.LEFT).attr('x2', WIDTH)
    .attr('y1', MARGIN.Y).attr('y2', MARGIN.Y);
  box.append('line')
    .attr('x1', WIDTH).attr('x2', WIDTH)
    .attr('y1', MARGIN.Y).attr('y2', BOX.BOTTOM);
  box.append('line')
    .attr('x1', WIDTH).attr('x2', BOX.LEFT)
    .attr('y1', BOX.BOTTOM).attr('y2', BOX.BOTTOM);
  box.append('line')
    .attr('x1', BOX.LEFT).attr('x2', MARGIN.X - 0.15)
    .attr('y1', BOX.BOTTOM).attr('y2', MARGIN.Y);
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
