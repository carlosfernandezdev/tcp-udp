import { useState } from 'react';

function App() {
  const [protocol, setProtocol] = useState('tcp');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const url = protocol === 'tcp' ? 'http://localhost:4000' : 'http://localhost:5000';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse('Error al conectar con el servidor, error:  .'+ error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cliente TCP/UDP</h1>
      <label>
        Protocolo:
        <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
          <option value="tcp">TCP</option>
          <option value="udp">UDP</option>
        </select>
      </label>
      <br />
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
      <button onClick={handleSend}>Enviar</button>
      <h2>Respuesta del servidor:</h2>
      <p>{response}</p>
    </div>
  );
}

export default App;
