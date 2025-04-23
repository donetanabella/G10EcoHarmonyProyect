document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Obtener usuarios registrados desde localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', email); // Guardar usuario logueado
        window.location.href = 'ticketForm.html'; // Redirigir a la página de compra
    } else {
        document.getElementById('loginMessage').textContent = 'Credenciales inválidas. Intente nuevamente.';
        document.getElementById('loginMessage').style.color = 'red';
    }
});
