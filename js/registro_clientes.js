document.getElementById('cliente-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('https://script.google.com/macros/library/d/1uyDRJlHsRMIgV-1M8m8SR3k74IEcPEIe7sW_2OzF8sSymIs6gyqlKTzs/3', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = 'Cliente registrado con éxito';
        document.getElementById('cliente-form').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('status').innerText = 'Hubo un error al registrar el cliente';
    });
});
