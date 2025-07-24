require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const clientesRoutes = require('./routes/clientesRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/v1/clientes', clientesRoutes);

app.get('/', (req, res) => {
  res.send('API rodando liso! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

