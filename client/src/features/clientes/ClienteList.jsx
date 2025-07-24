import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState({
    Codigo: '',
    Nome: '',
    Cidade: '',
    CEP: ''
  });

  const fetchClientes = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:3001/api/v1/clientes';
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.trim() !== '') searchParams.append(key, value);
      });
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar clientes');
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const handleBusca = (e) => {
    e.preventDefault();
    fetchClientes(filtro);
  };

  const handleLimpar = () => {
    setFiltro({ Codigo: '', Nome: '', Cidade: '', CEP: '' });
    fetchClientes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/clientes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao deletar cliente');
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p style={{ fontFamily: 'sans-serif' }}>Carregando clientes...</p>;
  if (error) return <p style={{ color: 'red', fontFamily: 'sans-serif' }}>Erro: {error}</p>;

  return (
    <div style={{
      padding: '32px',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: '#f7f9fa',
      minHeight: '100vh'
    }}>
      <h2 style={{
        marginBottom: '18px',
        fontWeight: 700,
        fontSize: 28,
        color: '#1976d2',
        textAlign: 'center'
      }}>Lista de Clientes</h2>

      <form
        onSubmit={handleBusca}
        style={{
          marginBottom: 18,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <input
          name="Codigo"
          value={filtro.Codigo}
          onChange={handleFiltroChange}
          placeholder="Código"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 90 }}
        />
        <input
          name="Nome"
          value={filtro.Nome}
          onChange={handleFiltroChange}
          placeholder="Nome"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
        />
        <input
          name="Cidade"
          value={filtro.Cidade}
          onChange={handleFiltroChange}
          placeholder="Cidade"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
        />
        <input
          name="CEP"
          value={filtro.CEP}
          onChange={handleFiltroChange}
          placeholder="CEP"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 90 }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 18px',
            borderRadius: 4,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleLimpar}
          style={{
            padding: '8px 14px',
            borderRadius: 4,
            border: 'none',
            background: '#e53935',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Limpar
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <Link to="/cadastro">
          <button
            style={{
              padding: '10px 18px',
              fontSize: 16,
              cursor: 'pointer',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
              transition: 'background 0.2s'
            }}
          >
            Novo Cliente
          </button>
        </Link>
      </div>
      {clientes.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ color: '#888', fontSize: 18 }}>Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          padding: 18
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1000px',
            fontSize: 15
          }}>
            <thead>
              <tr>
                { [
                  'ID', 'Nome', 'CPF/CNPJ', 'CEP', 'Logradouro', 'Endereço', 'Número', 'Bairro',
                  'Cidade', 'UF', 'Complemento', 'Telefone', 'Limite Crédito', 'Validade', 'Email', 'Ações'
                ].map((header) => (
                  <th key={header} style={{
                    textAlign: 'left',
                    padding: '10px 8px',
                    borderBottom: '2px solid #1976d2',
                    background: '#f1f6fb',
                    color: '#1976d2',
                    fontWeight: 700
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} style={{ background: '#fff', borderRadius: 8 }}>
                  <td style={tdStyle}>{cliente.id}</td>
                  <td style={tdStyle}>{cliente.Nome}</td>
                  <td style={tdStyle}>{cliente.CPF_CNPJ}</td>
                  <td style={tdStyle}>{cliente.CEP}</td>
                  <td style={tdStyle}>{cliente.Logradouro}</td>
                  <td style={tdStyle}>{cliente.Endereco}</td>
                  <td style={tdStyle}>{cliente.Numero}</td>
                  <td style={tdStyle}>{cliente.Bairro}</td>
                  <td style={tdStyle}>{cliente.Cidade}</td>
                  <td style={tdStyle}>{cliente.UF}</td>
                  <td style={tdStyle}>{cliente.Complemento}</td>
                  <td style={tdStyle}>{cliente.telefone}</td>
                  <td style={tdStyle}>{cliente.LimiteCredito}</td>
                  <td style={tdStyle}>{cliente.Validade ? cliente.Validade.split('T')[0] : ''}</td>
                  <td style={tdStyle}>{cliente.email}</td>
                  <td style={tdStyle}>
                    <Link to={`/editar/${cliente.id}`}>
                      <button style={btnStyle}>Editar</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      style={{ ...btnStyle, backgroundColor: '#e53935' }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tdStyle = {
  padding: '8px 6px',
  borderBottom: '1px solid #e3e3e3',
  whiteSpace: 'nowrap',
  color: '#222',
  fontWeight: 500,
};

const btnStyle = {
  padding: '7px 14px',
  marginRight: '6px',
  backgroundColor: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 15,
  boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)',
  transition: 'background 0.2s'
};

