const clientesService = require('../services/clientesService');

exports.getAllClientes = async (req, res) => {
  try {
    // Suporte à busca por nome via query string (?nome=...)
    const nome = req.query.nome;
    if (nome) {
      const clientes = await clientesService.getClientesByNome(nome);
      return res.json(clientes);
    }
    const clientes = await clientesService.getAllClientes();
    res.json(clientes);
  } catch (err) {
    res.status(500).send('Erro ao buscar clientes');
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await clientesService.getClienteById(req.params.id);
    if (!cliente) return res.status(404).send('Cliente não encontrado');
    res.json(cliente);
  } catch (err) {
    res.status(500).send('Erro ao buscar cliente');
  }
};

exports.createCliente = async (req, res) => {
  try {
    const id = await clientesService.createCliente(req.body);
    res.status(201).json({ id });
  } catch (err) {
    if (err.code === 'DUPLICATE_CPF_CNPJ' || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Já existe um cliente com este CPF/CNPJ' });
    }
    res.status(500).send('Erro ao criar cliente');
  }
};

exports.updateCliente = async (req, res) => {
  try {
    await clientesService.updateCliente(req.params.id, req.body);
    res.send('Cliente atualizado com sucesso');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Já existe um cliente com este CPF/CNPJ' });
    }
    res.status(500).send('Erro ao atualizar cliente');
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    await clientesService.deleteCliente(req.params.id);
    res.send('Cliente deletado com sucesso');
  } catch (err) {
    res.status(500).send('Erro ao deletar cliente');
  }
};
