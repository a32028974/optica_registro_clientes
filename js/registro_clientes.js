document.getElementById('cliente-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('https://script.google.com/macros/s/AKfycbzk__nF-u4hOwlFbCffEMy3QeIn0JnX4i4BCIcR_NChPPg6EjPj9f_GVR_HpHfzvabn/exec'), {
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
