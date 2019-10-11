let canvas = document.getElementById("matter-canvas");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

let min_width = width / 15;
let max_width = width / 10;
let min_height = height / 15;
let max_height = height / 10;


let colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];
let objects = [];

// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

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

//walls
objects.push(Bodies.rectangle(width / 2, height + 100, width * 1.5, 200, { isStatic: true }));
objects.push(Bodies.rectangle(width / 2, -100, width * 1.5, 200, { isStatic: true }));

objects.push(Bodies.rectangle(-100, height / 2, 200, height * 1.5, { isStatic: true }));
objects.push(Bodies.rectangle(width + 100, height / 2, 200, height * 1.5, { isStatic: true }));


for (i = 0; i < 8; i++) {
    let item_width = Math.floor(Math.random() * max_width) + min_width;
    let item_height = Math.floor(Math.random() * max_height) + min_height;

    let x = Math.floor(Math.random() * (width - max_width)) + min_width;
    let y = Math.floor(Math.random() * (height - max_height)) + min_height;

    objects.push(Matter.Bodies.rectangle(x, y, item_width, item_height, {
        render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] }
    }));
}

for (i = 0; i < 6; i++) {
    let radius = (Math.floor(Math.random() * max_width) + min_width) / 3;


    let x = Math.floor(Math.random() * (width - max_width)) + min_width;
    let y = Math.floor(Math.random() * (height - max_height)) + min_height;

    objects.push(Matter.Bodies.circle(x, y, radius, {
        render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] }
    }));
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