import React, { useState } from 'react';
import axios from 'axios';
import './Cadastro.css';
import { useNavigate, useParams } from "react-router-dom";

const PedidoCadastro = () => {
  const [pedido, setPedido] = useState({
    valor: '',
    nome_produto: '',
    data_vencimento: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({
      ...pedido,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const pedidoEnviado = {
      nome_produto: pedido.nome_produto,
      valor: parseFloat(pedido.valor),  
      data_vencimento: pedido.data_vencimento ? new Date(pedido.data_vencimento).toISOString().split('T')[0] : '', // 
    };
    
    try {
      const response = await axios.post('http://localhost:5006/api/pedido', pedidoEnviado);
      setSuccess(true);
      setError(null);
      setPedido({
        valor: '',
        nome_produto: '',
        data_vencimento: '',
      });
    } catch (error) {
      setError('Erro ao cadastrar o pedido!');
      setSuccess(false);
    }
  };

  const handleCancel = () => {
    // Navega de volta para a página de listagem de pedidos
    navigate("/");
  };

  return (
    <div className="pedido-container">
      <h1>Cadastrar Pedido</h1>

      {success && <p className="pedido-success-message">Pedido cadastrado com sucesso!</p>}
      {error && <p className="pedido-error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="pedido-form-cadastro">
        <div className="pedido-form-group">
          <label htmlFor="valor" className="pedido-label">Valor: </label>
          <input
            type="number"
            id="valor"
            name="valor"
            value={pedido.valor}
            onChange={handleChange}
            required
            className="pedido-input"
          />
        </div>

        <div className="pedido-form-group">
          <label htmlFor="nome_produto" className="pedido-label">Nome do Produto: </label>
          <input
            type="text"
            id="nome_produto"
            name="nome_produto"
            value={pedido.nome_produto}
            onChange={handleChange}
            required
            className="pedido-input"
          />
        </div>

        <div className="pedido-form-group">
          <label htmlFor="data_vencimento" className="pedido-label">Data de Vencimento: </label>
          <input
            type="date"
            id="data_vencimento"
            name="data_vencimento"
            value={pedido.data_vencimento}
            onChange={handleChange}
            required
            className="pedido-input"
          />
        </div>

        <button type="submit" className="pedido-button">Cadastrar Pedido</button>
        <button type="button" className="" onClick={handleCancel}>Inicio</button>
      </form>
    </div>
  );
};

export default PedidoCadastro;
