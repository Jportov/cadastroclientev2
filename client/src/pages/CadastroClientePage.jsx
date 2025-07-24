import CadastroForm from '../features/clientes/CadastroForm';

export default function CadastroClientePage() {
  return (
    <div>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '28px',
        color: '#1976d2',
        fontWeight: 700,
        fontSize: 28,
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}>
        Cadastro de Cliente
      </h1>
      <CadastroForm />
    </div>
  );
}

