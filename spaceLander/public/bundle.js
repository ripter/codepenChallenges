(function () {
  'use strict';

  const { Composite } = Matter;
  //
  // Main
  //
  const canvasSize = window.elCanvas.getBoundingClientRect();
  const worldState = initWorld(canvasSize.width, canvasSize.height);
  // Starts a requestAnimationFrame re-render as the Engine updates.
  Matter.Render.run(worldState.render);
  // Start the engine simulating the world
  Matter.Engine.run(worldState.engine);

  // Render on top of of the rendered bodies.
  Matter.Events.on(worldState.render, 'afterRender', () => {
    const { render, lander } = worldState;
    const { context } = render;
    const { force, angle, position } = lander.body;
    const { thruster, size } = lander;
    // format the velocity for rendering.
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
          x: thruster.x + (size.width/2),
          y: thruster.y,
        };
        context.fillStyle = '#FFDC00';
        context.beginPath();
        context.moveTo(center.x - 5, center.y);
        context.lineTo(thruster.x, thruster.y + exhaustSize);
        context.lineTo(thruster.x + size.width, thruster.y + exhaustSize);
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
          return fireManeuvering(worldState.lander.body, -0.0872666);
        case 'ArrowRight':
          return fireManeuvering(worldState.lander.body, 0.0872666);
        case 'Space':
        default:
          // Fire the lander thrusters
          return fireThruster(worldState.lander.body);
      }
    },
  };

  // Use mousedown instead of click so preventDefault can prevent text selection.
  // Use touchend instead of click so preventDefault can prevent iOS zoom when the button is tapped quickly.
  ['mousedown', 'touchend', 'keydown'].forEach((eventName) => {
    window.addEventListener(eventName, inputHandler);
  });






  //
  // Functions!
  //

  // Returns a new gameState initalized and ready to use.
  function initWorld(width, height) {
    // create an engine, it holds the world and manages the simulation.
    const engine = Matter.Engine.create({
      enableSleeping: false,
    });
    //create a renderer to display the results on the page.
    var render = Matter.Render.create({
      canvas: window.elCanvas,
      engine: engine,
      options: {
        width,
        height,
        showVelocity: true,
        showCollisions: true,
      },
    });

    // Create the Bodies in the world
    const surface = createSurface(width, height);
    const lander = createShip(width/2, 0);
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


  // Helper to draw something positioned and rotated on the context.
  function drawAt(context, {x, y, angle}, render) {
    context.translate(x, y);
    context.rotate(angle);
    render(context);
    context.rotate(-angle);
    context.translate(-x, -y);
  }


  // Creates a random planet surface.
  function createSurface(maxWidth, maxHeight) {
    const SEGMENT_WIDTH = 15;
    const SEGMENT_HEIGHT = 20;
    const SEGMENT_MAX_HEIGHT = 16;
    const totalSegments = 0 | (maxWidth / SEGMENT_WIDTH);
    const body = Composite.create({
      label: 'surface',
    });

    for (let i = 0; i < totalSegments; i++) {
      const x = i * SEGMENT_WIDTH;
      const rnd = 0 | (Math.random() * SEGMENT_MAX_HEIGHT);
      const height = SEGMENT_HEIGHT * (rnd + 1);

      Matter.Composite.add(body, Matter.Bodies.rectangle(x + SEGMENT_WIDTH / 2, maxHeight - 10,
        SEGMENT_WIDTH, height, {
          isStatic: true,
          friction: 1,
        }));
    }
    return body;
  }

  function createShip(x, y) {
    const LANDER_WIDTH = 50;
    const size = {
      width: LANDER_WIDTH,
      height: LANDER_WIDTH * 0.5,
      halfWidth: LANDER_WIDTH/2,
      halfHeight: (LANDER_WIDTH * 0.5)/2,
    };
    return {
      size,
      thruster: {
        x: -size.halfWidth,
        y: size.halfHeight,
      },
      body: Matter.Bodies.trapezoid(x, y, size.width, size.height, 0.7, {
        label: 'player',
        density: 1,
        friction: 0.9,
        frictionAir: 0.1,
      }),
    };
  }


  // Fires the main thrusters
  function fireThruster(body) {
    const thrusterAngle = body.angle;
    const thrusterOffset = Matter.Vector.create(0, 1);
    // Create a force that matches the thruster's angle.
    let force = Matter.Vector.rotate(thrusterOffset, thrusterAngle);
    force = Matter.Vector.mult(force, -5);
    // Apply the fource to ourself with no torque
    Matter.Body.applyForce(body, body.position, force);
  }
  // Fires maneuvering thrusters to rotate the ship.
  function fireManeuvering(body, angle) {
    Matter.Body.rotate(body, angle);
  }

}());
