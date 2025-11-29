let selectedY = [];
let selectedR = [];
let pointsHistory = [];

const GRAPH_CONFIG = {
    width: 650,
    height: 650,
    padding: 60,
    axisColor: '#e8c8c8',
    gridColor: '#887878',
    pointRadius: 5,
    xMin: -5,
    xMax: 5,
    yMin: -5,
    yMax: 5
};

const RADIUS_COLORS = {
    '1': 'rgba(216, 168, 184, 0.3)',
    '2': 'rgba(168, 216, 184, 0.3)', 
    '3': 'rgba(168, 184, 216, 0.3)',
    '4': 'rgba(216, 216, 168, 0.3)',
    '5': 'rgba(184, 168, 216, 0.3)'
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Форма загружена!');
    initializePage();
});

function initializePage() {
    setTimeout(() => {
        setupEventListeners();
        initializeGraph();
		loadHistoryPoints();
		setupSoundEffects();

        setTimeout(() => {
            redrawGraph();
        }, 100);
    }, 50);
}

function setupSoundEffects() {
    console.log('Настройка звуковых эффектов...');
    
    // Получаем аудио элементы
    const shlepa1Sound = document.getElementById('shlepa1-sound');
    const shlepa2Sound = document.getElementById('shlepa2-sound');
    const catSound = document.getElementById('cat-sound');
    
    // Функция для воспроизведения звука
    function playSound(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0; // Перематываем в начало
            audioElement.play().catch(e => {
                console.log('Воспроизведение звука заблокировано:', e);
            });
        }
    }
    
    // Обработчики для шлеп в header
    const shlepa1Images = document.querySelectorAll('#meme-column1 img.meme');
    const shlepa2Images = document.querySelectorAll('#meme-column2 img.meme');
    
    shlepa1Images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            console.log('Клик по первому шлепе');
            playSound(shlepa1Sound);
        });
    });
    
    shlepa2Images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            console.log('Клик по второму шлепе');
            playSound(shlepa2Sound);
        });
    });
    
    // Обработчик для кота
    const catImage = document.querySelector('img.clear_meme');
    if (catImage) {
        catImage.style.cursor = 'pointer';
        catImage.addEventListener('click', () => {
            console.log('Клик по коту');
            playSound(catSound);
        });
    }
    
    console.log('Звуковые эффекты настроены');
}

function loadHistoryPoints() {
    const tableRows = document.querySelectorAll('#result-table tbody tr');
    pointsHistory = [];
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            const point = {
                x: cells[0].textContent,
                y: cells[1].textContent,
                r: cells[2].textContent,
                hit: cells[3].classList.contains('result-hit'),
                requestTime: cells[4].textContent,
                executionTime: cells[5].textContent
            };
            pointsHistory.push(point);
        }
    });
	
	console.log('Загружено точек из истории:', pointsHistory.length);
}

function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    const yButtons = document.querySelectorAll('.y-btn');
    if (yButtons.length > 0) {
        yButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                toggleYValue(value, this);
            });
        });
        console.log('Обработчики для Y кнопок установлены');
    } else {
        console.warn('Y кнопки не найдены');
    }

    const rCheckboxes = document.querySelectorAll('input[name="r"]');
    if (rCheckboxes.length > 0) {
        rCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectedR();
                redrawGraph();
            });
        });
        console.log('Обработчики для R чекбоксов установлены');

        updateSelectedR();
    } else {
        console.warn('R чекбоксы не найдены. Ищем по разным селекторам...');

        const alternativeSelectors = [
            '.checkbox-input',
            'input[type="checkbox"][name="r"]',
            'input[type="checkbox"]'
        ];
        
        for (let selector of alternativeSelectors) {
            const found = document.querySelectorAll(selector);
            if (found.length > 0) {
                console.log(`Найдены элементы по селектору: ${selector}`);
                found.forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        updateSelectedR();
                        redrawGraph();
                    });
                });
                break;
            }
        }
    }

    const form = document.getElementById('point-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateAndPrepareForm()) {
                e.preventDefault();
            }
        });
        console.log('Обработчик формы установлен');
    } else {
        console.warn('Форма не найдена');
    }
    
    const clearBtn = document.getElementById('clear-history');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
        console.log('Обработчик очистки истории установлен');
    } else {
        console.warn('Кнопка очистки истории не найдена');
    }
    
    console.log('Все обработчики событий установлены');
}

function validateAndPrepareForm() {
    console.log('Валидация формы...');

    const xInput = document.getElementById('x-coord');
    const xValue = xInput.value.trim();
    
    const xValueNormalized = xValue.replace(',', '.');
    const xNumber = parseFloat(xValueNormalized);
    
    if (isNaN(xNumber) || xNumber < -5 || xNumber > 3) {
        showMessage('X должен быть числом от -5 до 3!', 'error');
        return false;
    }
    
    if (selectedY.length === 0) {
        showMessage('Выберите хотя бы одно значение Y!', 'error');
        return false;
    }
    
    if (selectedR.length === 0) {
        showMessage('Выберите хотя бы один радиус!', 'error');
        return false;
    }

    addHiddenFormFields();
    
    console.log('Форма валидна, добавляем скрытые поля');
    return true;
}

function addHiddenFormFields() {
    const form = document.getElementById('point-form');
    
    const oldHiddenFields = form.querySelectorAll('input[type="hidden"]');
    oldHiddenFields.forEach(field => {
        if (field.name === 'y') {
            field.remove();
        }
    });
    
    selectedY.forEach(y => {
        const yInput = document.createElement('input');
        yInput.type = 'hidden';
        yInput.name = 'y';
        yInput.value = y;
        form.appendChild(yInput);
    });
    
    console.log('Добавлены скрытые поля только для Y:', selectedY);
}

function toggleYValue(value, button) {
    const index = selectedY.indexOf(value);
    
    if (index > -1) {
        selectedY.splice(index, 1);
        button.classList.remove('active');
    } else {
        selectedY.push(value);
        button.classList.add('active');
    }
    
    console.log('Выбраны Y:', selectedY);
}

function updateSelectedR() {
    selectedR = [];
    
    const checkboxes = document.querySelectorAll('input[name="r"]:checked');
    if (checkboxes.length === 0) {
        const alternativeSelectors = [
            '.checkbox-input:checked',
            'input[type="checkbox"][name="r"]:checked'
        ];
        
        for (let selector of alternativeSelectors) {
            const found = document.querySelectorAll(selector);
            if (found.length > 0) {
                found.forEach(checkbox => selectedR.push(checkbox.value));
                break;
            }
        }
    } else {
        checkboxes.forEach(checkbox => selectedR.push(checkbox.value));
    }
    
    console.log('Выбраны R:', selectedR);
}

function initializeGraph() {
    const canvas = document.getElementById('coordinate-plane');
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    
    console.log('Инициализация графика...');
    
    canvas.width = GRAPH_CONFIG.width;
    canvas.height = GRAPH_CONFIG.height;
    
    canvas.addEventListener('click', function(event) {
        if (selectedR.length === 0) {
            showMessage('Сначала выберите радиус(ы)!', 'error');
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const mathX = pixelToMathX(x);
        const mathY = pixelToMathY(y);
        
        const clampedX = Math.max(-5, Math.min(5, mathX));
        const clampedY = Math.max(-5, Math.min(5, mathY));
        
        sendPointFromGraph(clampedX, clampedY);
    });
    
    redrawGraph();
    console.log('График инициализирован');
}

function sendPointFromGraph(x, y) {
    const roundedX = Math.round(x * 100) / 100;
    const roundedY = Math.round(y * 100) / 100;
    
    const formData = new URLSearchParams();
    formData.append('x', roundedX.toString());
    formData.append('y', roundedY.toString());
    formData.append('source', 'graph');
    
    selectedR.forEach(r => formData.append('r', r));
    
    console.log('Отправка точки с графика:', { 
        x: roundedX, 
        y: roundedY, 
        radii: selectedR 
    });
    
    fetch('controller', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            data.points.forEach(point => {
                addPointToTable(point);
                pointsHistory.unshift(point);
            });
            
            showMessage(`Добавлено ${data.points.length} точек!`, 'success');
            redrawGraph();
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке точки:', error);
        showMessage('Ошибка при проверке точки: ' + error.message, 'error');
    });
}

function addPointToTable(point) {
    const tbody = document.querySelector('#result-table tbody');
    if (!tbody) {
        console.warn('Таблица результатов не найдена');
        return;
    }
    
    const resultClass = point.hit ? 'result-hit' : 'result-miss';
    const resultText = point.hit ? 'Попадание' : 'Промах';
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${point.x}</td>
        <td>${point.y}</td>
        <td>${point.r}</td>
        <td class="${resultClass}">${resultText}</td>
        <td>${point.requestTime}</td>
        <td>${point.executionTime}с</td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    console.log('Точка добавлена в таблицу:', point);
}

function clearHistory() {
    fetch('controller?action=clear', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const tbody = document.querySelector('#result-table tbody');
            if (tbody) {
                tbody.innerHTML = '';
                console.log('История очищена');
            }
            pointsHistory = [];
            redrawGraph();
            showMessage('История очищена!', 'success');
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Ошибка при очистке истории:', error);
        showMessage('Ошибка при очистке истории: ' + error.message, 'error');
    });
}

function redrawGraph() {
    const canvas = document.getElementById('coordinate-plane');
    if (!canvas) {
        console.error('Canvas не найден при перерисовке!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context не доступен!');
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawCoordinateSystem(ctx);
    
    selectedR.forEach(r => {
        drawArea(ctx, r);
    });

    drawHistoryPoints(ctx);
    
    console.log('График перерисован');
}

function drawHistoryPoints(ctx) {
    pointsHistory.forEach(point => {
        if (selectedR.includes(point.r)) {
            const x = mathToPixelX(parseFloat(point.x));
            const y = mathToPixelY(parseFloat(point.y));
            
            ctx.beginPath();
            ctx.arc(x, y, GRAPH_CONFIG.pointRadius, 0, Math.PI * 2);
            ctx.fillStyle = point.hit ? '#88c8a8' : '#c88a8a';
            ctx.fill();
            ctx.strokeStyle = point.hit ? '#68a888' : '#a86868';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

function calculateScale() {
    const availableWidth = GRAPH_CONFIG.width - 2 * GRAPH_CONFIG.padding;
    const availableHeight = GRAPH_CONFIG.height - 2 * GRAPH_CONFIG.padding;
    
    const scaleX = availableWidth / (GRAPH_CONFIG.xMax - GRAPH_CONFIG.xMin);
    const scaleY = availableHeight / (GRAPH_CONFIG.yMax - GRAPH_CONFIG.yMin);
    
    return Math.min(scaleX, scaleY);
}

function mathToPixelX(mathX) {
    const scale = calculateScale();
    return GRAPH_CONFIG.padding + (mathX - GRAPH_CONFIG.xMin) * scale;
}

function mathToPixelY(mathY) {
    const scale = calculateScale();
    return GRAPH_CONFIG.height - GRAPH_CONFIG.padding - (mathY - GRAPH_CONFIG.yMin) * scale;
}

function pixelToMathX(pixelX) {
    const scale = calculateScale();
    return GRAPH_CONFIG.xMin + (pixelX - GRAPH_CONFIG.padding) / scale;
}

function pixelToMathY(pixelY) {
    const scale = calculateScale();
    return GRAPH_CONFIG.yMax - (pixelY - GRAPH_CONFIG.padding) / scale;
}

function drawCoordinateSystem(ctx) {
    ctx.fillStyle = '#1a181a';
    ctx.fillRect(0, 0, GRAPH_CONFIG.width, GRAPH_CONFIG.height);

    ctx.strokeStyle = GRAPH_CONFIG.gridColor;
    ctx.lineWidth = 0.5;
    
    for (let x = GRAPH_CONFIG.xMin; x <= GRAPH_CONFIG.xMax; x++) {
        const pixelX = mathToPixelX(x);
        ctx.beginPath();
        ctx.moveTo(pixelX, GRAPH_CONFIG.padding);
        ctx.lineTo(pixelX, GRAPH_CONFIG.height - GRAPH_CONFIG.padding);
        ctx.stroke();
    }
    
    for (let y = GRAPH_CONFIG.yMin; y <= GRAPH_CONFIG.yMax; y++) {
        const pixelY = mathToPixelY(y);
        ctx.beginPath();
        ctx.moveTo(GRAPH_CONFIG.padding, pixelY);
        ctx.lineTo(GRAPH_CONFIG.width - GRAPH_CONFIG.padding, pixelY);
        ctx.stroke();
    }

    ctx.strokeStyle = GRAPH_CONFIG.axisColor;
    ctx.lineWidth = 2;

    const xAxisY = mathToPixelY(0);
    ctx.beginPath();
    ctx.moveTo(GRAPH_CONFIG.padding, xAxisY);
    ctx.lineTo(GRAPH_CONFIG.width - GRAPH_CONFIG.padding, xAxisY);
    ctx.stroke();

    const yAxisX = mathToPixelX(0);
    ctx.beginPath();
    ctx.moveTo(yAxisX, GRAPH_CONFIG.padding);
    ctx.lineTo(yAxisX, GRAPH_CONFIG.height - GRAPH_CONFIG.padding);
    ctx.stroke();

    drawArrow(ctx, GRAPH_CONFIG.width - GRAPH_CONFIG.padding, xAxisY, 8, 0);
    drawArrow(ctx, yAxisX, GRAPH_CONFIG.padding, 8, -Math.PI / 2);

    drawLabels(ctx);
}

function drawArrow(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size / 2);
    ctx.lineTo(-size, size / 2);
    ctx.closePath();
    ctx.fillStyle = GRAPH_CONFIG.axisColor;
    ctx.fill();
    
    ctx.restore();
}

function drawLabels(ctx) {
    ctx.fillStyle = GRAPH_CONFIG.axisColor;
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
	
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;

        const pixelX = mathToPixelX(i);
        const pixelY = mathToPixelY(0);
        ctx.fillText(i.toString(), pixelX, pixelY + 20);

        const pixelX2 = mathToPixelX(0);
        const pixelY2 = mathToPixelY(i);
        ctx.fillText(i.toString(), pixelX2 - 20, pixelY2);
    }
    
    ctx.fillText('0', mathToPixelX(0) - 12, mathToPixelY(0) + 15);
    ctx.fillText('X', GRAPH_CONFIG.width - GRAPH_CONFIG.padding + 25, mathToPixelY(0));
    ctx.fillText('Y', mathToPixelX(0), GRAPH_CONFIG.padding - 25);
}

function drawArea(ctx, r) {
    const radius = parseFloat(r);
    const areaColor = RADIUS_COLORS[r] || RADIUS_COLORS['1'];
    
    ctx.fillStyle = areaColor;
    ctx.strokeStyle = areaColor.replace('0.3', '0.7');
    ctx.lineWidth = 2;
    
    const centerX = mathToPixelX(0);
    const centerY = mathToPixelY(0);
    const scale = calculateScale();
    
    const rectStartX = mathToPixelX(-radius/2);
    const rectEndY = mathToPixelY(radius);
    ctx.beginPath();
    ctx.rect(rectStartX, centerY, centerX - rectStartX, rectEndY - centerY);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(mathToPixelX(-radius/2), centerY);
    ctx.lineTo(centerX, mathToPixelY(-radius));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

	const radiusPixels = radius * scale;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radiusPixels, 0, Math.PI / 2, false);
	ctx.lineTo(centerX, centerY);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();}

function showMessage(message, type) {
    const color = type === 'error' ? '#c88a8a' : '#88c8a8';
    const div = document.createElement('div');
    div.style.cssText = `position:fixed; top:20px; right:20px; background:${color}; color:#1a181a; padding:12px; border-radius:8px; z-index:1000; font-weight:bold;`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

window.addEventListener('resize', function() {
    setTimeout(redrawGraph, 100);
});