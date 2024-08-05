document.getElementById('consulta-pedido-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const numeroBoleta = document.getElementById('numeroBoleta').value.trim();
    const apellidoInput = document.getElementById('apellido').value.trim().toLowerCase();
  
    if (!numeroBoleta || !apellidoInput) {
        alert('Por favor, ingrese tanto el número de boleta como el apellido.');
        return;
    }
  
    const firstSheetUrl = 'https://docs.google.com/spreadsheets/d/16c9YRKbYGE1pjSx_IfVG3qb3TXvPbg3SrbrWU7PTSNs/export?format=csv&gid=0';
    const secondSheetUrl = 'https://docs.google.com/spreadsheets/d/16c9YRKbYGE1pjSx_IfVG3qb3TXvPbg3SrbrWU7PTSNs/export?format=csv&gid=1757413456';
  
    const palabrasClave = ["novar", "multifocal", "ocupacional", "hoya", "vitolen", "myolens", "ailens", "view", "evolution", "precisa", "transitions", "elife", "crizal", "prevencia", "varilux", "office", "spectrum"]; // Ejemplo de palabras clave
  
    function fetchSheetData(sheetUrl) {
        return fetch(sheetUrl)
            .then(response => response.text())
            .then(data => data.split('\n').slice(1).map(row => row.split(',')));
    }
  
    function buscarEnSheet(rows, numeroBoleta, apellidoInput) {
        let pedidoEncontrado = false;
        const inputWords = apellidoInput.split(' ');
  
        rows.forEach(row => {
            const fechaValor = row[1].trim(); // Columna B para la fecha
            const numero = row[2].trim().toLowerCase(); // Columna C para el número de boleta
            const apellidoCliente = row[4].trim().toLowerCase(); // Columna E para el apellido
            const tipoCristales = row[5].trim().toLowerCase(); // Columna F para el tipo de cristales
            const estado = row[0].trim().toLowerCase(); // Columna A para el estado
  
            const apellidoClienteWords = apellidoCliente.split(' ');
  
            if (numero === numeroBoleta) {
                const anyWordMatch = inputWords.some(inputWord =>
                    apellidoClienteWords.some(clienteWord => clienteWord.includes(inputWord))
                );
  
                if (anyWordMatch) {
                    pedidoEncontrado = true;
                    let estadoMensaje = '';
  
                    switch (estado.toLowerCase()) {
                        case 'listo':
                            estadoMensaje = 'El anteojo está listo para retirar en la óptica.';
                            break;
                        case 'problema':
                            estadoMensaje = 'Tuvo un reproceso, va a tardar más de lo esperado, pero estamos trabajando para solucionarlo.';
                            break;
                        case 'cristales':
                            estadoMensaje = 'Cristales terminados. Nos comunicaremos para que deje el armazón el menor tiempo posible.';
                            break;
                        default:
                            estadoMensaje = 'Ingresado y en proceso.';
                            break;
                    }
  
                    const apellidoFormatted = apellidoClienteWords.map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ');
  
                    let avisoEspecial = '';
                    if (palabrasClave.some(palabra => tipoCristales.includes(palabra.toLowerCase()))) {
                        avisoEspecial = '¡Con la captura de esta pantalla, tiene un limpia cristales de 60ml de regalo cuando retira el anteojo!';
                    }
  
                    document.getElementById('estadoPedido').innerHTML = `
                        <strong>Fecha de Encargo:</strong> ${fechaValor}<br>
                        <strong>Número de Trabajo:</strong> ${numero}<br>
                        <strong>Apellido:</strong> ${apellidoFormatted}<br>
                        <strong>Tipo de Cristales:</strong> ${tipoCristales}<br>
                        <strong>Estado:</strong> ${estadoMensaje}<br>
                    `;
                    document.getElementById('gift-alert').textContent = avisoEspecial;
                    document.getElementById('resultado').style.display = 'block';
                }
            }
        });
  
        return pedidoEncontrado;
    }
  
    fetchSheetData(firstSheetUrl)
        .then(rows => {
            let pedidoEncontrado = buscarEnSheet(rows, numeroBoleta, apellidoInput);
  
            if (!pedidoEncontrado) {
                fetchSheetData(secondSheetUrl)
                    .then(secondRows => {
                        pedidoEncontrado = buscarEnSheet(secondRows, numeroBoleta, apellidoInput);
  
                        if (!pedidoEncontrado) {
                            document.getElementById('estadoPedido').innerHTML = 'No se encontró ningún pedido con los datos proporcionados.';
                            document.getElementById('resultado').style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Error al consultar el Google Sheet (segunda hoja):', error);
                        document.getElementById('estadoPedido').innerHTML = 'Hubo un error al consultar el estado del pedido. Por favor, inténtalo de nuevo más tarde.';
                        document.getElementById('resultado').style.display = 'block';
                    });
            }
        })
        .catch(error => {
            console.error('Error al consultar el Google Sheet (primera hoja):', error);
            document.getElementById('estadoPedido').innerHTML = 'Hubo un error al consultar el estado del pedido. Por favor, inténtalo de nuevo más tarde.';
            document.getElementById('resultado').style.display = 'block';
        });
  });