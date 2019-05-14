const {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Composite,
  Composites,
  Mouse,
  MouseConstraint
} = Matter;
const HEIGHT = 375;
const WIDTH = 812;
const SEGMENT_WIDTH = 20;
const LANDER_WIDTH = 50;

class SpaceShip {
  constructor() {
    const x = WIDTH / 2 - 25;
    const y = 0;
    this.size = {
      width: LANDER_WIDTH,
      height: LANDER_WIDTH * 0.5
    };
    this.body = Bodies.trapezoid(x, y, this.size.width, this.size.height, 0.7, {
      label: 'player',
      density: 1,
      friction: 0.9,
      frictionAir: 0.1
    });
  }
  fireThruster() {
    console.log('fireThruster');
    const thrusterAngle = (0| this.body.angle * 100)/100;
    const thrusterOffset = Matter.Vector.create(0, 1);
    // Create a force that matches the thruster's angle.
    let force = Matter.Vector.rotate(thrusterOffset, thrusterAngle);
    force = Matter.Vector.mult(force, -15);
    // Apply the fource to ourself with no torque
    Matter.Body.applyForce(this.body, this.body.position, force);
  }
}




// Returns a new gameState initalized and ready to use.
function initWorld() {
  // create an engine, it holds the world and manages the simulation.
  const engine = Engine.create();
  //create a renderer to display the results on the page.
  var render = Render.create({
    canvas: window.elCanvas,
    engine: engine,
    options: {
      // iPhone X size Landscape
      width: WIDTH,
      height: HEIGHT,
      showVelocity: true,
      showCollisions: true
    }
  });

  // Create the Bodies in the world
  const lander = new SpaceShip();
  const surface = createSurface(WIDTH);
  const mouseConstraint = createMouseControl(render.canvas, engine);
  render.mouse = mouseConstraint;
  // add all of the bodies to the world
  World.add(engine.world, [lander.body, surface, mouseConstraint]);

  return {
    engine,
    render,
    lander,
    surface
  };
}

// Creates a drag control for non-static bodies.
function createMouseControl(canvas, engine) {
  const mouse = Mouse.create(canvas);
  return MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true
      }
    }
  });
}

// Creates a random planet surface.
function createSurface(maxWidth) {
  const totalSegments = 0 | (maxWidth / SEGMENT_WIDTH);
  const body = Composite.create({
    label: 'surface'
  });

  let y = 0;
  for (let i = 0; i < totalSegments; i++) {
    const x = i * SEGMENT_WIDTH;
    const rnd = 0 | (Math.random() * 6);
    const height = 50 * (rnd + 1);

    Composite.add(
      body,
      Bodies.rectangle(
        x + SEGMENT_WIDTH / 2,
        HEIGHT - 10,
        SEGMENT_WIDTH,
        height,
        {
          isStatic: true,
          friction: 1
        }
      )
    );
  }
  return body;
}

function vectorFromAngle(angle, length) {
  if (arguments.length === 1) {
    length = 1;
  }
  return Matter.Vector.create(length * Math.cos(angle), length * Math.sin(angle));
}

//
// Main
//
const worldState = initWorld();
// Starts a requestAnimationFrame re-render as the Engine updates.
Render.run(worldState.render);
// Start the engine simulating the world
Engine.run(worldState.engine);


// User Controls
const inputHandler = {
  handleEvent(event) {
    event.preventDefault();
    console.log('controlHandler', event);
    // Fire the lander thrusters
    worldState.lander.fireThruster();
  }
};

// Use mousedown instead of click so preventDefault can prevent text selection.
// Use touchend instead of click so preventDefault can prevent iOS zoom when the button is tapped quickly.
['mousedown', 'touchend', 'keypress'].forEach((eventName) => {
  window.addEventListener(eventName, inputHandler);
});
