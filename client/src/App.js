import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CadastroClientePage from './pages/CadastroClientePage';
import ClientesListPage from './pages/ClientListPage';
import EditarCliente from './pages/EditarCliente';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<CadastroClientePage />} />
        <Route path="/editar/:id" element={<EditarCliente />} />
        <Route path="*" element={<ClientesListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
