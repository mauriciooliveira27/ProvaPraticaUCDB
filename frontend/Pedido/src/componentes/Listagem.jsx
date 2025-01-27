import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Importando Link para navegação
import './Listagem.css';

// Função para calcular os dias restantes até o vencimento
const calculateDaysLeft = (dueDate) => {
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  const timeDiff = dueDateObj - currentDate;
  return timeDiff / (1000 * 3600 * 24); // Retorna a diferença em dias
};

// Função para calcular o valor com desconto
const calculateDiscountedValue = (valor, descontoPercent) => {
  return valor - (valor * (descontoPercent / 100));
};

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para pegar os pedidos da API
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:5006/api/pedido');
        setPedidos(response.data);
      } catch (error) {
        setError("Erro ao carregar os pedidos");
      }
    };

    fetchPedidos();
  }, []);

  // Função para categorizar os pedidos de acordo com o vencimento
  const categorizePedidos = (pedidos) => {
    return pedidos.map(pedido => {
      const daysLeft = calculateDaysLeft(pedido.data_vencimento);

      if (daysLeft < 0) {
        return { ...pedido, status: 'vencido' };
      } else if (daysLeft <= 3) {
        return { ...pedido, status: 'quase vencido' };
      } else {
        return { ...pedido, status: 'valido' };
      }
    });
  };

  const categorizedPedidos = categorizePedidos(pedidos);

  // Função para excluir o pedido com confirmação
  const handleDelete = (pedidoId) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      axios.delete(`http://localhost:5006/api/pedido/${pedidoId}`)
        .then(() => {
          setPedidos(pedidos.filter(pedido => pedido.pedidoId !== pedidoId));
        })
        .catch(error => {
          console.error('Erro ao excluir pedido:', error);
          alert('Erro ao excluir pedido!');
        });
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}

      <div className="container">
        <h1>Lista de Pedidos</h1>

        {/* Botão de cadastro */}
        <Link to="/novo" className="btn-cadastro">
          <i className="fas fa-plus-circle">Cadastrar Novo Pedido</i> 
        </Link>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data de Vencimento</th>
              <th>Desconto Aplicado</th>
              <th>Nome do Produto</th>
              <th>Desconto %</th>
              <th>Valor com Desconto</th> {/* Nova coluna */}
              <th>Ações</th>
              <th>Aplicar Desconto</th> {/* Coluna para o botão */}
            </tr>
          </thead>
          <tbody>
            {categorizedPedidos.map((pedido) => (
              <tr key={pedido.pedidoId} className={pedido.status.replace(" ", "-")}>
                <td>{pedido.pedidoId}</td>
                <td>
                  {/* Formata o valor para moeda com separador de milhar */}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor)}
                </td>
                <td>{pedido.status}</td>
                <td>{pedido.data_vencimento}</td>
                <td>{pedido.desconto_aplicado == 1 ? 'Sim' : 'Não'}</td>
                <td>{pedido.nome_produto}</td>
                <td>{pedido.valor_desconto}</td>
                <td>
                  {/* Calcular o valor com desconto */}
                  {pedido.desconto_aplicado == 1 ? (
                    <span>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        calculateDiscountedValue(pedido.valor, pedido.valor_desconto)
                      )}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>
                  <Link to={`/editar/${pedido.pedidoId}`} className="btn-edit">
                    <i className="fas fa-edit"></i> Editar
                  </Link>
                  <Link to="#" onClick={() => handleDelete(pedido.pedidoId)} className="btn-delete">
                    <i className="fas fa-trash"></i> Excluir
                  </Link>
                </td>
                {/* Coloca o botão "Aplicar Desconto" apenas se a condição for atendida */}
                <td>
                  {pedido.desconto_aplicado == 1 ? (
                    <Link to={`/aplicar-desconto/${pedido.pedidoId}`} className="btn-desconto">
                      Aplicar Desconto
                    </Link>
                  ) : (
                    <span>Desconto não aplicável</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidoList;
