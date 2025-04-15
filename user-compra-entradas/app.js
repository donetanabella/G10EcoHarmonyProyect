document.getElementById('ticketCount').addEventListener('input', function () {
    const ticketCount = parseInt(this.value, 10);
    const visitorContainer = document.getElementById('visitorDetailsContainer');

    // Limpiar contenedor para evitar duplicados
    visitorContainer.innerHTML = '';

    // Verificar si la cantidad ingresada es válida
    if (ticketCount > 0 && ticketCount <= 10) {
        for (let i = 1; i <= ticketCount; i++) {
            const visitorDiv = document.createElement('div');
            visitorDiv.classList.add('visitor-info');

            // Campo para Nombre
            const nameLabel = document.createElement('label');
            nameLabel.textContent = `Nombre del visitante ${i}:`;
            nameLabel.setAttribute('for', `visitorName${i}`);

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = `visitorName${i}`;
            nameInput.name = `visitorName${i}`;
            nameInput.required = true;

            // Campo para Apellido
            const lastNameLabel = document.createElement('label');
            lastNameLabel.textContent = `Apellido del visitante ${i}:`;
            lastNameLabel.setAttribute('for', `visitorLastName${i}`);

            const lastNameInput = document.createElement('input');
            lastNameInput.type = 'text';
            lastNameInput.id = `visitorLastName${i}`;
            lastNameInput.name = `visitorLastName${i}`;
            lastNameInput.required = true;

            // Campo para Edad
            const ageLabel = document.createElement('label');
            ageLabel.textContent = `Edad del visitante ${i}:`;
            ageLabel.setAttribute('for', `visitorAge${i}`);

            const ageInput = document.createElement('input');
            ageInput.type = 'number';
            ageInput.id = `visitorAge${i}`;
            ageInput.name = `visitorAge${i}`;
            ageInput.min = 0;
            ageInput.required = true;

            // Agregar los campos al contenedor
            visitorDiv.appendChild(nameLabel);
            visitorDiv.appendChild(nameInput);
            visitorDiv.appendChild(lastNameLabel);
            visitorDiv.appendChild(lastNameInput);
            visitorDiv.appendChild(ageLabel);
            visitorDiv.appendChild(ageInput);

            visitorContainer.appendChild(visitorDiv);
        }
    }
});

document.getElementById('ticketForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const visitDate = document.getElementById('visitDate').value;
    const ticketCount = document.getElementById('ticketCount').value;
    const passType = document.getElementById('passType').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const visitorDetails = [];
    for (let i = 1; i <= ticketCount; i++) {
        const name = document.getElementById(`visitorName${i}`).value;
        const lastName = document.getElementById(`visitorLastName${i}`).value;
        const age = document.getElementById(`visitorAge${i}`).value;

        visitorDetails.push({ name, lastName, age });
    }

    // Validación básica
    if (!visitDate || !ticketCount || !passType || !paymentMethod || visitorDetails.some(visitor => !visitor.name || !visitor.lastName || !visitor.age)) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if (ticketCount > 10) {
        alert('No puedes comprar más de 10 entradas.');
        return;
    }

    // Crear objeto con los datos de la confirmación
    const confirmationData = {
        visitDate,
        ticketCount,
        passType,
        paymentMethod,
        visitorDetails
    };

    // Guardar los datos en localStorage para pasarlos a la nueva página
    localStorage.setItem('confirmationData', JSON.stringify(confirmationData));

    // Redirigir a la nueva página
    window.location.href = 'confirmation.html';
});


// Establecer fecha mínima en el calendario
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses en formato 01-12
    const day = String(today.getDate()).padStart(2, '0'); // Días en formato 01-31
    const minDate = `${year}-${month}-${day}`;
    document.getElementById('visitDate').setAttribute('min', minDate);
});

// Fechas prohibidas (feriados o días cerrados del parque)
const closedDates = [
    '2025-01-01', // Año Nuevo
    '2025-05-01', // Día del Trabajador
    '2025-12-25', // Navidad
    '2025-07-09', // Día de la Independencia
    // Agrega más fechas según sea necesario
];

// Validación al seleccionar fecha
document.getElementById('visitDate').addEventListener('change', function () {
    const selectedDate = this.value;

    // Comprobar si la fecha seleccionada está en la lista de fechas prohibidas
    if (closedDates.includes(selectedDate)) {
        alert('La fecha ingresada es feriado o el parque se encuentra cerrado');
        this.value = ''; // Limpia el campo de fecha para que el usuario elija otra
    }
});

document.getElementById('ticketCount').addEventListener('input', updateVisitorFields);
document.getElementById('passType').addEventListener('change', calculateTotalPrice);
document.getElementById('visitorDetailsContainer').addEventListener('input', calculateTotalPrice);

// Generación dinámica de los campos de visitantes
function updateVisitorFields() {
    const ticketCount = parseInt(document.getElementById('ticketCount').value, 10) || 0;
    const visitorContainer = document.getElementById('visitorDetailsContainer');

    // Limpiar el contenedor
    visitorContainer.innerHTML = '';

    // Crear los campos dinámicos si la cantidad es válida
    if (ticketCount > 0 && ticketCount <= 10) {
        for (let i = 1; i <= ticketCount; i++) {
            const visitorDiv = document.createElement('div');
            visitorDiv.classList.add('visitor-info');

            // Campos para nombre, apellido y edad
            visitorDiv.innerHTML = `
                <label for="visitorName${i}">Nombre del visitante ${i}:</label>
                <input type="text" id="visitorName${i}" name="visitorName${i}" required>

                <label for="visitorLastName${i}">Apellido del visitante ${i}:</label>
                <input type="text" id="visitorLastName${i}" name="visitorLastName${i}" required>

                <label for="visitorAge${i}">Edad del visitante ${i}:</label>
                <input type="number" id="visitorAge${i}" name="visitorAge${i}" min="0" required>
            `;

            visitorContainer.appendChild(visitorDiv);
        }
    }
}

function calculateTotalPrice() {
    const ticketCount = parseInt(document.getElementById('ticketCount').value, 10) || 0;
    const passType = document.getElementById('passType').value;
    let totalPrice = 0;
    let allFieldsComplete = true;

    for (let i = 1; i <= ticketCount; i++) {
        const ageInput = document.getElementById(`visitorAge${i}`);
        const nameInput = document.getElementById(`visitorName${i}`);
        const lastNameInput = document.getElementById(`visitorLastName${i}`);

        if (!ageInput || !nameInput || !lastNameInput || !ageInput.value || !nameInput.value || !lastNameInput.value) {
            allFieldsComplete = false;
            break;
        }

        const age = parseInt(ageInput.value, 10) || 0;

        // Lógica de precios
        if (passType === 'vip') {
            totalPrice += age < 12 ? 1000 : 1500;
        } else if (passType === 'regular') {
            totalPrice += age < 12 ? 700 : 1000;
        }
    }

    // Mostrar el precio total solo si todos los campos están completos
    const totalPriceContainer = document.getElementById('totalPriceContainer');
    if (allFieldsComplete && ticketCount > 0) {
        document.getElementById('totalPrice').textContent = totalPrice;
        totalPriceContainer.style.display = 'block'; // Mostrar el contenedor
    } else {
        totalPriceContainer.style.display = 'none'; // Ocultar el contenedor si falta información
    }
}

// Eventos que recalculan y validan el precio total
document.getElementById('ticketCount').addEventListener('input', calculateTotalPrice);
document.getElementById('passType').addEventListener('change', calculateTotalPrice);
document.getElementById('visitorDetailsContainer').addEventListener('input', calculateTotalPrice);

// Validación de caracteres alfabéticos
function validateAlphabetic(input) {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/; // Permite letras, espacios y caracteres especiales como tildes y ñ
    return regex.test(input);
}

// Agregar eventos de validación a los campos de nombre y apellido
document.getElementById('visitorDetailsContainer').addEventListener('input', function (e) {
    const target = e.target;

    if (target.id.startsWith('visitorName') || target.id.startsWith('visitorLastName')) {
        if (!validateAlphabetic(target.value)) {
            alert('Solo se permiten caracteres alfabéticos en los campos de Nombre y Apellido.');
            target.value = ''; // Limpiar el campo si no cumple con la validación
        }
    }
});
