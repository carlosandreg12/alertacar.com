// Store users data (in a real application, this should be in a database)
let users = [];

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Add these new functions to your existing script.js
function toggleRecoveryForm() {
    const loginForm = document.getElementById('loginForm');
    const recoveryForm = document.getElementById('recoveryForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('hidden');
    recoveryForm.classList.toggle('hidden');
    registerForm.classList.add('hidden');
}

function handleRecovery(event) {
    event.preventDefault();
    const email = document.getElementById('recoveryEmail').value;
    
    const user = users.find(u => u.email === email);
    if (user) {
        // In a real application, this would send an email
        alert(`Senha recuperada com sucesso!\nSua senha é: ${user.password}`);
        toggleRecoveryForm(); // Return to login form
    } else {
        alert('Email não encontrado no sistema.');
    }
}

// Update your existing handleLogin function to store user data in localStorage
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Check localStorage for existing users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(u => u.email === email && u.password === password);

    if (user) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Email ou senha incorretos!');
    }
}

// Update your existing handleRegister function to store data in localStorage
function handleRegister(event) {
    event.preventDefault();
    
    const password = document.getElementById('regPassword').value;

    // Validate password (only numbers, length 4-6)
    if (!/^\d{4,6}$/.test(password)) {
        alert('A senha deve conter apenas números e ter entre 4 a 6 dígitos!');
        return;
    }

    const newUser = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: password,
        phone: document.getElementById('regPhone').value,
        isAdmin: false, // By default, new users are not administrators
        car: {
            plate: document.getElementById('regPlate').value,
            model: document.getElementById('regModel').value,
            color: document.getElementById('regColor').value,
            state: document.getElementById('regState').value
        }
    };

    // Get existing users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (storedUsers.some(u => u.email === newUser.email)) {
        alert('Este email já está cadastrado!');
        return;
    }

    // Add new user and save to localStorage
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    alert('Cadastro realizado com sucesso!');
    toggleForms();
}

// Add this to verify the states are loading
// Add this function to create an initial admin user
function createInitialAdmin() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if admin already exists
    const adminExists = storedUsers.some(user => user.isAdmin);
    
    if (!adminExists) {
        const adminUser = {
            name: 'Administrator',
            email: 'admin@alertacar.com',
            password: 'admin123',
            phone: '0000000000',
            isAdmin: true,
            car: {
                plate: '',
                model: '',
                color: '',
                state: ''
            }
        };
        
        storedUsers.push(adminUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));
    }
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    const stateSelect = document.getElementById('regState');
    if (stateSelect) {
        console.log('Estados carregados:', stateSelect.options.length);
    }
    createInitialAdmin(); // Create admin user if it doesn't exist
});

// Remove the entire resetAllUsers function
function resetAllUsers() {
    // Create a custom dialog box with an icon
    const result = confirm(`
        🗑️ Resetar Todos os Usuários

        Você precisará fornecer as credenciais de administrador para continuar.
    `);

    if (!result) return;

    const adminEmail = prompt('Digite o email do administrador:');
    const adminPassword = prompt('Digite a senha do administrador:');

    // Check localStorage for admin credentials
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isAdmin = storedUsers.find(u => u.email === adminEmail && 
                                        u.password === adminPassword && 
                                        u.isAdmin === true);

    if (!isAdmin) {
        alert('Credenciais de administrador inválidas!');
        return;
    }

    if (confirm('🗑️ Tem certeza que deseja resetar todos os usuários? Esta ação não pode ser desfeita.')) {
        localStorage.clear();
        alert('🗑️ Todos os usuários foram removidos com sucesso!');
        window.location.reload();
    }
}

function togglePasswordVisibility(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}


function showControlPanel() {
    document.getElementById('controlPanel').classList.remove('hidden');
    loadAlerts();
}

function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    const dbRef = ref(database, 'alerts');
    
    onValue(dbRef, (snapshot) => {
        alertsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const alert = childSnapshot.val();
            const alertElement = createAlertElement(alert);
            alertsList.appendChild(alertElement);
        });
    });
}

function createAlertElement(alert) {
    const div = document.createElement('div');
    div.className = 'alert-item';
    div.innerHTML = `
        <h4>Alerta de Veículo</h4>
        <p>Placa: ${alert.plate}</p>
        <p>Modelo: ${alert.model}</p>
        <p>Cor: ${alert.color}</p>
        <p>Local: ${alert.location}</p>
        <p>Data: ${new Date(alert.timestamp).toLocaleString()}</p>
    `;
    return div;
}