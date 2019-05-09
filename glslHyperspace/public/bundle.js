(function () {
  'use strict';

  // My first time trying GLSL, Special thanks to:
  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  // https://thebookofshaders.com
  // https://www.khronos.org/files/opengles_shading_language.pdf
  // https://www.shadertoy.com/view/4lsXRl

  //
  // Helper class to workwith the WebGL program.
  class HyperspaceGLSL {
    constructor(webGL) {
      this.webGL = webGL;
      this.program = createProgram(webGL, this.vertexShader, this.fragmentShader);
      webGL.useProgram(this.program);
      this.setResolution();
    }

    setResolution() {
      const { webGL, program } = this;
      const ptrLocation = webGL.getUniformLocation(program, 'resolution');
      webGL.uniform2fv(ptrLocation, [webGL.canvas.width, webGL.canvas.height]);
    }

    set percentOfLightspeed(value) {
      const { webGL, program } = this;
      const ptrLocation = webGL.getUniformLocation(program, 'percentOfLightspeed');
      webGL.uniform1f(ptrLocation, value);
    }
    set currentTime(value) {
      const { webGL, program } = this;
      const ptrLocation = webGL.getUniformLocation(program, 'currentTime');
      webGL.uniform1f(ptrLocation, value);
    }
    set points(value) {
      const { webGL, program } = this;
      // Get a pointer to the location of the attribute in the program
      const ptrLocation = webGL.getAttribLocation(program, 'points');
      webGL.enableVertexAttribArray(ptrLocation);

      // Create a buffer at webGL.ARRAY_BUFFER for us to bind data.
      const buffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, buffer);

      // Copy the data into webGL.ARRAY_BUFFER
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(value), webGL.STATIC_DRAW);
      // Binds the data at webGL.ARRAY_BUFFER to the attribute
      webGL.vertexAttribPointer(ptrLocation, 2, webGL.FLOAT, false, 0, 0);
    }

    get vertexShader() {
      const { webGL, vertexShaderSource } = this;
      if (!this._vertexShader) {
        this._vertexShader = createShader(webGL, webGL.VERTEX_SHADER, vertexShaderSource);
      }
      return this._vertexShader;
    }
    get vertexShaderSource() {
      // Because GLSL isn't JS, and it's long, I'm storing it in a script tag.
      return window.elVertexShaderSource.text;
    }

    get fragmentShader() {
      const { webGL, fragmentShaderSource } = this;
      if (!this._fragmentShader) {
        this._fragmentShader = createShader(webGL, webGL.FRAGMENT_SHADER, fragmentShaderSource);
      }
      return this._fragmentShader;
    }
    get fragmentShaderSource() {
      // Because GLSL isn't JS, and it's long, I'm storing it in a script tag.
      return window.elFragmentShaderSource.text;
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
    // eslint-disable-next-line no-console
    console.log(webGL.getShaderInfoLog(shader));
    webGL.deleteShader(shader);
    return null;
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
    // eslint-disable-next-line no-console
    console.log(webGL.getProgramInfoLog(program));
    webGL.deleteProgram(program);
    return null;
  }


  //
  // Main
  function main() {
    const elCanvas = window.elCanvas;
    const elLightSpeed = window.elLightSpeed;
    const webGL = window.webGL = elCanvas.getContext('webgl');
    if (!webGL) {
      // eslint-disable-next-line no-alert
      alert('Your browser does not support WebGL.');
      return;
    }
    webGL.viewport(0, 0, webGL.canvas.width, webGL.canvas.height);


    // Two triangles to cover the entire space.
    // I feel like there is a better way, but I currently do not know it.
    const points = [-1, 1, 1, 1, -1, -1,
      1, 1, 1, -1, -1, -1];
    // Every point is two positions. `x,y`
    const numberOfTriangles = points.length/2;


    // Create the GLSL program and start using it.
    const hyperspace = window.vfx = new HyperspaceGLSL(webGL);
    hyperspace.points = points;
    hyperspace.percentOfLightspeed = 0.5;

    // Animate it!
    const animate = (time) => {
      // Loop forever!
      requestAnimationFrame(animate);
      // Clear the canvas
      webGL.clearColor(0, 0, 0, 0);
      webGL.clear(webGL.COLOR_BUFFER_BIT);

      // Update the time
      hyperspace.currentTime = time/1000;
      // Re-draw
      webGL.drawArrays(webGL.TRIANGLES, 0, numberOfTriangles);
    };

    //
    // User input!
    elLightSpeed.addEventListener('change', (event) => {
      const { target } = event;
      const newSpeed = parseInt(target.value, 10);
      hyperspace.percentOfLightspeed = newSpeed/100;
    });

    animate(0);
  }
  main();

}());
