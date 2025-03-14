function generateMap() {
    const mapType = document.getElementById("map-type").value;
    const mapSize = document.getElementById("map-size").value;
    const density = document.getElementById("density").value;

    let width, height;
    switch (mapSize) {
        case "small":
            width = height = 20;
            break;
        case "medium":
            width = height = 40;
            break;
        case "large":
            width = height = 60;
            break;
    }

    const canvas = document.getElementById("map-canvas");
    canvas.width = width * 10; // Escalar para mejor visibilidad
    canvas.height = height * 10;
    const ctx = canvas.getContext("2d");

    // Limpiar el canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generar mapa (ejemplo: mazmorra con cellular automata)
    const map = generateDungeon(width, height, density);

    // Dibujar el mapa
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = map[y][x] === 1 ? "#000" : "#fff"; // 1 = pared, 0 = suelo
            ctx.fillRect(x * 10, y * 10, 10, 10);
        }
    }
}

// Algoritmo de cellular automata para generar mazmorras
function generateDungeon(width, height, density) {
    const map = [];
    let fillPercent;

    switch (density) {
        case "low":
            fillPercent = 0.3;
            break;
        case "medium":
            fillPercent = 0.45;
            break;
        case "high":
            fillPercent = 0.6;
            break;
    }

    // Inicializar mapa con paredes aleatorias
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = Math.random() < fillPercent ? 1 : 0;
        }
    }

    // Aplicar reglas de cellular automata (5 iteraciones)
    for (let i = 0; i < 5; i++) {
        const newMap = [];
        for (let y = 0; y < height; y++) {
            newMap[y] = [];
            for (let x = 0; x < width; x++) {
                const wallCount = countWalls(map, x, y, width, height);
                newMap[y][x] = wallCount > 4 ? 1 : 0;
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                map[y][x] = newMap[y][x];
            }
        }
    }

    return map;
}

function countWalls(map, x, y, width, height) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                count += map[ny][nx];
            } else {
                count++; // Considerar bordes como paredes
            }
        }
    }
    return count;
}

function exportMap() {
    const canvas = document.getElementById("map-canvas");
    const link = document.createElement("a");
    link.download = "map.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
