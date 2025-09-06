'use client';

import { useState } from 'react';

export default function Home() {
  const [cep, setCep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const buscar = async () => {
    setError('');
    setResult(null);
    const res = await fetch(`/api/cep?cep=${cep}`);
    if (!res.ok) {
      setError('CEP não encontrado!');
      return;
    }
    const data = await res.json();
    setResult(data);
  };

  return (
    <main style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
      <h1>Consulta de CEP</h1>
      <input
        type="text"
        value={cep}
        onChange={e => setCep(e.target.value)}
        placeholder="Digite o CEP"
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <button onClick={buscar} style={{ width: '100%', padding: 8 }}>
        Buscar
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <strong>Endereço:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
