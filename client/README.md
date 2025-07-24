# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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
