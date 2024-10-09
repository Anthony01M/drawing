const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const brushSizeDisplay = document.getElementById('brush-size-display');
const clearCanvasBtn = document.getElementById('clear-canvas');
const downloadBtn = document.getElementById('download');

let isDrawing = false;
let currentTool = 'pencil';
let startX, startY;
let tempCanvas, tempCtx;
let shapePreviewCanvas, shapePreviewCtx;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;
    tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx = tempCanvas.getContext('2d');
    shapePreviewCanvas = document.createElement('canvas');
    shapePreviewCanvas.width = canvas.width;
    shapePreviewCanvas.height = canvas.height;
    shapePreviewCtx = shapePreviewCanvas.getContext('2d');
}

function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
    const activeToolBtn = document.getElementById(`${tool}-tool`);
    if (activeToolBtn) {
        activeToolBtn.classList.add('active');
    }
}

function startDrawing(e) {
    isDrawing = true;
    [startX, startY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];

    if (currentTool === 'pencil' || currentTool === 'eraser') {
        tempCtx.beginPath();
        tempCtx.moveTo(startX, startY);
    }
}

function draw(e) {
    if (!isDrawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    if (currentTool === 'pencil' || currentTool === 'eraser') {
        tempCtx.lineWidth = brushSize.value;
        tempCtx.lineCap = 'round';
        tempCtx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : colorPicker.value;
        tempCtx.lineTo(x, y);
        tempCtx.stroke();
    } else {
        shapePreviewCtx.clearRect(0, 0, shapePreviewCanvas.width, shapePreviewCanvas.height);
        drawShape(shapePreviewCtx, startX, startY, x, y);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.drawImage(shapePreviewCanvas, 0, 0);
}

function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    if (currentTool !== 'pencil' && currentTool !== 'eraser') {
        drawShape(tempCtx, startX, startY, x, y);
    }
    shapePreviewCtx.clearRect(0, 0, shapePreviewCanvas.width, shapePreviewCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

function drawShape(context, x1, y1, x2, y2) {
    context.beginPath();
    context.lineWidth = brushSize.value;
    context.lineCap = 'round';
    context.strokeStyle = colorPicker.value;

    switch (currentTool) {
        case 'line':
            drawLine(context, x1, y1, x2, y2);
            break;
        case 'rectangle':
            drawRectangle(context, x1, y1, x2 - x1, y2 - y1);
            break;
        case 'square':
            drawSquare(context, x1, y1, x2, y2);
            break;
        case 'circle':
            drawCircle(context, x1, y1, x2, y2);
            break;
        case 'ellipse':
            drawEllipse(context, x1, y1, x2, y2);
            break;
        case 'triangle':
            drawTriangle(context, x1, y1, x2, y2);
            break;
        case 'right-triangle':
            drawRightTriangle(context, x1, y1, x2, y2);
            break;
        case 'pentagon':
            drawPolygon(context, x1, y1, x2, y2, 5);
            break;
        case 'hexagon':
            drawPolygon(context, x1, y1, x2, y2, 6);
            break;
        case 'octagon':
            drawPolygon(context, x1, y1, x2, y2, 8);
            break;
        case 'star':
            drawStar(context, x1, y1, x2, y2);
            break;
        case 'heart':
            drawHeart(context, x1, y1, x2, y2);
            break;
        case 'arrow':
            drawArrow(context, x1, y1, x2, y2);
            break;
    }
    context.stroke();
}

function drawLine(context, x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
}

function drawRectangle(context, x, y, width, height) {
    context.rect(x, y, width, height);
}

function drawSquare(context, x1, y1, x2, y2) {
    const size = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    const x = x1 < x2 ? x1 : x1 - size;
    const y = y1 < y2 ? y1 : y1 - size;
    drawRectangle(context, x, y, size, size);
}

function drawCircle(context, x1, y1, x2, y2) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    context.arc(x1, y1, radius, 0, 2 * Math.PI);
}

function drawEllipse(context, x1, y1, x2, y2) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
}

function drawTriangle(context, x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x1 - (x2 - x1), y2);
    context.closePath();
}

function drawRightTriangle(context, x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x1, y2);
    context.closePath();
}

function drawPolygon(context, x1, y1, x2, y2, sides) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
    context.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
    for (let i = 1; i <= sides; i++) {
        const angle = i * 2 * Math.PI / sides;
        context.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    }
    context.closePath();
}

function drawStar(context, x1, y1, x2, y2) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const outerRadius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
    const innerRadius = outerRadius / 2;
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * Math.PI / points;
        context.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    }
    context.closePath();
}

function drawHeart(context, x1, y1, x2, y2) {
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    context.moveTo(centerX, centerY + height / 4);
    context.bezierCurveTo(centerX + width / 2, centerY - height / 2, centerX + width, centerY, centerX, centerY + height / 2);
    context.bezierCurveTo(centerX - width, centerY, centerX - width / 2, centerY - height / 2, centerX, centerY + height / 4);
}

function drawArrow(context, x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const arrowHeadLength = Math.min(length / 3, 20);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x2 - arrowHeadLength * Math.cos(angle - Math.PI / 6), y2 - arrowHeadLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(x2, y2);
    context.lineTo(x2 - arrowHeadLength * Math.cos(angle + Math.PI / 6), y2 - arrowHeadLength * Math.sin(angle + Math.PI / 6));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    shapePreviewCtx.clearRect(0, 0, shapePreviewCanvas.width, shapePreviewCanvas.height);
}

function updateBrushSizeDisplay() {
    brushSizeDisplay.textContent = brushSize.value;
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearCanvasBtn.addEventListener('click', clearCanvas);
downloadBtn.addEventListener('click', downloadCanvas);
brushSize.addEventListener('input', updateBrushSizeDisplay);

document.querySelectorAll('.toolbar button').forEach(btn => {
    if (btn.id !== 'clear-canvas' && btn.id !== 'download') {
        btn.addEventListener('click', () => setActiveTool(btn.id.replace('-tool', '')));
    }
});

resizeCanvas();
updateBrushSizeDisplay();