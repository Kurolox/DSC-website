const canvas = document.getElementById("matter-canvas");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

let min_width = width / 15;
let max_width = width / 10;
let min_height = height / 15;
let max_height = height / 10;


const colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];
let objects = [];

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vertices = Matter.Vertices,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint;


// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
    element: canvas,
    engine: engine,
    options: {
        wireframeBackground: 'transparent',
        background: 'transparent',
        width: width,
        height: height,
        wireframes: false,
    }
});

let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

//Allow scrollwheel to work

mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

World.add(engine.world, mouseConstraint);

//Scroll website when not touching any object
let previousPoint = 0;
Events.on(mouseConstraint, "mousedown", function (event) {
    if (!event.mouse.button && !mouseConstraint.body) {
        previousPoint = event.mouse.mousedownPosition.y;
    }
});

Events.on(mouseConstraint, "mousemove", function (event) {
    if (!previousPoint){
        return;
    }
    if (previousPoint - event.mouse.position.y > window.innerHeight / 8) {
        document.getElementById("quienes-somos").scrollIntoView();
        previousPoint = 0;
    }
});
// keep the mouse in sync with rendering
render.mouse = mouse;

//walls
objects.push(Bodies.rectangle(width / 2, height + 100, width * 1.5, 200, { isStatic: true, render: { fillStyle: "transparent" } }));
objects.push(Bodies.rectangle(width / 2, -100, width * 1.5, 200, { isStatic: true, render: { fillStyle: "transparent" } }));
objects.push(Bodies.rectangle(-100, height / 2, 200, height * 1.5, { isStatic: true, render: { fillStyle: "transparent" } }));
objects.push(Bodies.rectangle(width + 1000, height / 2, 2000, height * 1.5, { isStatic: true, render: { fillStyle: "transparent" } }));


for (i = 0; i < randomInt(4, 9); i++) {
    objects.push(generateSqaure());
}

for (i = 0; i < randomInt(4, 9); i++) {
    objects.push(generateRectangle());
}

for (i = 0; i < randomInt(4, 9); i++) {
    objects.push(generateCircle());
}

for (i = 0; i < randomInt(4, 9); i++) {
    objects.push(generateTriangle());
}

// add all of the bodies to the world
World.add(engine.world, objects);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

// Resize canvas if the window is resized
window.addEventListener("resize", function () {
    render.canvas.width = canvas.offsetWidth;
    render.canvas.height = canvas.offsetHeight;
});

function randomInt(floor, roof) {
    // Returns a random int between floor (inclusive) and roof (exclusive)
    return (Math.floor(Math.random() * roof) + floor);
}

function randomChoice(list) {
    // Given a list, returns a random item from said list
    return list[Math.floor(Math.random() * list.length)];
}

function generateSqaure() {
    // Randomize size between min and max values
    let side = randomInt(min_width, max_width) / 2;

    // Spawn at random coordinate inside the safe boundaries
    let x = randomInt(min_width, width - max_width);
    let y = randomInt(min_height, height - max_height);

    return Matter.Bodies.rectangle(x, y, side, side, {
        render: generateStyle(), frictionStatic: 1
    });
}

function generateRectangle() {
    // Randomize size between min and max values
    let item_width = randomInt(min_width, max_width);
    let item_height = randomInt(min_height, max_height);

    // Spawn at random coordinate inside the safe boundaries
    let x = randomInt(min_width, width - max_width);
    let y = randomInt(min_height, height - max_height);

    return Matter.Bodies.rectangle(x, y, item_width, item_height, {
        render: generateStyle(), frictionStatic: 1
    });
}

function generateCircle() {
    // Randomize a reasonably sized radius
    let radius = randomInt(min_width, max_width) / 3;

    // Spawn at random coordinate inside the safe boundaries
    let x = randomInt(min_width, width - max_width);
    let y = randomInt(min_height, height - max_height);

    return Matter.Bodies.circle(x, y, radius, {
        render: generateStyle(), frictionStatic: 1
    });
}

function generateTriangle() {
    let side = randomInt(min_width, max_width) / 2;
    let triangle = Vertices.fromPath(`${side / 2} 0, ${side} ${side}, 0 ${side}`);

    // Spawn at random coordinate inside the safe boundaries
    let x = randomInt(min_width, width - max_width);
    let y = randomInt(min_height, height - max_height);



    return Bodies.fromVertices(x, y, triangle, {
        render: generateStyle(), frictionStatic: 1
    })
}

function generateStyle() {
    // Randomly chooses the color and if the item is solid or not

    let render = {};
    if (Math.random() > -1) { //TODO: Change back to .5 after border debugging
        render.fillStyle = randomChoice(colors);
        return render;
    }

    render.fillStyle = "transparent";
    render.strokeStyle = randomChoice(colors);
    render.lineWidth = randomInt(8, 13);
    return render;
}