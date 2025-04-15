window.addEventListener('DOMContentLoaded', function () {
    const confirmationData = JSON.parse(localStorage.getItem('confirmationData'));

    if (!confirmationData) {
        document.getElementById('confirmationMessage').innerHTML = `
            <p>No se encontraron datos de confirmación.</p>
        `;
        return;
    }

    const { visitDate, ticketCount, passType, paymentMethod, visitorDetails } = confirmationData;

    const visitorSummary = visitorDetails.map((visitor, index) => `
        Visitante ${index + 1}: ${visitor.name} ${visitor.lastName}, Edad: ${visitor.age}
    `).join('<br>');

    const confirmationMessage = `
        Compra realizada con éxito.<br>
        Fecha de visita: ${visitDate}<br>
        Cantidad de entradas: ${ticketCount}<br>
        Detalles de visitantes:<br>${visitorSummary}<br>
        Tipo de pase: ${passType}<br>
        Forma de pago: ${paymentMethod}
    `;
    document.getElementById('confirmationMessage').innerHTML = confirmationMessage;

    // Limpiar localStorage si quieres que se eliminen los datos al salir de la página
    localStorage.removeItem('confirmationData');
});
