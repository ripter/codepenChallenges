(function () {
  'use strict';

  // My first time trying GLSL, Special thanks to:
  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  // https://thebookofshaders.com
  // https://www.khronos.org/files/opengles_shading_language.pdf
  // https://www.shadertoy.com/view/4lsXRl


  class HyperspaceGLSL {
    constructor(webGL) {
      this.webGL = webGL;
      this.program = createProgram(webGL, this.vertexShader, this.fragmentShader);
    }

    // Uses the program on WebGL
    use() {
      const { webGL, program } = this;
      webGL.useProgram(program);
    }


    set currentTime(time) {
      const { webGL, program } = this;
      const ptrLocation = webGL.getUniformLocation(program, 'iTime');
      webGL.uniform1f(ptrLocation, time);
    }
    set points(data) {
      const { webGL, program } = this;
      // Get a pointer to the location of the attribute in the program
      const ptrPoints = webGL.getAttribLocation(program, 'a_position');
      webGL.enableVertexAttribArray(ptrPoints);

      // Create a buffer at webGL.ARRAY_BUFFER for us to bind data.
      const buffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, buffer);

      // Copy the data into webGL.ARRAY_BUFFER
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(data), webGL.STATIC_DRAW);
      // Binds the data at webGL.ARRAY_BUFFER to the attribute
      webGL.vertexAttribPointer(ptrPoints, 2, webGL.FLOAT, false, 0, 0);
    }

    get vertexShader() {
      const { webGL, vertexShaderSource } = this;
      if (!this._vertexShader) {
        this._vertexShader = createShader(webGL, webGL.VERTEX_SHADER, vertexShaderSource);
      }
      return this._vertexShader;
    }
    get vertexShaderSource() {
      return `
    // an attribute will receive data from a buffer
    attribute vec2 a_position;
    // all shaders have a main function
    void main() {
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = vec4(a_position, 0.0, 1.0);
    }`;
    }

    get fragmentShader() {
      const { webGL, fragmentShaderSource } = this;
      if (!this._fragmentShader) {
        this._fragmentShader = createShader(webGL, webGL.FRAGMENT_SHADER, fragmentShaderSource);
      }
      return this._fragmentShader;
    }
    get fragmentShaderSource() {
      return `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

//TODO: use attributes/uniforms
uniform float iTime;
vec4 iMouse = vec4(10.0, 15.0, 0.0, 0.0);
vec3 iResolution = vec3(400.0, 300.0, 0.0);


vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p)*43758.5453);
}

float rand(float n) {
  return fract(sin(n) * 43758.5453123);
}

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec4 mapStar(vec2 position, float lightSpeed, float angleOffset) {
  vec4 color = vec4(vec3(0.), 1.);
	float angle = atan(position.y, position.x) + angleOffset;
  float angleNumber = 20.;

  float random = rand(floor(angle * angleNumber) * 100.);
  float distance = random;
  distance += iTime * 2.;
  distance = fract(distance);

  float fragDistance = length(position);

  float size = smoothstep(-.1, 2., lightSpeed);

  float bounded = step(distance, fragDistance) * step(fragDistance, distance + size);
  bounded += step(fragDistance, fract(distance + size)) * step(fract(distance + size), distance);

  color.rgb = mix(vec3(0.), vec3(1.), bounded);

  color.r *= 1.;
  color.g *= .7 + random * .3;
  color.b *= 4.;

  // hard edges
  float angleCenter = abs(fract(angle * angleNumber) * 2. - 1.);
  color.a = step(angleCenter, smoothstep(-.2, 1., lightSpeed));

  // smooth gradient
  color.a *= 1. - angleCenter;

  color.a *= smoothstep(0., 1., fragDistance);
  color.a *= cos(random * iTime) * .5 + .5;

  return color;
}

void main() {
  float lightSpeed = cos(iTime) * .5 + .5;
  // lightSpeed = 1. - iMouse.x / iResolution.x;
  lightSpeed = 1.0;
  //lightSpeed = 0.95

	vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 position = uv * 2. - 1.;
  position.y *= iResolution.y / iResolution.x;

  vec4 color = vec4(0.05, 0.05, 0.05, 1.0);
  for(float i = 0.; i < 2.; i++) {
  	vec4 starColor = mapStar(position, lightSpeed, i * 20.);
      color.rgb += starColor.rgb * starColor.a;
  }

  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = color;
  // gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
}`;
    }
  }



  // Returns a WebGL Shader from source string
  // Type is: webGL.VERTEX_SHADER or webGL.FRAGMENT_SHADER
  function createShader(webGL, type, source) {
    const shader = webGL.createShader(type);
    webGL.shaderSource(shader, source);
    webGL.compileShader(shader);
    const success = webGL.getShaderParameter(shader, webGL.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(webGL.getShaderInfoLog(shader));
    webGL.deleteShader(shader);
  }
  // Returns WebGL program from two shaders.
  function createProgram(webGL, vertexShader, fragmentShader) {
    const program = webGL.createProgram();
    webGL.attachShader(program, vertexShader);
    webGL.attachShader(program, fragmentShader);
    webGL.linkProgram(program);
    const success = webGL.getProgramParameter(program, webGL.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(webGL.getProgramInfoLog(program));
    webGL.deleteProgram(program);
  }


  //
  // Main
  function main() {
    const elCanvas = window.elCanvas;
    const webGL = window.webGL = elCanvas.getContext("webgl");
    if (!webGL) {
     alert('Your browser does not support WebGL.');
     return;
    }
    webGL.viewport(0, 0, webGL.canvas.width, webGL.canvas.height);

    // Two triangles to cover the entire space.
    // I feel like there is a better way, but I currently do not know it.
    const points = [-1, 1, 1, 1, -1, -1,
      1, 1, 1, -1, -1, -1,];
    // Every point is two positions. `x,y`
    const numberOfTriangles = points.length/2;


    // Create the GLSL program and start using it.
    const hyperspace = new HyperspaceGLSL(webGL);
    hyperspace.points = points;
    hyperspace.use();

    // Animate it!
    const animate = (time) => {
      requestAnimationFrame(animate);
      console.log('animate loop', time);

      // Clear the canvas
      webGL.clearColor(0, 0, 0, 0);
      webGL.clear(webGL.COLOR_BUFFER_BIT);

      // Update the time
      hyperspace.currentTime = time/1000;
      // Re-draw
      webGL.drawArrays(webGL.TRIANGLES, 0, numberOfTriangles);
    };

    animate(0);
  }
  main();

}());
