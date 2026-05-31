const fakeUser = {
    email: 'juan.perez@ejemplo.com',
    password: 'quechua123',
    name: 'Juan Pérez'
};

function getAuthUser() {
    const userData = localStorage.getItem('qa_user');
    return userData ? JSON.parse(userData) : null;
}

function setAuthUser(user) {
    localStorage.setItem('qa_user', JSON.stringify(user));
}

function clearAuthUser() {
    localStorage.removeItem('qa_user');
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

function showLoginError(message) {
    let alertBox = document.getElementById('login-error');
    if (!alertBox) {
        const form = document.getElementById('login-form');
        alertBox = document.createElement('div');
        alertBox.id = 'login-error';
        alertBox.className = 'alert alert-danger mt-3';
        form.appendChild(alertBox);
    }
    alertBox.textContent = message;
}

function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const activeUser = getAuthUser();
    if (activeUser) {
        redirectToDashboard();
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (email === fakeUser.email && password === fakeUser.password) {
            setAuthUser({
                email: fakeUser.email,
                name: fakeUser.name
            });
            redirectToDashboard();
            return;
        }

        showLoginError('Correo electrónico o contraseña incorrectos.');
    });
}

function handleDashboardAuth() {
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const user = getAuthUser();

    if (!user) {
        if (window.location.pathname.endsWith('dashboard.html')) {
            redirectToLogin();
        }
        return;
    }

    if (usernameDisplay) {
        usernameDisplay.textContent = user.name;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            clearAuthUser();
            redirectToLogin();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    handleLoginForm();
    handleDashboardAuth();
});
