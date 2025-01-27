import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PedidoList from './componentes/Listagem';
import EditarPedido from './componentes/EditarPedido';
import PedidoCadastro from './componentes/CadastrarPedido';
import AplicarDesconto from './componentes/AplicarDesconto';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PedidoList />} />
        <Route path="/editar/:id" element={<EditarPedido />} />
        <Route path="/aplicar-desconto/:id" element={<AplicarDesconto />} />
        <Route path="/novo" element={<PedidoCadastro />} />
      </Routes>
    </Router>
  );
};

export default App;
