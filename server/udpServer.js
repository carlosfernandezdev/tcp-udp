const dgram = require('dgram');
const fs = require('fs');

// Configuración del servidor UDP
const server = dgram.createSocket('udp4');

// Manejo de mensajes entrantes
server.on('message', (message, rinfo) => {
  const clientAddress = `${rinfo.address}:${rinfo.port}`;
  console.log(`Mensaje recibido de ${clientAddress}: ${message}`);

  // Guardar mensaje en connections.txt
  const logMessage = `Mensaje desde ${clientAddress}: ${message} - ${new Date().toISOString()}\n`;
  fs.appendFileSync('connections.txt', logMessage);

  // Enviar respuesta al cliente
  const response = `Mensaje recibido: ${message}`;
  server.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(`Error al responder a ${clientAddress}: ${err.message}`);
    }
  });
});

// Inicia el servidor en el puerto 5000
server.bind(5000, () => {
  console.log('Servidor UDP escuchando en el puerto 5000');
});
