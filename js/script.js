document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    alert('Formulario enviado. Nos pondremos en contacto con usted pronto.');
    event.target.reset();
});

