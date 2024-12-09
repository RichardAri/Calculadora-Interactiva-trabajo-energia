let speedSlider, angleSlider, gravitySlider;
let initialSpeed = 30; // Velocidad inicial en m/s
let launchAngle = 45; // Ángulo de lanzamiento en grados
let gravity = 9.8; // Gravedad en m/s²
let time = 0; // Tiempo transcurrido
let maxHeight = 0; // Altura máxima
let range = 0; // Alcance total
let trajectory = []; // Trayectoria del proyectil
let x = 0,
  y = 0; // Posición del proyectil
let vX = 0,
  vY = 0; // Componentes de la velocidad
let isInFlight = false; // Estado de la simulación (si el proyectil está en el aire o no)
let projectileColor = [100, 150, 255]; // Color inicial del proyectil

function setup() {
  // Crear el canvas dentro del contenedor #simulationCanvas
  let canvas = createCanvas(800, 400); // Mantener el canvas a 800x400
  canvas.parent("simulationCanvas");
  noLoop();

  // Inicializar los sliders
  speedSlider = select("#speed");
  angleSlider = select("#angle");
  gravitySlider = select("#gravity");

  // Actualizar el valor de los sliders al cambiar
  speedSlider.input(updateValues);
  angleSlider.input(updateValues);
  gravitySlider.input(updateValues);

  updateValues(); // Inicializar valores
}

function draw() {
  background(240);

  if (!isInFlight) return;

  // Incrementar tiempo
  time += 0.1;

  // Calcular posición física
  let angleRad = radians(launchAngle);
  vX = initialSpeed * cos(angleRad);
  vY = initialSpeed * sin(angleRad);
  x = vX * time;
  y = vY * time - 0.5 * gravity * time * time;

  // Actualizar la altura máxima solo cuando el proyectil esté ascendiendo
  if (y > maxHeight) {
    maxHeight = y;
  }

  // Detener el proyectil al tocar el suelo
  if (y <= 0) {
    y = 0;
    trajectory.push({ x: x, y: y });
    isInFlight = false;
    noLoop();
    range = calculateRange(); // Calcular el alcance cuando el proyectil toca el suelo
    select("#rangeResult").html(range.toFixed(2) + " m");
  } else {
    trajectory.push({ x: x, y: y });
  }

  // Dibujar trayectoria ajustada al canvas
  let scaleFactorX = Math.min(1, width / (x + 100));
  let scaleFactorY = Math.min(
    1,
    height / (Math.max(...trajectory.map((p) => p.y)) + 100)
  );
  let scaledTrajectory = trajectory.map((point) => ({
    x: point.x * scaleFactorX,
    y: point.y * scaleFactorY,
  }));

  stroke(255, 0, 0);
  noFill();
  beginShape();
  for (let i = 0; i < scaledTrajectory.length; i++) {
    vertex(scaledTrajectory[i].x, height - scaledTrajectory[i].y);
  }
  endShape();

  // Dibujar el proyectil
  fill(projectileColor);
  ellipse(
    scaledTrajectory[scaledTrajectory.length - 1].x,
    height - scaledTrajectory[scaledTrajectory.length - 1].y,
    20,
    20
  );

  // Actualizar resultados
  select("#maxHeightResult").html(maxHeight.toFixed(2) + " m");

  // Actualizar tiempo de vuelo
  select("#timeResult").html(time.toFixed(2) + " s");

  // Actualizar velocidad instantánea
  let velocity = Math.sqrt(vX ** 2 + (vY - gravity * time) ** 2);
  select("#velocityResult").html(velocity.toFixed(2) + " m/s");
}

// Calcular altura máxima según la fórmula física
function calculateMaxHeight() {
  let angleRad = radians(launchAngle);
  return Math.pow(initialSpeed * Math.sin(angleRad), 2) / (2 * gravity);
}

// Calcular el alcance total de la trayectoria
function calculateRange() {
  let angleRad = radians(launchAngle);
  return Math.pow(initialSpeed, 2) * Math.sin(2 * angleRad) / gravity;
}

// Precomputar la trayectoria completa
function precomputeTrajectory() {
  trajectory = [];
  let t = 0;
  let angleRad = radians(launchAngle);
  let vX = initialSpeed * cos(angleRad);
  let vY = initialSpeed * sin(angleRad);
  while (true) {
    let posX = vX * t;
    let posY = vY * t - 0.5 * gravity * t * t;
    if (posY < 0) break;
    trajectory.push({ x: posX, y: posY });
    t += 0.1; // Incremento de tiempo para precomputar
  }
}

function updateValues() {
  initialSpeed = speedSlider.value();
  launchAngle = angleSlider.value();
  gravity = gravitySlider.value();

  select("#speedValue").html(initialSpeed + " m/s");
  select("#angleValue").html(launchAngle + "°");
  select("#gravityValue").html(gravity + " m/s²");

  // Reiniciar valores
  trajectory = [];
  time = 0;
  maxHeight = 0;
  range = 0;
  isInFlight = true;

  // Reiniciar resultados mostrados
  select("#timeResult").html("0 s");
  select("#velocityResult").html("0 m/s");

  // Precomputar la trayectoria y reiniciar los resultados
  precomputeTrajectory();

  loop();
}
