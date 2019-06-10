import { SVGToScreen } from './svgPoint.js';
const WIDTH = 10;
const HEIGHT = 10;
let scaleX, scaleY;

export function renderChart(data) {
  const chart = d3.select('#chart')
    .append('g')
    .classed('inner', true)
    .attr('style', 'transform: translate(0.1px, 0.1px);')
    .style('stroke', 'black')
    .style('stroke-width', 0.01);

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
  .on('mouseout', function(d) {
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
  const line = label.append('line')
    .style('stroke', 'black')
    .style('stroke-width', 0.01)
    .attr('x1', r => scaleX(r[1])).attr('y1', r => scaleY(r[2]))
    .attr('x2', r => scaleX(r[1])).attr('y2', r => scaleY(r[2]));
  // Add the text
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
    .style('stroke', 'none')
    .style('fill', 'red');
}

function drawAxis(sel) {
  sel.style('stroke', 'black')
    .style('stroke-width', 0.01)
    .style('font-size', 0.2)

  console.log(scaleY.ticks());
  // Draw the Y Axis
  const entryAxis = sel.append('g')
    .selectAll('.tick')
    .data(scaleY.ticks(5))
    .enter().append('g').classed('tick', true);

  entryAxis.append('line')
    .attr('x1', 0.2).attr('y1', scaleY)
    .attr('x2', 0.3).attr('y2', scaleY);

  entryAxis.append('text')
    .attr('x', 0).attr('y', d => scaleY(d) + 0.05)
    .text(d => d)


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
