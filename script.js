// Variables globales para los controles
let forceSlider, massSlider, distanceSlider;
let force = 10, mass = 5, distance = 5;
let velocity = 0, position = 0, time = 0;
let workDone = 0, kineticEnergy = 0, potentialEnergy = 0;
let canvas;

function setup() {
    // Crear el canvas de p5.js
    canvas = createCanvas(600, 200);
    canvas.parent('simulationCanvas');

    // Inicializar los sliders
    forceSlider = select('#force');
    massSlider = select('#mass');
    distanceSlider = select('#distance');

    // Actualizar el valor de los sliders al cambiar
    forceSlider.input(updateValues);
    massSlider.input(updateValues);
    distanceSlider.input(updateValues);

    updateValues();
}

function draw() {
    background(240);

    // Variables físicas
    force = forceSlider.value();
    mass = massSlider.value();
    distance = distanceSlider.value();

    // Calculamos el trabajo realizado (suponiendo fuerza constante)
    workDone = force * distance;

    // Actualizar energía cinética y potencial
    kineticEnergy = 0.5 * mass * velocity * velocity;
    potentialEnergy = mass * 9.81 * position;

    // Dibujar el objeto (en el eje X)
    let xPos = map(position, 0, distance, 50, width - 50);
    fill(100, 150, 255);
    ellipse(xPos, height / 2, 40, 40);

    // Movimiento del objeto: Velocidad = distancia / tiempo (simplificado)
    velocity = force / mass; // Usamos la 2da Ley de Newton: F = ma
    position += velocity * 0.1; // Ajuste del movimiento por frames
    time += 0.1;

    // Asegurarse que el objeto no se mueva más allá de la distancia
    if (position >= distance) position = distance;

    // Mostrar resultados
    select('#workResult').html(workDone.toFixed(2) + ' J');
    select('#kineticEnergy').html(kineticEnergy.toFixed(2) + ' J');
    select('#potentialEnergy').html(potentialEnergy.toFixed(2) + ' J');
}

// Actualizar los valores de las variables
function updateValues() {
    force = forceSlider.value();
    mass = massSlider.value();
    distance = distanceSlider.value();

    select('#forceValue').html(force + ' N');
    select('#massValue').html(mass + ' kg');
    select('#distanceValue').html(distance + ' m');
}
