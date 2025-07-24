const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Buscar todos os clientes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).send('Erro ao buscar clientes');
  }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Cliente não encontrado');
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar cliente:', err);
    res.status(500).send('Erro ao buscar cliente');
  }
});

// Criar novo cliente
router.post('/', async (req, res) => {
  try {
    const {
      idUsuario,
      DataHoraCadastro,
      Codigo,
      Nome,
      CPF_CNPJ,
      CEP,
      Logradouro,
      Endereco,
      Numero,
      Bairro,
      Cidade,
      UF,
      Complemento,
      telefone,
      LimiteCredito,
      Validade,
      email,
    } = req.body;

    const validadeFormatada = Validade ? Validade.split('T')[0] : null;

    const sql = `
      INSERT INTO clientes (
        idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
        Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone,
        LimiteCredito, Validade, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [existentes] = await pool.query('SELECT id FROM clientes WHERE CPF_CNPJ = ?', [CPF_CNPJ]);
    if (existentes.length > 0) {
      return res.status(400).json({ error: 'Já existe um cliente com este CPF/CNPJ' });
    }

    const [result] = await pool.query(sql, [
      idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP, Logradouro,
      Endereco, Numero, Bairro, Cidade, UF, Complemento, telefone,
      LimiteCredito, validadeFormatada, email
    ]);

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Atualizar cliente - Atualização parcial com query dinâmica
router.put('/:id', async (req, res) => {
  try {
    const {
      idUsuario,
      DataHoraCadastro,
      Codigo,
      Nome,
      CPF_CNPJ,
      CEP,
      Logradouro,
      Endereco,
      Numero,
      Bairro,
      Cidade,
      UF,
      Complemento,
      telefone,
      LimiteCredito,
      Validade,
      email,
    } = req.body;

    // Monta objeto com campos enviados
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
      return res.status(400).send('Nenhum campo para atualizar');
    }

    // Monta a query dinamicamente
    const setString = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
    const values = Object.values(fieldsToUpdate);

    const sql = `UPDATE clientes SET ${setString} WHERE id = ?`;

    await pool.query(sql, [...values, req.params.id]);

    res.send('Cliente atualizado com sucesso');
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).send('Erro ao atualizar cliente');
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.send('Cliente deletado com sucesso');
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).send('Erro ao deletar cliente');
  }
});

module.exports = router;
