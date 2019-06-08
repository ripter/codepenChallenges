export function screenToSVG(screenX, screenY) {
  const svg = d3.select('#chart').node();
  const p = svg.createSVGPoint()
  p.x = screenX
  p.y = screenY
  return p.matrixTransform(svg.getScreenCTM().inverse());
}

export function SVGToScreen(svgX, svgY) {
  const svg = d3.select('#chart').node();
  const p = svg.createSVGPoint()
  p.x = svgX
  p.y = svgY
  return p.matrixTransform(svg.getScreenCTM());
}
