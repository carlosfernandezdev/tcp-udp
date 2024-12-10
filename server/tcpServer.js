const net = require('net');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Configuración del servidor TCP
const tcpServer = net.createServer((socket) => {
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

// Inicia el servidor TCP en el puerto 4000
tcpServer.listen(4000, () => {
  console.log('Servidor TCP escuchando en el puerto 4000');
});

// Configuración del servidor HTTP para interactuar con el cliente web
const app = express();
app.use(cors()); // Habilitar CORS para solicitudes cruzadas
app.use(express.json()); // Parsear datos JSON

// Endpoint para enviar mensajes al servidor TCP
app.post('/send-message', (req, res) => {
  const { message } = req.body;

  // Conectar al servidor TCP como cliente
  const client = new net.Socket();
  client.connect(4000, '127.0.0.1', () => {
    console.log('Conectado al servidor TCP');
    client.write(message);
  });

  // Manejar respuesta del servidor TCP
  client.on('data', (data) => {
    console.log(`Respuesta del servidor TCP: ${data}`);
    res.send(`Respuesta del servidor TCP: ${data}`);
    client.destroy(); // Cierra la conexión después de recibir la respuesta
  });

  // Manejar errores de conexión
  client.on('error', (err) => {
    console.error('Error al conectar con el servidor TCP:', err.message);
    res.status(500).send('Error al conectar con el servidor TCP');
  });
});

// Inicia el servidor HTTP en el puerto 5000
app.listen(5000, () => {
  console.log('Servidor HTTP escuchando en el puerto 5000');
});
