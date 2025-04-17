function sendAlert(event) {
    event.preventDefault();
    const carPlate = document.getElementById('carPlate').value;
    const message = document.getElementById('alertMessage').value || 'Por favor, retire seu veículo. Está bloqueando a saída.';
    
    // Play alert sound
    const audio = document.getElementById('alertSound');
    audio.play();
    
    // Show notification
    alert(`Alerta enviado para o veículo ${carPlate}\nMensagem: ${message}`);
}

function logout() {
    window.location.href = 'index.html';
}