const pool = require('../config/db');

exports.getAllClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM clientes');
  return rows;
};

exports.getClienteById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.createCliente = async (data) => {
  const {
    idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
    Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone, LimiteCredito, Validade, email,
  } = data;
  // Verifica se já existe cliente com o mesmo CPF_CNPJ
  const [existentes] = await pool.query('SELECT id FROM clientes WHERE CPF_CNPJ = ?', [CPF_CNPJ]);
  if (existentes.length > 0) {
    const err = new Error('Já existe um cliente com este CPF/CNPJ');
    err.code = 'DUPLICATE_CPF_CNPJ';
    throw err;
  }
  const validadeFormatada = Validade ? Validade.split('T')[0] : null;
  const sql = `
    INSERT INTO clientes (
      idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
      Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone,
      LimiteCredito, Validade, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
    Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone,
    LimiteCredito, validadeFormatada, email
  ]);
  return result.insertId;
};

exports.updateCliente = async (id, data) => {
  // ...existing code for dynamic update...
  const {
    idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
    Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone, LimiteCredito, Validade, email,
  } = data;
  const fieldsToUpdate = {};
  if (idUsuario !== undefined) fieldsToUpdate.idUsuario = idUsuario;
  if (DataHoraCadastro !== undefined) fieldsToUpdate.DataHoraCadastro = DataHoraCadastro;
  if (Codigo !== undefined) fieldsToUpdate.Codigo = Codigo;
  if (Nome !== undefined) fieldsToUpdate.Nome = Nome;
  if (CPF_CNPJ !== undefined) fieldsToUpdate.CPF_CNPJ = CPF_CNPJ;
  if (CEP !== undefined) fieldsToUpdate.CEP = CEP;
  if (Logradouro !== undefined) fieldsToUpdate.Logradouro = Logradouro;
  if (Endereco !== undefined) fieldsToUpdate.Endereco = Endereco;
  if (Numero !== undefined) fieldsToUpdate.Numero = Numero;
  if (Bairro !== undefined) fieldsToUpdate.Bairro = Bairro;
  if (Cidade !== undefined) fieldsToUpdate.Cidade = Cidade;
  if (UF !== undefined) fieldsToUpdate.UF = UF;
  if (Complemento !== undefined) fieldsToUpdate.Complemento = Complemento;
  if (telefone !== undefined) fieldsToUpdate.telefone = telefone;
  if (LimiteCredito !== undefined) fieldsToUpdate.LimiteCredito = LimiteCredito;
  if (Validade !== undefined) fieldsToUpdate.Validade = Validade.split('T')[0];
  if (email !== undefined) fieldsToUpdate.email = email;

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }
  const setString = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
  const values = Object.values(fieldsToUpdate);
  const sql = `UPDATE clientes SET ${setString} WHERE id = ?`;
  await pool.query(sql, [...values, id]);
};

exports.deleteCliente = async (id) => {
  await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
};

exports.getClientesByNome = async (nome) => {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE Nome LIKE ?', [`%${nome}%`]);
  return rows;
};

exports.getClientesByFiltro = async (filtros) => {
  let query = 'SELECT * FROM clientes WHERE 1=1';
  const params = [];
  if (filtros.Codigo) {
    query += ' AND Codigo LIKE ?';
    params.push(`%${filtros.Codigo}%`);
  }
  if (filtros.Nome) {
    query += ' AND Nome LIKE ?';
    params.push(`%${filtros.Nome}%`);
  }
  if (filtros.Cidade) {
    query += ' AND Cidade LIKE ?';
    params.push(`%${filtros.Cidade}%`);
  }
  if (filtros.CEP) {
    query += ' AND CEP LIKE ?';
    params.push(`%${filtros.CEP}%`);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};
