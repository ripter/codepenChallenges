const { Composite } = Matter;
const HEIGHT = 375;
const WIDTH = 812;
const SEGMENT_WIDTH = 15;
const SEGMENT_HEIGHT = 20;
const SEGMENT_MAX_HEIGHT = 16;
const LANDER_WIDTH = 50;

class SpaceShip {
  constructor() {
    const x = WIDTH / 2 - 25;
    const y = 0;
    this.size = {
      width: LANDER_WIDTH,
      height: LANDER_WIDTH * 0.5,
      halfWidth: LANDER_WIDTH/2,
      halfHeight: (LANDER_WIDTH * 0.5)/2,
    };
    this.body = Matter.Bodies.trapezoid(x, y, this.size.width, this.size.height, 0.7, {
      label: 'player',
      density: 1,
      friction: 0.9,
      frictionAir: 0.1,
    });
  }

  // Fires the main thrusters
  fireThruster() {
    const thrusterAngle = (0| this.body.angle * 100)/100;
    const thrusterOffset = Matter.Vector.create(0, 1);
    // Create a force that matches the thruster's angle.
    let force = Matter.Vector.rotate(thrusterOffset, thrusterAngle);
    force = Matter.Vector.mult(force, -5);
    // Apply the fource to ourself with no torque
    Matter.Body.applyForce(this.body, this.body.position, force);
  }

  fireManeuvering(angle) {
    const { body } = this;
    // body.angle += angle;
    Matter.Body.rotate(body, angle);
  }

  get thrusterPosition() {
    const { size } = this;
    return {
      x: -size.halfWidth,
      y: size.halfHeight,
    };
  }
}




// Returns a new gameState initalized and ready to use.
function initWorld() {
  // create an engine, it holds the world and manages the simulation.
  const engine = Matter.Engine.create({
    enableSleeping: false,
  });
  //create a renderer to display the results on the page.
  var render = Matter.Render.create({
    canvas: window.elCanvas,
    engine: engine,
    options: {
      // iPhone X size Landscape
      width: WIDTH,
      height: HEIGHT,
      showVelocity: true,
      showCollisions: true,
    },
  });

  // Create the Bodies in the world
  const lander = new SpaceShip();
  const surface = createSurface(WIDTH);
  const mouseConstraint = createMouseControl(render.canvas, engine);
  render.mouse = mouseConstraint;
  // add all of the bodies to the world
  Matter.World.add(engine.world, [lander.body, surface, mouseConstraint]);
  // Adjust the gravity for the alien planet.
  engine.world.gravity.y = 0.5;

  return {
    engine,
    render,
    lander,
    surface,
  };
}

// Creates a drag control for non-static bodies.
function createMouseControl(canvas, engine) {
  const mouse = Matter.Mouse.create(canvas);
  return Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true,
      },
    },
  });
}

// Creates a random planet surface.
function createSurface(maxWidth) {
  const totalSegments = 0 | (maxWidth / SEGMENT_WIDTH);
  const body = Composite.create({
    label: 'surface',
  });

  for (let i = 0; i < totalSegments; i++) {
    const x = i * SEGMENT_WIDTH;
    const rnd = 0 | (Math.random() * SEGMENT_MAX_HEIGHT);
    const height = SEGMENT_HEIGHT * (rnd + 1);

    Composite.add(body, Matter.Bodies.rectangle(x + SEGMENT_WIDTH / 2, HEIGHT - 10,
      SEGMENT_WIDTH, height, {
        isStatic: true,
        friction: 1,
      }));
  }
  return body;
}

// Helper to draw something positioned and rotated on the context.
function drawAt(context, {x, y, angle}, render) {
  context.translate(x, y);
  context.rotate(angle);
  render(context);
  context.rotate(-angle);
  context.translate(-x, -y);
}
//
// Main
//
const worldState = initWorld();
// Starts a requestAnimationFrame re-render as the Engine updates.
Matter.Render.run(worldState.render);
// Start the engine simulating the world
Matter.Engine.run(worldState.engine);

// Render on top of of the rendered bodies.
Matter.Events.on(worldState.render, 'afterRender', () => {
  const { context } = worldState.render;
  const { force, angle, position } = worldState.lander.body;
  const { thrusterPosition, size } = worldState.lander;
  // fomat the velocity for rendering.
  const velocity = {
    x: (0|worldState.lander.body.velocity.x*100)/100,
    y: -(0|worldState.lander.body.velocity.y*100)/100,
  };
  // Apply the same transforms used to render the bodies
  Matter.Render.startViewTransform(worldState.render);

  // Render some Text
  context.fillText(`Velocity: ${velocity.x}, ${velocity.y}`, 10, 20);

  // If we have force, show thruster
  if (force.x !== 0 || force.y !== 0) {
    drawAt(context, Object.assign({}, position, {angle}), () => {
      const exhaustSize = 50;
      const center = {
        x: thrusterPosition.x + (size.width/2),
        y: thrusterPosition.y,
      };
      context.fillStyle = '#FFDC00';
      context.beginPath();
      context.moveTo(center.x - 5, center.y);
      context.lineTo(thrusterPosition.x, thrusterPosition.y + exhaustSize);
      context.lineTo(thrusterPosition.x + size.width, thrusterPosition.y + exhaustSize);
      context.lineTo(center.x + 5, center.y);
      context.fill();
    });
  }

  // Reset the transforms.
  Matter.Render.endViewTransform(worldState.render);
});

// Handle User Controls
const inputHandler = {
  handleEvent(event) {
    event.preventDefault();
    const { target, code } = event;
    let action = target.getAttribute('action') || code;

    switch (action) {
      case 'ArrowLeft':
        return worldState.lander.fireManeuvering(-0.0872666);
      case 'ArrowRight':
        return worldState.lander.fireManeuvering(0.0872666);
      case 'Space':
      default:
        // Fire the lander thrusters
        return worldState.lander.fireThruster();
    }
  },
};

// Use mousedown instead of click so preventDefault can prevent text selection.
// Use touchend instead of click so preventDefault can prevent iOS zoom when the button is tapped quickly.
['mousedown', 'touchend', 'keydown'].forEach((eventName) => {
  window.addEventListener(eventName, inputHandler);
});
