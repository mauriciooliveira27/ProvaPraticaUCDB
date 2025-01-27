import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './AplicarDesconto.css'; // Importando o CSS

const AplicarDesconto = () => {
  const [pedido, setPedido] = useState({});
  const [descontoAplicado, setDescontoAplicado] = useState(false); // Estado para saber se o desconto já foi aplicado
  const [podeAplicarDesconto, setPodeAplicarDesconto] = useState(false); // Estado para controlar se pode aplicar desconto
  const [erroDesconto, setErroDesconto] = useState(""); // Estado para exibir erro
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Pega os detalhes do pedido com base no id
    axios.get(`http://localhost:5006/api/pedido/${id}`)
      .then((response) => {
        setPedido(response.data);
        setDescontoAplicado(response.data.desconto_aplicado == 1); // Atualiza o estado com base na API

        // Verifica a data de vencimento para definir se o campo de desconto pode ser habilitado
        const dataVencimento = new Date(response.data.data_vencimento);
        const dataAtual = new Date();
        
        // Habilita o campo de desconto apenas se a data de vencimento for posterior ao dia de hoje
        setPodeAplicarDesconto(dataVencimento > dataAtual);
      })
      .catch((error) => {
        console.error("Erro ao buscar o pedido", error);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Atualiza o pedido com o novo valor de desconto
    axios.put(`http://localhost:5006/api/pedido/${id}`, pedido)
      .then(() => {
        // Navega de volta para a página de listagem de pedidos
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o pedido", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "valor_desconto") {
      
      if (value > 30) {
        setErroDesconto("O valor do desconto não pode ultrapassar 30%.");
        return;
      } else {
        setErroDesconto(""); 
      }
    }

    setPedido((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCancel = () => {
   
    navigate("/");
  };

  
  const valorDesconto = pedido.valor_desconto || 0;

  return (
    <div>
      <h2>Aplicar Desconto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="pedidoId"
            value={pedido.pedidoId || ''}
            readOnly
          />
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="text"
            name="valor"
            value={pedido.valor || ''}
            readOnly 
          />
        </div>
        <div>
          <label>Data de Vencimento:</label>
          <input
            type="date"
            name="data_vencimento"
            value={pedido.data_vencimento || ''}
            readOnly 
          />
        </div>
        
        <div>
          <label>Nome do Produto:</label>
          <input
            type="text"
            name="nome_produto"
            value={pedido.nome_produto || ''}
            readOnly 
          />
        </div>
        
        
        <div>
          <label>Desconto %:</label>
          <input
            type="number"
            name="valor_desconto"
            value={valorDesconto}
            onChange={handleChange}
            disabled={!descontoAplicado || !podeAplicarDesconto} 
            max="30" 
          />
          {erroDesconto && <div className="error-message">{erroDesconto}</div>} 
        </div>

        <div className="buttons-container">
          <button type="submit">Aplicar Desconto</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AplicarDesconto;
