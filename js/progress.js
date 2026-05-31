// Lógica de la página de progreso
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    generateActivityCalendar();
    setupPeriodButtons();
});

function initCharts() {
    // Gráfico de progreso por lección
    const ctx1 = document.getElementById('lessonsChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'],
            datasets: [{
                label: 'Puntaje (%)',
                data: [100, 95, 85, 80, 75, 65, 60, 0, 0, 0],
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfico de habilidades
    const ctx2 = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Vocabulario', 'Pronunciación', 'Gramática', 'Comprensión', 'Cultura'],
            datasets: [{
                data: [85, 65, 70, 75, 60],
                backgroundColor: ['#2E7D32', '#FF8F00', '#17a2b8', '#007bff', '#6c757d'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function generateActivityCalendar() {
    const calendarContainer = document.getElementById('activityCalendar');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Días de la semana
    const weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    let html = weekdays.map(day => `<div class="col text-center fw-bold small">${day}</div>`).join('');
    
    // Días del mes
    const startDay = startOfMonth.getDay();
    let currentDay = 1;
    
    for (let i = 0; i < 42; i++) {
        if (i < startDay || currentDay > endOfMonth.getDate()) {
            html += `<div class="col text-center p-1"></div>`;
        } else {
            const isActive = (currentDay <= 7); // Simular días activos
            const isCompleted = (currentDay <= 5); // Simular días completados
            html += `
                <div class="col text-center p-1">
                    <div class="calendar-day ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                        ${currentDay}
                    </div>
                </div>
            `;
            currentDay++;
        }
    }
    
    calendarContainer.innerHTML = '<div class="row g-1">' + html + '</div>';
}

function setupPeriodButtons() {
    const buttons = document.querySelectorAll('[data-period]');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.period;
            updateDataForPeriod(period);
        });
    });
}

function updateDataForPeriod(period) {
    console.log(`Actualizando datos para período: ${period}`);
    // Aquí se actualizarían los gráficos con datos según el período seleccionado
    // Por simplicidad, mostramos una notificación
    showToast(`Mostrando datos de ${period === 'week' ? 'la semana' : period === 'month' ? 'el mes' : 'todo el período'}`);
}

function showToast(message) {
    // Crear toast temporal
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Quechua Ayni</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}