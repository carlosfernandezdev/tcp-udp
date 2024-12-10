import { useState } from 'react';

function App() {
  const [protocol, setProtocol] = useState('tcp'); // Selección del protocolo
  const [message, setMessage] = useState(''); // Mensaje a enviar
  const [response, setResponse] = useState(''); // Respuesta del servidor

  const handleSend = async () => {
    // Cambiar URL según el protocolo seleccionado
    const url = protocol === 'tcp' 
      ? 'http://192.168.0.102:5000/send-message' // Endpoint para TCP
      : 'http://192.168.0.102:5001/send-message'; // Endpoint para UDP (asegúrate de configurar este)

    try {
      // Realiza la solicitud POST al servidor
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }), // Enviar mensaje como JSON
      });
      
      // Obtén la respuesta del servidor
      const data = await res.text();
      setResponse(data); // Actualizar el estado con la respuesta
    } catch (error) {
      setResponse('Error al conectar con el servidor: ' + error.message); // Manejar errores
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cliente TCP/UDP</h1>
      {/* Selección del protocolo */}
      <label>
        Protocolo:
        <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
          <option value="tcp">TCP</option>
          <option value="udp">UDP</option>
        </select>
      </label>
      <br />
      {/* Entrada del mensaje */}
      <label>
        Mensaje:
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje"
        />
      </label>
      <br />
      {/* Botón para enviar el mensaje */}
      <button onClick={handleSend}>Enviar</button>
      {/* Mostrar la respuesta del servidor */}
      <h2>Respuesta del servidor:</h2>
      <p>{response}</p>
    </div>
  );
}

export default App;
