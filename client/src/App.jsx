import { useState } from 'react';
import './App.css';

function App() {
  const [protocol, setProtocol] = useState('tcp'); // Selección del protocolo
  const [message, setMessage] = useState(''); // Mensaje a enviar
  const [response, setResponse] = useState(''); // Respuesta del servidor

  const handleSend = async () => {
    const url = protocol === 'tcp'
      ? 'http://localhost:5000/send-message' // TCP
      : 'http://localhost:5002/send-message'; // UDP

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }), // Enviar mensaje como JSON
      });
      const data = await res.text();
      setResponse(data); // Mostrar la respuesta en pantalla
    } catch (error) {
      setResponse('Error al conectar con el servidor: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Cliente TCP/UDP</h1>
      <label>Protocolo</label>
      <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
        <option value="TCP">TCP</option>
        <option value="UDP">UDP</option>
      </select>

      <label>Mensaje</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje"
      ></textarea>

      <button onClick={handleSend}>Enviar</button>

      <label>Respuesta del Servidor</label>
      <textarea
        value={response}
        readOnly
        placeholder="Aquí se mostrará la respuesta del servidor"
      ></textarea>
    </div>
  );
}

export default App;
