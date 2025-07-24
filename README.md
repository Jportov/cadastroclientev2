
# Cadastro de Clientes - Projeto Full Stack

Este projeto é um sistema completo de cadastro de clientes, desenvolvido em React (frontend) e Node.js/Express (backend), com persistência de dados em MySQL.

## Descrição do Projeto

O sistema permite:
- Cadastrar clientes com validação de dados (incluindo CPF/CNPJ único).
- Listar todos os clientes cadastrados.
- Editar os dados de um cliente existente.
- Excluir clientes.
- Busca automática de endereço pelo CEP (ViaCEP).
- Interface responsiva e amigável, com feedback visual para erros e sucesso.

### Tecnologias Utilizadas

- **Frontend:** React, React Router, React Hook Form, Yup (validação), CSS-in-JS (inline styles)
- **Backend:** Node.js, Express, MySQL2, dotenv, cors, axios (para consulta de CEP)
- **Banco de Dados:** MySQL

---

## Como rodar o projeto

### Requisitos

- Node.js e npm instalados
- MySQL Server instalado e rodando localmente

### Passos para rodar o projeto

1. **Clone o repositório e instale as dependências do frontend:**
   ```bash
   cd client
   npm install
   ```

2. **Instale as dependências do backend:**
   ```bash
   cd ../server
   npm install
   ```

3. **Configure o banco de dados MySQL:**
   - Crie um banco de dados chamado `cadastro_clientes` (ou o nome definido no arquivo `.env`).
   - Crie a tabela `clientes` com a seguinte estrutura:

   ```sql
   CREATE TABLE clientes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     idUsuario INT,
     DataHoraCadastro DATETIME,
     Codigo VARCHAR(50),
     Nome VARCHAR(255) NOT NULL,
     CPF_CNPJ VARCHAR(20) NOT NULL UNIQUE,
     CEP VARCHAR(8),
     Logradouro VARCHAR(255),
     Endereco VARCHAR(255),
     Numero VARCHAR(20),
     Bairro VARCHAR(100),
     Cidade VARCHAR(100),
     UF VARCHAR(2),
     Complemento VARCHAR(255),
     Telefone VARCHAR(20),
     LimiteCredito DECIMAL(15,2),
     Validade DATE,
     email VARCHAR(255)
   );
   ```

   - Ajuste o usuário, senha e nome do banco no arquivo `server/.env` conforme seu ambiente.

4. **Inicie o backend:**
   ```bash
   cd server
   npm start
   ```

5. **Inicie o frontend:**
   ```bash
   cd ../client
   npm start
   ```

6. **Acesse o sistema em:**  
   [http://localhost:3000](http://localhost:3000)

---

## Estrutura das Pastas

```
cadastroclientes/
├── client/   # Frontend React
│   └── src/
│       ├── features/clientes/   # Componentes de clientes
│       ├── pages/               # Páginas principais
│       └── App.js, index.js     # Entradas do React
├── server/   # Backend Node.js/Express
│   ├── controllers/             # Lógica das rotas
│   ├── routes/                  # Rotas Express
│   ├── services/                # Serviços de acesso ao banco
│   ├── config/                  # Configuração do banco
│   └── index.js                 # Entrada do servidor
└── README.md                    # Este arquivo
```

---

## Observações

- O backend depende do MySQL rodando localmente e da tabela criada corretamente.
- O CPF/CNPJ é validado para não permitir duplicidade.
- O frontend faz validação de todos os campos obrigatórios e mostra mensagens de erro amigáveis.
- O sistema busca endereço automaticamente ao digitar um CEP válido.
- Para dúvidas, consulte o arquivo `.env` e o script de criação da tabela acima.

---

**Demonstração:**  
- Cadastro, edição, exclusão e listagem de clientes.
- Busca de endereço por CEP.
- Validação de dados e mensagens de erro amigáveis.

---
