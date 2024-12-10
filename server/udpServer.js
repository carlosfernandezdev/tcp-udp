const dgram = require('dgram');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON

// Crear el servidor UDP
const udpServer = dgram.createSocket('udp4');

// Manejo de mensajes UDP entrantes
udpServer.on('message', (message, rinfo) => {
  const clientAddress = rinfo.address;
  const protocol = 'UDP';
  const receivedMessage = message.toString().trim();

  console.log(`Mensaje recibido de ${clientAddress}: ${receivedMessage}`);

  // Guardar mensaje en el archivo connections.txt
  const logMessage = `MENSAJE DESDE "${clientAddress}" POR "${protocol}": "${receivedMessage}" y ${new Date().toISOString()}\n`;
  fs.appendFileSync('connections.txt', logMessage);

  // Responder al cliente UDP
  const response = `Mensaje recibido: ${receivedMessage}`;
  udpServer.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(`Error al responder a ${clientAddress}: ${err.message}`);
    } else {
      console.log(`Respuesta enviada a ${clientAddress}`);
    }
  });
});

// Inicia el servidor UDP en el puerto 5001
udpServer.bind(5001, () => {
  console.log('Servidor UDP escuchando en el puerto 5001');
});

// Endpoint HTTP para enviar mensajes al servidor UDP
app.post('/send-message', (req, res) => {
  const { message } = req.body;

  // Configurar cliente UDP
  const udpClient = dgram.createSocket('udp4');
  const udpPort = 5001; // Puerto del servidor UDP
  const udpHost = '127.0.0.1'; // Dirección del servidor UDP

  // Enviar mensaje al servidor UDP
  udpClient.send(message, udpPort, udpHost, (err) => {
    if (err) {
      console.error('Error al enviar mensaje al servidor UDP:', err.message);
      res.status(500).send('Error al conectar con el servidor UDP');
      udpClient.close();
    } else {
      console.log(`Mensaje enviado al servidor UDP: ${message}`);
    }
  });

  // Manejar respuesta del servidor UDP
  udpClient.on('message', (response) => {
    console.log(`Respuesta del servidor UDP: ${response}`);
    res.send(`Respuesta del servidor UDP: ${response}`);
    udpClient.close(); // Cierra el cliente UDP después de recibir la respuesta
  });

  udpClient.on('error', (err) => {
    console.error('Error en el cliente UDP:', err.message);
    res.status(500).send('Error en el cliente UDP');
    udpClient.close();
  });
});

// Inicia el servidor HTTP en el puerto 5002
app.listen(5002, () => {
  console.log('Servidor HTTP para UDP escuchando en el puerto 5002');
});
