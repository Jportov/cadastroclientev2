import { useEffect, useState } from 'react';

function BuscaClientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const fetchClientes = async (termo) => {
    setLoading(true);
    setErro(null);
    try {
      let url = 'http://localhost:3001/api/v1/clientes/search';
      if (termo && termo.trim() !== '') {
        const params = new URLSearchParams({ termo: termo.trim() });
        url += `?${params.toString()}`;
      }

      const resposta = await fetch(url);
      if (!resposta.ok) throw new Error('Erro ao buscar clientes');

      const data = await resposta.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro(err.message);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes('');
  }, []);

  const handleBusca = (e) => {
    e.preventDefault();
    fetchClientes(busca);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <form onSubmit={handleBusca} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, CPF, cidade, etc."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border px-4 py-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}
      {erro && <p className="text-red-500">Erro: {erro}</p>}

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id} className="mb-2 border-b pb-2">
            <strong>{cliente.Nome}</strong> — {cliente.Cidade} — {cliente.CPF_CNPJ}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BuscaClientes;
