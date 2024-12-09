const net = require('net');
const fs = require('fs');

// Configuración del servidor TCP
const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Cliente conectado: ${clientAddress}`);

  // Log de conexiones
  const log = `Conexión TCP desde ${clientAddress} - ${new Date().toISOString()}\n`;
  fs.appendFileSync('connections.txt', log);

  // Manejo de datos entrantes
  socket.on('data', (data) => {
    console.log(`Mensaje recibido de ${clientAddress}: ${data}`);
    socket.write(`Mensaje recibido: ${data}`);
  });

  // Manejo de desconexión
  socket.on('end', () => {
    console.log(`Cliente desconectado: ${clientAddress}`);
  });
});

// Inicia el servidor en el puerto 4000
server.listen(4000, () => {
  console.log('Servidor TCP escuchando en el puerto 4000');
});
