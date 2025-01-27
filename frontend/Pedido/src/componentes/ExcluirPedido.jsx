// ExcluirPedido.js
import React from 'react';
import axios from 'axios';

const ExcluirPedido = ({ pedidoId, onExcluir }) => {
  const handleDelete = async () => {
    if (window.confirm("Você tem certeza que deseja excluir este pedido?")) {
      try {
        // Enviando a requisição DELETE para o endpoint da API
        const response = await axios.delete(`http://localhost:5006/api/pedido/${pedidoId}`);

        // Verifica se a exclusão foi bem-sucedida
        if (response.status === 200) {
          // Chama a função onExcluir do componente pai para atualizar a lista de pedidos
          onExcluir(pedidoId);
        }
      } catch (error) {
        console.error("Erro ao excluir o pedido:", error);
        alert("Erro ao excluir o pedido.");
      }
    }
  };

  return (
    <button onClick={handleDelete} className="btn-delete">
      <i className="fas fa-trash"></i> Excluir
    </button>
  );
};

export default ExcluirPedido;
