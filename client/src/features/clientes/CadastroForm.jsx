import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const cpfCnpjRegex = /(^\d{11}$)|(^\d{14}$)/;

const schema = yup.object().shape({
  Nome: yup.string().required('Nome é obrigatório'),
  CPF_CNPJ: yup
    .string()
    .required('CPF/CNPJ é obrigatório')
    .matches(cpfCnpjRegex, 'CPF ou CNPJ inválido'),
  CEP: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  Logradouro: yup.string().required('Logradouro é obrigatório'),
  Endereco: yup.string().required('Endereço é obrigatório'),
  Numero: yup.string().required('Número é obrigatório'),
  Bairro: yup.string().required('Bairro é obrigatório'),
  Cidade: yup.string().required('Cidade é obrigatória'),
  UF: yup.string().required('UF é obrigatória').length(2, 'UF deve ter 2 caracteres'),
  Complemento: yup.string().notRequired(),
  telefone: yup.string().required('Telefone é obrigatório'),
  LimiteCredito: yup
    .number()
    .typeError('Limite de crédito deve ser um número')
    .required('Limite de crédito é obrigatório'),
  Validade: yup
    .date()
    .typeError('Preencha uma data válida no campo Validade')
    .required('Validade é obrigatória'),
});

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

export default function CadastroForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAlert(null);
    try {
      const response = await fetch('http://localhost:3001/api/v1/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let msg = 'Erro desconhecido ao cadastrar';
        try {
          const err = await response.json();
          msg = err.error || msg;
        } catch {
          // Se não for JSON, tenta pegar texto puro
          const text = await response.text();
          if (text) msg = text;
        }
        setAlert({ type: 'error', msg });
        setIsSubmitting(false);
        return;
      }

      setAlert({ type: 'success', msg: 'Cliente cadastrado com sucesso!' });
      reset();
      setTimeout(() => {
        setAlert(null);
        navigate('/clientes');
      }, 1200);
    } catch (error) {
      setAlert({ type: 'error', msg: 'Erro ao cadastrar cliente: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('Logradouro', data.logradouro || '');
          setValue('Bairro', data.bairro || '');
          setValue('Cidade', data.localidade || '');
          setValue('UF', data.uf || '');
          setValue('Complemento', data.complemento || '');
          setAlert({ type: 'success', msg: 'Endereço preenchido pelo CEP!' });
          setTimeout(() => setAlert(null), 1200);
        } else {
          setAlert({ type: 'error', msg: 'CEP não encontrado!' });
        }
      } catch (error) {
        setAlert({ type: 'error', msg: 'Erro ao buscar CEP' });
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '4px',
    borderRadius: 6,
    border: '1px solid #bdbdbd',
    fontSize: 16,
    background: '#fafbfc',
    transition: 'border 0.2s',
    outline: 'none',
  };

  const errorStyle = {
    color: '#e53935',
    marginBottom: '12px',
    fontSize: 14,
    fontWeight: 500,
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: 16,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
    transition: 'background 0.2s, color 0.2s',
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: '#fff',
    marginRight: 10,
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e53935',
    color: '#fff',
  };

  const formStyle = {
    maxWidth: 520,
    margin: '40px auto',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    padding: '32px 28px 24px 28px',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={formStyle}>
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.msg}
        </Alert>
      )}
      <input {...register('Nome')} placeholder="Nome" style={inputStyle} />
      <p style={errorStyle}>{errors.Nome?.message}</p>

      <input {...register('email')} placeholder="Email" style={inputStyle} />
      <p style={errorStyle}>{errors.email?.message}</p>

      <input {...register('CPF_CNPJ')} placeholder="CPF/CNPJ" style={inputStyle} />
      <p style={errorStyle}>{errors.CPF_CNPJ?.message}</p>

      <input {...register('CEP')} placeholder="CEP" onBlur={handleCepChange} style={inputStyle} />
      <p style={errorStyle}>{errors.CEP?.message}</p>

      <input {...register('Logradouro')} placeholder="Logradouro" style={inputStyle} />
      <p style={errorStyle}>{errors.Logradouro?.message}</p>

      <input {...register('Endereco')} placeholder="Endereço" style={inputStyle} />
      <p style={errorStyle}>{errors.Endereco?.message}</p>

      <input {...register('Numero')} placeholder="Número" style={inputStyle} />
      <p style={errorStyle}>{errors.Numero?.message}</p>

      <input {...register('Bairro')} placeholder="Bairro" style={inputStyle} />
      <p style={errorStyle}>{errors.Bairro?.message}</p>

      <input {...register('Cidade')} placeholder="Cidade" style={inputStyle} />
      <p style={errorStyle}>{errors.Cidade?.message}</p>

      <input {...register('UF')} placeholder="UF" maxLength={2} style={inputStyle} />
      <p style={errorStyle}>{errors.UF?.message}</p>

      <input {...register('Complemento')} placeholder="Complemento" style={inputStyle} />
      <p style={errorStyle}>{errors.Complemento?.message}</p>

      <input {...register('telefone')} placeholder="Telefone" style={inputStyle} />
      <p style={errorStyle}>{errors.telefone?.message}</p>

      <input
        {...register('LimiteCredito')}
        type="number"
        step="0.01"
        placeholder="Limite de Crédito"
        style={inputStyle}
      />
      <p style={errorStyle}>{errors.LimiteCredito?.message}</p>

      <input {...register('Validade')} type="date" style={inputStyle} />
      <p style={errorStyle}>{errors.Validade?.message}</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 20 }}>
        <button type="submit" style={submitButtonStyle} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Cadastrar'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/clientes')}
          style={cancelButtonStyle}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
