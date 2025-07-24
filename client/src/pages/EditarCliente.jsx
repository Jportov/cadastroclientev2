import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  Nome: yup.string().required('Nome é obrigatório'),
  CPF_CNPJ: yup.string().required('CPF/CNPJ é obrigatório'),
  CEP: yup.string().required('CEP é obrigatório'),
  Logradouro: yup.string().required('Logradouro é obrigatório'),
  Endereco: yup.string().required('Endereço é obrigatório'),
  Numero: yup.string().required('Número é obrigatório'),
  Bairro: yup.string().required('Bairro é obrigatório'),
  Cidade: yup.string().required('Cidade é obrigatório'),
  UF: yup.string().required('UF é obrigatório').length(2, 'UF deve ter 2 letras'),
  Complemento: yup.string(),
  telefone: yup.string().required('Telefone é obrigatório'),
  LimiteCredito: yup
    .number()
    .typeError('Limite Crédito deve ser número')
    .min(0, 'Limite Crédito não pode ser negativo')
    .required('Limite Crédito é obrigatório'),
  Validade: yup
    .date()
    .typeError('Validade deve ser uma data válida')
    .required('Validade é obrigatória'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
});

const style = {
  container: {
    maxWidth: 520,
    margin: '40px auto',
    padding: '32px 28px 24px 28px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    background: '#fff',
    border: '1px solid #e3e3e3',
    borderRadius: 10,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#1976d2',
    fontWeight: 700,
    fontSize: 26,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: 6,
    color: '#222',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #bdbdbd',
    background: '#fafbfc',
    transition: 'border 0.2s',
    outline: 'none',
  },
  error: {
    color: '#e53935',
    marginTop: 4,
    fontSize: 14,
    fontWeight: 500,
  },
  buttonsWrapper: {
    display: 'flex',
    gap: 10,
    marginTop: 28,
    justifyContent: 'flex-end',
  },
  button: {
    padding: '12px 24px',
    fontSize: 16,
    cursor: 'pointer',
    borderRadius: 6,
    border: 'none',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
    transition: 'background 0.2s, color 0.2s',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#e53935',
    color: '#fff',
  },
};

function Alert({ type = 'info', children, onClose }) {
  const colors = {
    success: { bg: '#e6f4ea', border: '#28a745', color: '#218838' },
    error: { bg: '#fdeaea', border: '#e53935', color: '#b71c1c' },
    info: { bg: '#e3f2fd', border: '#1976d2', color: '#1565c0' },
  };
  const style = {
    background: colors[type].bg,
    border: `1.5px solid ${colors[type].border}`,
    color: colors[type].color,
    borderRadius: 6,
    padding: '12px 18px',
    marginBottom: 18,
    fontWeight: 600,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  };
  return (
    <div style={style}>
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors[type].color,
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            marginLeft: 16,
          }}
          aria-label="Fechar"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function fetchCliente() {
      try {
        const res = await fetch(`http://localhost:3001/api/v1/clientes/${id}`);
        if (!res.ok) throw new Error('Cliente não encontrado');
        const data = await res.json();

        const validadeFormatada = data.Validade ? data.Validade.split('T')[0] : '';
        reset({ ...data, Validade: validadeFormatada });
        setLoading(false);
      } catch (err) {
        setAlert({ type: 'error', msg: err.message });
        setLoading(false);
      }
    }

    fetchCliente();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setAlert(null);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao atualizar cliente');
      }

      setAlert({ type: 'success', msg: 'Cliente atualizado com sucesso!' });
      setTimeout(() => {
        setAlert(null);
        navigate('/');
      }, 1200);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Carregando cliente...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={style.container}>
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.msg}
        </Alert>
      )}
      <h2 style={style.title}>Editar Cliente #{id}</h2>
      {[
        { label: 'Nome', name: 'Nome' },
        { label: 'CPF/CNPJ', name: 'CPF_CNPJ' },
        { label: 'CEP', name: 'CEP' },
        { label: 'Logradouro', name: 'Logradouro' },
        { label: 'Endereço', name: 'Endereco' },
        { label: 'Número', name: 'Numero' },
        { label: 'Bairro', name: 'Bairro' },
        { label: 'Cidade', name: 'Cidade' },
        { label: 'UF', name: 'UF', maxLength: 2 },
        { label: 'Complemento', name: 'Complemento' },
        { label: 'Telefone', name: 'telefone' },
        { label: 'Limite Crédito', name: 'LimiteCredito', type: 'number', step: '0.01' },
        { label: 'Validade', name: 'Validade', type: 'date' },
        { label: 'Email', name: 'email', type: 'email' },
      ].map(({ label, name, type, maxLength, step }) => (
        <div key={name} style={style.field}>
          <label htmlFor={name} style={style.label}>
            {label}:
          </label>
          <input
            id={name}
            type={type || 'text'}
            maxLength={maxLength}
            step={step}
            style={style.input}
            {...register(name)}
          />
          {errors[name] && <p style={style.error}>{errors[name].message}</p>}
        </div>
      ))}
      <div style={style.buttonsWrapper}>
        <button type="submit" style={{ ...style.button, ...style.saveButton }}>
          Salvar
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ ...style.button, ...style.cancelButton }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
